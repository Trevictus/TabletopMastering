const axios = require('axios');
const xml2js = require('xml2js');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const BGGCache = require('../models/BGGCache');

// Detectar si estamos en modo test a través de variable de entorno
const USE_MOCK = process.env.USE_BGG_MOCK === 'true' || process.env.NODE_ENV === 'test';

// Si estamos en modo mock, usar el servicio mock en lugar del real
if (USE_MOCK) {
  console.log('🎭 [BGG Service] Usando MOCK de BGG para tests');
  module.exports = require('./bggService.mock');
} else {
  // Código real del servicio BGG
  const BGG_API_BASE = 'https://boardgamegeek.com/xmlapi2';

  // Crear instancia de axios con soporte de cookies
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  /**
   * Servicio para interactuar con la API de BoardGameGeek
   */
  class BGGService {
    constructor() {
      this.parser = new xml2js.Parser({ explicitArray: false });
      this.client = client;
      this.lastRequestTime = 0;
      this.minRequestInterval = 1000; // Mínimo 1 segundo entre peticiones
      this.sessionInitialized = false;
      this.axiosConfig = {
        headers: {
          'User-Agent': 'TabletopMastering/1.0 (+https://github.com/Trevictus/TabletopMastering)',
          'Accept': 'application/xml, text/xml, */*',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 20000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
        withCredentials: true,
      };
    }

  /**
   * Inicializar sesión con BGG para obtener cookies
   */
  async initializeSession() {
    if (this.sessionInitialized) return;
    
    try {
      console.log('🔐 [BGG] Inicializando sesión...');
      await this.client.get('https://boardgamegeek.com', {
        headers: this.axiosConfig.headers,
        timeout: 10000,
        validateStatus: () => true,
      });
      this.sessionInitialized = true;
      console.log('✅ [BGG] Sesión inicializada');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.warn('⚠️  [BGG] No se pudo inicializar sesión, continuando sin ella...');
    }
  }

  /**
   * Espera el tiempo necesario para respetar rate limiting
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`⏱️  [BGG] Esperando ${waitTime}ms para respetar rate limit`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Buscar juegos en BGG por nombre
   * @param {string} query - Término de búsqueda
   * @param {boolean} exact - Búsqueda exacta (1) o aproximada (0)
   * @returns {Promise<Array>} - Lista de juegos encontrados
   */
  async searchGames(query, exact = false) {
    try {
      await this.initializeSession();
      await this.waitForRateLimit();
      
      const url = `${BGG_API_BASE}/search`;
      const params = {
        query: query,
        type: 'boardgame',
        exact: exact ? 1 : 0,
      };

      console.log('🔍 [BGG] Buscando:', query);
      console.log('🌐 [BGG] URL:', `${url}?query=${query}&type=boardgame&exact=${exact ? 1 : 0}`);
      
      const response = await this.client.get(url, { 
        params,
        ...this.axiosConfig,
      });
      
      // Check for rate limiting or errors
      if (response.status === 429) {
        console.warn('⚠️  [BGG] Rate limit alcanzado, esperando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        throw new Error('API de BGG temporalmente no disponible (rate limit). Intenta de nuevo en un momento.');
      }
      
      if (response.status === 401 || response.status === 403) {
        console.error('🚫 [BGG] Acceso denegado. Status:', response.status);
        throw new Error('No se pudo acceder a la API de BoardGameGeek. Verifica la conectividad.');
      }
      
      if (response.status !== 200) {
        console.error('❌ [BGG] Status inesperado:', response.status);
        throw new Error(`Error en API de BGG (Status: ${response.status})`);
      }
      
      const result = await this.parser.parseStringPromise(response.data);

      if (!result.items || !result.items.item) {
        console.log('📭 [BGG] Sin resultados para:', query);
        return [];
      }

      // Normalizar respuesta (puede ser objeto único o array)
      const items = Array.isArray(result.items.item) 
        ? result.items.item 
        : [result.items.item];

      console.log(`✅ [BGG] Encontrados ${items.length} resultados`);

      return items.map(item => ({
        bggId: parseInt(item.$.id),
        name: item.name.$.value,
        yearPublished: item.yearpublished ? parseInt(item.yearpublished.$.value) : null,
      }));
    } catch (error) {
      console.error('❌ [BGG] Error buscando:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Error al buscar juegos en BoardGameGeek');
    }
  }

  /**
   * Obtener detalles completos de un juego por su ID de BGG
   * Implementa caché de MongoDB para reducir llamadas a la API
   * @param {number} bggId - ID del juego en BGG
   * @param {boolean} forceRefresh - Forzar actualización ignorando caché
   * @returns {Promise<Object>} - Información completa del juego
   */
  async getGameDetails(bggId, forceRefresh = false) {
    try {
      // Intentar obtener de caché si no se fuerza actualización
      if (!forceRefresh) {
        const cachedData = await BGGCache.getValidCache(bggId);
        if (cachedData) {
          console.log(`✅ [BGG Cache] Cache HIT para bggId: ${bggId}`);
          return cachedData;
        }
        console.log(`❌ [BGG Cache] Cache MISS para bggId: ${bggId}`);
      } else {
        console.log(`🔄 [BGG Cache] Forzando actualización para bggId: ${bggId}`);
      }

      // Si no hay caché o se fuerza actualización, consultar BGG
      const url = `${BGG_API_BASE}/thing`;
      const params = {
        id: bggId,
        stats: 1,
      };

      await this.waitForRateLimit();

      // BGG puede tardar, damos más tiempo
      const response = await this.client.get(url, { 
        params,
        timeout: 20000,
        ...this.axiosConfig,
      });

      const result = await this.parser.parseStringPromise(response.data);

      if (!result.items || !result.items.item) {
        throw new Error('Juego no encontrado en BGG');
      }

      const item = result.items.item;

      // Extraer nombres (primary name)
      const names = Array.isArray(item.name) ? item.name : [item.name];
      const primaryName = names.find(n => n.$.type === 'primary')?.$.value || names[0]?.$.value;

      // Extraer categorías
      const categories = this.extractValues(item.link, 'boardgamecategory');
      
      // Extraer mecánicas
      const mechanics = this.extractValues(item.link, 'boardgamemechanic');

      // Extraer diseñadores
      const designers = this.extractValues(item.link, 'boardgamedesigner');

      // Extraer editores
      const publishers = this.extractValues(item.link, 'boardgamepublisher');

      // Extraer imágenes
      const image = item.image || '';
      const thumbnail = item.thumbnail || '';

      // Extraer estadísticas
      const stats = item.statistics?.ratings || {};

      const gameData = {
        bggId: parseInt(item.$.id),
        name: primaryName,
        description: this.cleanDescription(item.description || ''),
        image: image,
        thumbnail: thumbnail,
        yearPublished: item.yearpublished ? parseInt(item.yearpublished.$.value) : null,
        minPlayers: parseInt(item.minplayers?.$.value || 1),
        maxPlayers: parseInt(item.maxplayers?.$.value || 1),
        playingTime: parseInt(item.playingtime?.$.value || 0),
        minPlayTime: parseInt(item.minplaytime?.$.value || 0),
        maxPlayTime: parseInt(item.maxplaytime?.$.value || 0),
        categories: categories,
        mechanics: mechanics,
        designer: designers,
        publisher: publishers,
        rating: {
          average: parseFloat(stats.average?.$.value || 0),
          usersRated: parseInt(stats.usersrated?.$.value || 0),
          bayesAverage: parseFloat(stats.bayesaverage?.$.value || 0),
        },
        source: 'bgg',
        bggLastSync: new Date(),
      };

      // Guardar en caché (30 días por defecto)
      await BGGCache.saveToCache(bggId, gameData);
      console.log(`💾 [BGG Cache] Datos guardados en caché para bggId: ${bggId}`);

      return gameData;
    } catch (error) {
      console.error('Error obteniendo detalles de BGG:', error.message);
      if (error.message.includes('no encontrado')) {
        throw error;
      }
      throw new Error('Error al obtener detalles del juego desde BoardGameGeek');
    }
  }

  /**
   * Extraer valores de un tipo específico de link
   * @param {Array|Object} links - Links del juego
   * @param {string} type - Tipo de link a extraer
   * @returns {Array<string>} - Valores extraídos
   */
  extractValues(links, type) {
    if (!links) return [];
    
    const linksArray = Array.isArray(links) ? links : [links];
    return linksArray
      .filter(link => link.$.type === type)
      .map(link => link.$.value)
      .filter(value => value && value !== '(Uncredited)');
  }

  /**
   * Limpiar la descripción HTML de BGG
   * @param {string} description - Descripción con HTML
   * @returns {string} - Descripción limpia
   */
  cleanDescription(description) {
    if (!description) return '';
    
    return description
      .replace(/&[#\w]+;/g, '') // Eliminar entidades HTML
      .replace(/<[^>]+>/g, '') // Eliminar tags HTML
      .replace(/\n{3,}/g, '\n\n') // Reducir saltos de línea múltiples
      .trim()
      .substring(0, 2000); // Limitar longitud
  }

  /**
   * Obtener juegos populares (Hot List)
   * @param {number} limit - Número de juegos a obtener
   * @returns {Promise<Array>} - Lista de IDs de juegos populares
   */
  async getHotGames(limit = 10) {
    try {
      const url = `${BGG_API_BASE}/hot`;
      const params = {
        type: 'boardgame',
      };

      await this.waitForRateLimit();

      const response = await this.client.get(url, { 
        params,
        ...this.axiosConfig,
      });
      const result = await this.parser.parseStringPromise(response.data);

      if (!result.items || !result.items.item) {
        return [];
      }

      const items = Array.isArray(result.items.item) 
        ? result.items.item 
        : [result.items.item];

      return items.slice(0, limit).map(item => ({
        bggId: parseInt(item.$.id),
        rank: parseInt(item.$.rank),
        name: item.name.$.value,
        yearPublished: item.yearpublished ? parseInt(item.yearpublished.$.value) : null,
        thumbnail: item.thumbnail?.$.value || '',
      }));
    } catch (error) {
      console.error('Error obteniendo Hot List de BGG:', error.message);
      throw new Error('Error al obtener juegos populares desde BoardGameGeek');
    }
  }

  /**
   * Validar si un ID de BGG existe
   * @param {number} bggId - ID a validar
   * @returns {Promise<boolean>} - true si existe
   */
  async validateBGGId(bggId) {
    try {
      await this.getGameDetails(bggId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Invalidar caché de un juego específico
   * Útil cuando se necesita forzar actualización
   * @param {number} bggId - ID del juego a invalidar
   * @returns {Promise<void>}
   */
  async invalidateCache(bggId) {
    await BGGCache.invalidateCache(bggId);
    console.log(`🗑️ [BGG Cache] Caché invalidada para bggId: ${bggId}`);
  }

  /**
   * Obtener estadísticas del caché
   * @returns {Promise<Object>} - Estadísticas del caché
   */
  async getCacheStats() {
    return await BGGCache.getCacheStats();
  }

  /**
   * Limpiar toda la caché
   * @returns {Promise<void>}
   */
  async clearCache() {
    await BGGCache.clearAllCache();
    console.log('🧹 [BGG Cache] Toda la caché ha sido limpiada');
  }
}

  module.exports = new BGGService();
}
