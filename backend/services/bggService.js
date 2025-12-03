/**
 * Servicio de BoardGameGeek - Configurado para usar MOCK
 * Proporciona datos simulados para búsqueda y detalles de juegos
 */

console.log('🎭 [BGG Service] Usando MOCK de BGG');
module.exports = require('./bggService.mock');

// El código del servicio real ha sido removido ya que siempre se usa el mock
// Esto simplifica el mantenimiento y evita dependencias externas

if (false) {
  // Código real del servicio BGG
  const BGG_API_BASE = 'https://boardgamegeek.com/xmlapi2';

  // Crear instancia de axios con soporte de cookies
  const jar = new CookieJar();
  const client = wrapper(axios.create({ 
    jar,
    timeout: 15000,
    maxRedirects: 3,
  }));

  /**
   * Servicio para interactuar con la API de BoardGameGeek
   */
  class BGGService {
    constructor() {
      this.parser = new xml2js.Parser({ explicitArray: false });
      this.client = client;
      this.lastRequestTime = 0;
      this.minRequestInterval = 1000;
      this.sessionInitialized = false;
      this.maxRetries = 3;
      this.retryDelay = 1000;
      this.axiosConfig = {
        headers: {
          'User-Agent': 'TabletopMastering/1.0 (+https://github.com/Trevictus/TabletopMastering)',
          'Accept': 'application/xml, text/xml, */*',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 15000,
        maxRedirects: 3,
        validateStatus: (status) => status >= 200 && status < 500,
      };
    }



  /**
   * Espera el tiempo necesario para respetar rate limiting
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Ejecutar petición con reintentos automáticos
   */
  async requestWithRetry(requestFn, context = 'BGG request') {
    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        const isNetworkError = error.code === 'ENOTFOUND' || 
                              error.code === 'ECONNREFUSED' || 
                              error.code === 'ETIMEDOUT' ||
                              error.code === 'EAI_AGAIN';
        
        if (attempt < this.maxRetries && (isNetworkError || error.response?.status === 429)) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`⚠️  [BGG] ${context} falló (intento ${attempt}/${this.maxRetries}). Reintentando en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
    throw lastError;
  }

  /**
   * Buscar juegos en BGG por nombre
   * @param {string} query - Término de búsqueda
   * @param {boolean} exact - Búsqueda exacta (1) o aproximada (0)
   * @returns {Promise<Array>} - Lista de juegos encontrados
   */
  async searchGames(query, exact = false) {
    try {
      await this.waitForRateLimit();
      
      const url = `${BGG_API_BASE}/search`;
      const params = {
        query: query,
        type: 'boardgame',
        exact: exact ? 1 : 0,
      };

      console.log('🔍 [BGG] Buscando:', query);
      
      const response = await this.requestWithRetry(async () => {
        return await this.client.get(url, { 
          params,
          ...this.axiosConfig,
        });
      }, `Búsqueda: ${query}`);
      
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        throw new Error('API de BGG temporalmente no disponible (rate limit)');
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Acceso denegado a la API de BoardGameGeek');
      }
      
      if (response.status !== 200) {
        throw new Error(`Error en API de BGG (Status: ${response.status})`);
      }
      
      const result = await this.parser.parseStringPromise(response.data);

      if (!result.items || !result.items.item) {
        console.log('📭 [BGG] Sin resultados');
        return [];
      }

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
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('No se pudo conectar con BoardGameGeek. Verifica tu conexión a Internet.');
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

      const response = await this.requestWithRetry(async () => {
        return await this.client.get(url, { 
          params,
          ...this.axiosConfig,
        });
      }, `Detalles bggId: ${bggId}`);

      if (response.status !== 200) {
        throw new Error(`Error obteniendo detalles (Status: ${response.status})`);
      }

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
      console.error('❌ [BGG] Error obteniendo detalles:', error.message);
      if (error.message.includes('no encontrado')) {
        throw error;
      }
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('No se pudo conectar con BoardGameGeek. Verifica tu conexión a Internet.');
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

      const response = await this.requestWithRetry(async () => {
        return await this.client.get(url, { 
          params,
          ...this.axiosConfig,
        });
      }, 'Hot games');
      
      if (response.status !== 200) {
        return [];
      }
      
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
      console.error('❌ [BGG] Error obteniendo Hot List:', error.message);
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('No se pudo conectar con BoardGameGeek');
      }
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
