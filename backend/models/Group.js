const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del grupo es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    description: {
      type: String,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/200',
    },
    inviteCode: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El grupo debe tener un administrador'],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['admin', 'moderator', 'member'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      isPrivate: {
        type: Boolean,
        default: true,
      },
      maxMembers: {
        type: Number,
        default: 50,
        min: [2, 'El grupo debe permitir al menos 2 miembros'],
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
    },
    stats: {
      totalMatches: {
        type: Number,
        default: 0,
      },
      totalGames: {
        type: Number,
        default: 0,
      },
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

// Método para generar código de invitación único
groupSchema.statics.generateInviteCode = function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Middleware: agregar al admin como miembro al crear el grupo
groupSchema.pre('save', function (next) {
  if (this.isNew && !this.members.some((m) => m.user.equals(this.admin))) {
    this.members.push({
      user: this.admin,
      role: 'admin',
    });
  }
  next();
});

// Índices
groupSchema.index({ inviteCode: 1 }, { unique: true });
groupSchema.index({ admin: 1 });
groupSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Group', groupSchema);
