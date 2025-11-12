const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No devolver la contraseña en las consultas por defecto
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    description: {
      type: String,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
      default: '',
    },
    quote: {
      type: String,
      maxlength: [200, 'La cita no puede exceder 200 caracteres'],
      default: '',
    },
    stats: {
      totalMatches: {
        type: Number,
        default: 0,
      },
      totalWins: {
        type: Number,
        default: 0,
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para ocultar información sensible en las respuestas JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
