/**
 * @fileoverview Modelo de Juego
 * @description Define el esquema de juegos de mesa (personalizados o de BGG)
 * @module models/Game
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * Esquema de Juego
 * @typedef {Object} Game
 * @property {string} name - Nombre del juego
 * @property {string} description - Descripción
 * @property {number} minPlayers - Mínimo de jugadores
 * @property {number} maxPlayers - Máximo de jugadores
 * @property {string} source - Origen (bgg/custom)
 * @property {number} bggId - ID en BoardGameGeek
 */
const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del juego es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    },
    description: {
      type: String,
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
      default: '',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Board+Game',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    minPlayers: {
      type: Number,
      required: [true, 'El número mínimo de jugadores es obligatorio'],
      min: [1, 'Debe haber al menos 1 jugador'],
    },
    maxPlayers: {
      type: Number,
      required: [true, 'El número máximo de jugadores es obligatorio'],
      min: [1, 'Debe haber al menos 1 jugador'],
      validate: {
        validator: function (value) {
          return value >= this.minPlayers;
        },
        message: 'El número máximo de jugadores debe ser mayor o igual al mínimo',
      },
    },
    playingTime: {
      type: Number,
      default: 0,
      min: [0, 'El tiempo de juego no puede ser negativo'],
    },
    minPlayTime: {
      type: Number,
      default: 0,
    },
    maxPlayTime: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    mechanics: [
      {
        type: String,
        trim: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ['fácil', 'medio', 'difícil', 'experto', ''],
      default: '',
    },
    // Campos específicos de BGG
    source: {
      type: String,
      enum: ['bgg', 'custom'],
      required: [true, 'El origen del juego es obligatorio'],
      default: 'custom',
    },
    bggId: {
      type: Number,
    },
    yearPublished: {
      type: Number,
      min: [1800, 'El año debe ser mayor a 1800'],
      max: [new Date().getFullYear() + 5, 'El año no puede ser muy lejano en el futuro'],
    },
    designer: [
      {
        type: String,
        trim: true,
      },
    ],
    publisher: [
      {
        type: String,
        trim: true,
      },
    ],
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },
      usersRated: {
        type: Number,
        default: 0,
      },
      bayesAverage: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },
    },
    // Campo group opcional (solo para juegos en grupos)
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stats: {
      timesPlayed: {
        type: Number,
        default: 0,
      },
      lastPlayed: {
        type: Date,
      },
    },
    // Metadatos de sincronización con BGG
    bggLastSync: {
      type: Date,
    },
    // Campos personalizables por el usuario
    customNotes: {
      type: String,
      maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas más eficientes
gameSchema.index({ name: 'text', description: 'text' });  // Búsqueda de texto completo
gameSchema.index({ group: 1, name: 1 });  // Juegos por grupo ordenados por nombre
gameSchema.index({ group: 1, isActive: 1, createdAt: -1 });  // Juegos activos de grupo por fecha
gameSchema.index({ bggId: 1 }, { sparse: true });  // Búsqueda por ID de BGG (sparse para nulls)
gameSchema.index({ source: 1, isActive: 1 });  // Filtrar por fuente
gameSchema.index({ 'rating.average': -1, isActive: 1 });  // Top rated juegos activos
gameSchema.index({ addedBy: 1, group: 1, isActive: 1 });  // Juegos personales vs grupo
gameSchema.index({ 'stats.timesPlayed': -1, isActive: 1 });  // Juegos más jugados
gameSchema.index({ categories: 1 });  // Filtrar por categoría
gameSchema.index({ minPlayers: 1, maxPlayers: 1 });  // Filtrar por número de jugadores

// Método para verificar si necesita actualización desde BGG (30 días)
gameSchema.methods.needsBGGUpdate = function() {
  if (this.source !== 'bgg') return false;
  if (!this.bggLastSync) return true;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.bggLastSync < thirtyDaysAgo;
};

// Virtual para obtener el tiempo de juego formateado
gameSchema.virtual('playingTimeFormatted').get(function() {
  if (this.minPlayTime && this.maxPlayTime) {
    return `${this.minPlayTime}-${this.maxPlayTime} minutos`;
  }
  if (this.playingTime) {
    return `${this.playingTime} minutos`;
  }
  return 'No especificado';
});

// Asegurar que los virtuals se incluyan en JSON
gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Game', gameSchema);
