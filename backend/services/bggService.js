const axios = require('axios');
const xml2js = require('xml2js');
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

  /**
   * Servicio para interactuar con la API de BoardGameGeek
   */
  class BGGService {
    constructor() {
      this.parser = new xml2js.Parser({ explicitArray: false });
      this.axiosConfig = {
        headers: {
          'User-Agent': 'TabletopMastering/1.0 (juanfu224@github)',
        },
      };
    }

  /**
   * Buscar juegos en BGG por nombre
   * @param {string} query - Término de búsqueda
   * @param {boolean} exact - Búsqueda exacta (1) o aproximada (0)
   * @returns {Promise<Array>} - Lista de juegos encontrados
   */
  async searchGames(query, exact = false) {
    try {
      const url = `${BGG_API_BASE}/search`;
      const params = {
        query: query,
        type: 'boardgame',
        exact: exact ? 1 : 0,
      };

      const response = await axios.get(url, { 
        params,
        ...this.axiosConfig,
      });
      const result = await this.parser.parseStringPromise(response.data);

      if (!result.items || !result.items.item) {
        return [];
      }

      // Normalizar respuesta (puede ser objeto único o array)
      const items = Array.isArray(result.items.item) 
        ? result.items.item 
        : [result.items.item];

      return items.map(item => ({
        bggId: parseInt(item.$.id),
        name: item.name.$.value,
        yearPublished: item.yearpublished ? parseInt(item.yearpublished.$.value) : null,
      }));
    } catch (error) {
      console.error('Error buscando en BGG:', error.message);
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

      // BGG puede tardar, damos más tiempo
      const response = await axios.get(url, { 
        params,
        timeout: 10000,
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

      const response = await axios.get(url, { 
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
