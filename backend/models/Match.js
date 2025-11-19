const mongoose = require('mongoose');

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
matchSchema.index({ group: 1, scheduledDate: -1 });
matchSchema.index({ game: 1, status: 1 });
matchSchema.index({ 'players.user': 1 });

// Validación: al menos 2 jugadores
matchSchema.pre('save', function (next) {
  if (this.players.length < 2) {
    next(new Error('Una partida debe tener al menos 2 jugadores'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Match', matchSchema);
