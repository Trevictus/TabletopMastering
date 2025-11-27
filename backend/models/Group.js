const mongoose = require('mongoose');
const crypto = require('crypto');

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
      uppercase: true,
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

// Virtual para contar miembros activos
groupSchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

// Método estático para generar código de invitación único y seguro
groupSchema.statics.generateInviteCode = function () {
  // Generar bytes aleatorios y convertir a string alfanumérico
  const buffer = crypto.randomBytes(6);
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < 8; i++) {
    code += chars[buffer[i % 6] % chars.length];
  }
  
  return code;
};

// Método de instancia: verificar si un usuario es miembro
groupSchema.methods.isMember = function (userId) {
  return this.members.some((member) => member.user.equals(userId));
};

// Método de instancia: verificar si un usuario es admin
groupSchema.methods.isAdmin = function (userId) {
  return this.admin.equals(userId);
};

// Método de instancia: verificar si un usuario es admin o moderador
groupSchema.methods.isAdminOrModerator = function (userId) {
  if (this.admin.equals(userId)) return true;
  const member = this.members.find((m) => m.user.equals(userId));
  return member && (member.role === 'admin' || member.role === 'moderator');
};

// Método de instancia: obtener rol de un usuario
groupSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find((m) => m.user.equals(userId));
  return member ? member.role : null;
};

// Método de instancia: verificar si puede aceptar más miembros
groupSchema.methods.canAcceptMoreMembers = function () {
  return this.members.length < this.settings.maxMembers;
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

// Configurar virtuals en JSON y Object
groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// Índices para optimizar búsquedas
groupSchema.index({ inviteCode: 1 }, { unique: true });  // Búsqueda por código de invitación
groupSchema.index({ admin: 1 });  // Grupos de un administrador
groupSchema.index({ 'members.user': 1 });  // Búsqueda de grupos por miembro
groupSchema.index({ isActive: 1, createdAt: -1 });  // Listar grupos activos ordenados
groupSchema.index({ 'members.user': 1, isActive: 1 });  // Índice compuesto para grupos activos de usuario
groupSchema.index({ name: 'text', description: 'text' });  // Búsqueda de texto en nombre y descripción
groupSchema.index({ 'stats.totalMatches': -1 });  // Grupos más activos

module.exports = mongoose.model('Group', groupSchema);
