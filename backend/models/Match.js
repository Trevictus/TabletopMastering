/**
 * @fileoverview Modelo de Partida
 * @description Define el esquema de partidas con jugadores, resultados y estadísticas
 * @module models/Match
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * Esquema de Partida
 * @typedef {Object} Match
 * @property {ObjectId} game - Juego de la partida
 * @property {ObjectId} group - Grupo donde se juega
 * @property {Date} scheduledDate - Fecha programada
 * @property {string} status - Estado (programada/en_curso/finalizada/cancelada)
 * @property {Array} players - Jugadores participantes
 * @property {ObjectId} winner - Ganador de la partida
 */
const matchSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'El juego es obligatorio'],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'El grupo es obligatorio'],
    },
    scheduledDate: {
      type: Date,
      required: [true, 'La fecha programada es obligatoria'],
    },
    actualDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['programada', 'en_curso', 'finalizada', 'cancelada'],
      default: 'programada',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'La ubicación no puede exceder 200 caracteres'],
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        confirmed: {
          type: Boolean,
          default: false,
        },
        score: {
          type: Number,
          default: 0,
        },
        position: {
          type: Number,
          min: 1,
        },
        pointsEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function(val) {
          // Si hay ganador, debe ser uno de los jugadores
          if (!val) return true; // Si no hay ganador, ok
          return this.players.some(p => p.user.toString() === val.toString());
        },
        message: 'El ganador debe ser uno de los jugadores'
      }
    },
    duration: {
      value: {
        type: Number,
        min: [1, 'La duración debe ser al menos 1'],
        max: [1440, 'La duración máxima es 24 horas'],
      },
      unit: {
        type: String,
        enum: ['minutos', 'horas'],
        default: 'minutos',
      },
    },
    notes: {
      type: String,
      maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
matchSchema.index({ group: 1, scheduledDate: -1 });  // Partidas por grupo ordenadas por fecha
matchSchema.index({ group: 1, status: 1, scheduledDate: -1 });  // Filtrar por grupo+estado+fecha
matchSchema.index({ game: 1, status: 1 });  // Estadísticas por juego
matchSchema.index({ 'players.user': 1, status: 1 });  // Partidas de un usuario por estado
matchSchema.index({ createdBy: 1, createdAt: -1 });  // Partidas creadas por usuario
matchSchema.index({ status: 1, scheduledDate: 1 });  // Próximas partidas programadas
matchSchema.index({ winner: 1 }, { sparse: true });  // Consultas de ganadores (sparse para optimizar)

// Validación: al menos 2 jugadores (solo en creación o cuando players está definido)
matchSchema.pre('save', function (next) {
  // Solo validar si players está presente (puede no estarlo en updates parciales)
  if (this.players && this.players.length < 2) {
    next(new Error('Una partida debe tener al menos 2 jugadores'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Match', matchSchema);
