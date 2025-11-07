const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del juego es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
      default: '',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Board+Game',
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
    duration: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        enum: ['minutos', 'horas'],
        default: 'minutos',
      },
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ['fácil', 'medio', 'difícil', 'experto'],
      default: 'medio',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'El juego debe pertenecer a un grupo'],
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
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas más eficientes
gameSchema.index({ name: 'text', description: 'text' });
gameSchema.index({ group: 1, name: 1 });

module.exports = mongoose.model('Game', gameSchema);
