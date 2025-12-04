const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Genera sugerencias de nicknames alternativos basados en el original
 * @param {string} baseNickname - El nickname base que ya está en uso
 * @returns {Promise<string[]>} - Array de sugerencias disponibles
 */
const generateNicknameSuggestions = async (baseNickname) => {
  const suggestions = [];
  const base = baseNickname.toLowerCase().replace(/[0-9_]+$/, ''); // Quitar números/guiones del final
  
  // Estrategias de generación de sugerencias
  const candidates = [
    `${base}_`,
    `${base}1`,
    `${base}_1`,
    `${base}2`,
    `${base}_2`,
    `${base}123`,
    `${base}_pro`,
    `${base}_gamer`,
    `${base}_tm`,
    `${baseNickname}1`,
    `${baseNickname}_`,
    `${baseNickname}2`,
    `x${base}x`,
    `the_${base}`,
    `${base}_bg`,
  ];
  
  // Verificar cuáles están disponibles
  for (const candidate of candidates) {
    if (candidate.length >= 3 && candidate.length <= 20 && /^[a-z0-9_]+$/.test(candidate)) {
      const exists = await User.findOne({ nickname: candidate });
      if (!exists) {
        suggestions.push(candidate);
        if (suggestions.length >= 3) break; // Máximo 3 sugerencias
      }
    }
  }
  
  // Si aún no hay suficientes, agregar con números aleatorios
  while (suggestions.length < 3) {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const candidate = `${base}${randomNum}`;
    if (candidate.length <= 20) {
      const exists = await User.findOne({ nickname: candidate });
      if (!exists && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
    }
  }
  
  return suggestions;
};

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { nickname, name, email, password } = req.body;

    // Verificar si el email ya existe
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Verificar si el nickname ya existe
    const nicknameExists = await User.findOne({ nickname: nickname.toLowerCase() });
    if (nicknameExists) {
      const suggestions = await generateNicknameSuggestions(nickname);
      return res.status(400).json({
        success: false,
        message: 'El nombre de jugador ya está en uso',
        suggestions,
      });
    }

    // Crear el usuario
    const user = await User.create({
      nickname: nickname.toLowerCase(),
      name,
      email: email.toLowerCase(),
      password,
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'El email o nombre de jugador es obligatorio',
      });
    }

    // Buscar usuario por email O nickname
    const searchValue = identifier.toLowerCase().trim();
    
    const user = await User.findOne({
      $or: [
        { email: searchValue },
        { nickname: searchValue }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar la contraseña
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado',
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user._id,
          nickname: user.nickname,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          stats: user.stats,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener perfil del usuario autenticado
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('groups', 'name avatar');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar perfil del usuario autenticado
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { nickname, name, email, avatar, description, quote } = req.body;
    const userId = req.user._id;

    // Validar unicidad de nickname si se está cambiando
    if (nickname) {
      const existingNickname = await User.findOne({ 
        nickname: nickname.toLowerCase().trim(),
        _id: { $ne: userId }
      });
      if (existingNickname) {
        const suggestions = await generateNicknameSuggestions(nickname);
        return res.status(400).json({
          success: false,
          message: 'Este nombre de jugador ya está en uso',
          suggestions,
        });
      }
    }

    // Validar unicidad de email si se está cambiando
    if (email) {
      const existingEmail = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: userId }
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Este correo electrónico ya está registrado',
        });
      }
    }

    const user = await User.findById(userId);

    if (nickname) user.nickname = nickname.toLowerCase().trim();
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (avatar) user.avatar = avatar;
    if (description !== undefined) user.description = description;
    if (quote !== undefined) user.quote = quote;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verificar disponibilidad de nickname
 * @route   POST /api/auth/check-nickname
 * @access  Public
 */
const checkNickname = async (req, res, next) => {
  try {
    const { nickname, userId } = req.body;
    
    if (!nickname || nickname.trim().length < 3) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'El nombre de jugador debe tener al menos 3 caracteres',
      });
    }

    const normalizedNickname = nickname.toLowerCase().trim();
    
    // Validar formato (letras, números, guiones y guiones bajos)
    if (!/^[a-z0-9_-]+$/.test(normalizedNickname)) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Solo letras, números, guiones y guiones bajos',
      });
    }

    // Buscar si existe (excluyendo al usuario actual si se proporciona)
    const query = { nickname: normalizedNickname };
    if (userId) {
      query._id = { $ne: userId };
    }
    
    const exists = await User.findOne(query);
    
    if (exists) {
      const suggestions = await generateNicknameSuggestions(nickname);
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Este nombre de jugador ya está en uso',
        suggestions,
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      message: 'Nombre de jugador disponible',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verificar disponibilidad de email
 * @route   POST /api/auth/check-email
 * @access  Public
 */
const checkEmail = async (req, res, next) => {
  try {
    const { email, userId } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'El email es obligatorio',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Validar formato
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'El formato del email no es válido',
      });
    }

    // Buscar si existe (excluyendo al usuario actual si se proporciona)
    const query = { email: normalizedEmail };
    if (userId) {
      query._id = { $ne: userId };
    }
    
    const exists = await User.findOne(query);
    
    if (exists) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Este email ya está registrado',
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      message: 'Email disponible',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  checkNickname,
  checkEmail,
};
