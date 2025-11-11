const Game = require('../models/Game');
const Group = require('../models/Group');
const bggService = require('../services/bggService');

/**
 * @desc    Buscar juegos en BoardGameGeek (sin guardar)
 * @route   GET /api/games/search-bgg
 * @access  Private
 */
exports.searchBGG = async (req, res, next) => {
  try {
    const { name, exact } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "name" es obligatorio',
      });
    }

    const results = await bggService.searchGames(name, exact === 'true');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener detalles de un juego de BGG por ID
 * @route   GET /api/games/bgg/:bggId
 * @access  Private
 */
exports.getBGGDetails = async (req, res, next) => {
  try {
    const { bggId } = req.params;

    if (!bggId || isNaN(bggId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de BGG inválido',
      });
    }

    const gameDetails = await bggService.getGameDetails(parseInt(bggId));

    res.status(200).json({
      success: true,
      data: gameDetails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Añadir un juego de BGG a un grupo
 * @route   POST /api/games/add-from-bgg
 * @access  Private
 */
exports.addFromBGG = async (req, res, next) => {
  try {
    const { bggId, groupId, customNotes } = req.body;

    // Validaciones
    if (!bggId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de BGG es obligatorio',
      });
    }

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del grupo es obligatorio',
      });
    }

    // Verificar que el grupo existe y el usuario es miembro
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Verificar si el juego ya existe en el grupo
    const existingGame = await Game.findOne({ 
      bggId: bggId, 
      group: groupId,
      isActive: true 
    });

    if (existingGame) {
      return res.status(400).json({
        success: false,
        message: 'Este juego ya está en la colección del grupo',
        data: existingGame,
      });
    }

    // Obtener detalles del juego desde BGG
    const bggData = await bggService.getGameDetails(parseInt(bggId));

    // Crear el juego en la base de datos
    const game = await Game.create({
      ...bggData,
      group: groupId,
      addedBy: req.user._id,
      customNotes: customNotes || '',
    });

    // Populate para devolver información completa
    await game.populate('addedBy', 'name email');
    await game.populate('group', 'name');

    res.status(201).json({
      success: true,
      message: 'Juego añadido desde BGG exitosamente',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear un juego personalizado
 * @route   POST /api/games
 * @access  Private
 */
exports.createGame = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      minPlayers,
      maxPlayers,
      playingTime,
      categories,
      mechanics,
      difficulty,
      groupId,
      yearPublished,
      customNotes,
    } = req.body;

    // Validaciones
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del juego es obligatorio',
      });
    }

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del grupo es obligatorio',
      });
    }

    if (!minPlayers || !maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'El número de jugadores es obligatorio',
      });
    }

    // Verificar que el grupo existe y el usuario es miembro
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Crear juego personalizado
    const game = await Game.create({
      name,
      description: description || '',
      image: image || undefined,
      minPlayers,
      maxPlayers,
      playingTime: playingTime || 0,
      categories: categories || [],
      mechanics: mechanics || [],
      difficulty: difficulty || '',
      yearPublished,
      group: groupId,
      addedBy: req.user._id,
      source: 'custom',
      customNotes: customNotes || '',
    });

    await game.populate('addedBy', 'name email');
    await game.populate('group', 'name');

    res.status(201).json({
      success: true,
      message: 'Juego personalizado creado exitosamente',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar juegos (global o por grupo)
 * @route   GET /api/games
 * @access  Private
 */
exports.getGames = async (req, res, next) => {
  try {
    const { groupId, source, search, page = 1, limit = 20 } = req.query;

    // Construir filtro
    const filter = { isActive: true };

    // Filtrar por grupo si se proporciona
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      // Verificar que el usuario es miembro
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'No eres miembro de este grupo',
        });
      }

      filter.group = groupId;
    } else {
      // Si no se especifica grupo, solo mostrar juegos globales de BGG
      filter.source = 'bgg';
      filter.group = { $exists: false };
    }

    // Filtrar por fuente
    if (source && ['bgg', 'custom'].includes(source)) {
      filter.source = source;
    }

    // Búsqueda por texto
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Game.countDocuments(filter);

    const games = await Game.find(filter)
      .populate('addedBy', 'name email')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: games.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: games,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un juego por ID
 * @route   GET /api/games/:id
 * @access  Private
 */
exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('addedBy', 'name email avatar')
      .populate('group', 'name description avatar');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar acceso si tiene grupo
    if (game.group) {
      const group = await Group.findById(game.group._id);
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este juego',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un juego
 * @route   PUT /api/games/:id
 * @access  Private
 */
exports.updateGame = async (req, res, next) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar permisos (solo si tiene grupo)
    if (game.group) {
      const group = await Group.findById(game.group);
      const member = group.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar este juego',
        });
      }

      // Solo admin puede editar, o el usuario que lo añadió
      if (member.role !== 'admin' && game.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Solo el administrador o quien añadió el juego puede editarlo',
        });
      }
    }

    // Campos permitidos para editar según el source
    let allowedFields;
    
    if (game.source === 'bgg') {
      // Para juegos de BGG, solo permitir editar campos personalizados
      allowedFields = ['customNotes', 'difficulty', 'image'];
    } else {
      // Para juegos custom, permitir editar todo excepto source y bggId
      allowedFields = [
        'name', 'description', 'image', 'minPlayers', 'maxPlayers',
        'playingTime', 'minPlayTime', 'maxPlayTime', 'categories', 'mechanics',
        'difficulty', 'yearPublished', 'customNotes'
      ];
    }

    // Filtrar campos permitidos
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    game = await Game.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('addedBy', 'name email')
      .populate('group', 'name');

    res.status(200).json({
      success: true,
      message: 'Juego actualizado exitosamente',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sincronizar juego de BGG (actualizar datos)
 * @route   PUT /api/games/:id/sync-bgg
 * @access  Private
 */
exports.syncBGGGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    if (game.source !== 'bgg') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden sincronizar juegos de BGG',
      });
    }

    // Verificar permisos
    if (game.group) {
      const group = await Group.findById(game.group);
      const isMember = group.members.some(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para sincronizar este juego',
        });
      }
    }

    // Obtener datos actualizados de BGG
    const bggData = await bggService.getGameDetails(game.bggId);

    // Actualizar campos de BGG (preservando customNotes y otros campos personalizados)
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      {
        name: bggData.name,
        description: bggData.description,
        image: bggData.image,
        thumbnail: bggData.thumbnail,
        yearPublished: bggData.yearPublished,
        minPlayers: bggData.minPlayers,
        maxPlayers: bggData.maxPlayers,
        playingTime: bggData.playingTime,
        minPlayTime: bggData.minPlayTime,
        maxPlayTime: bggData.maxPlayTime,
        categories: bggData.categories,
        mechanics: bggData.mechanics,
        designer: bggData.designer,
        publisher: bggData.publisher,
        rating: bggData.rating,
        bggLastSync: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate('addedBy', 'name email')
      .populate('group', 'name');

    res.status(200).json({
      success: true,
      message: 'Juego sincronizado con BGG exitosamente',
      data: updatedGame,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un juego (soft delete)
 * @route   DELETE /api/games/:id
 * @access  Private
 */
exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar permisos
    if (game.group) {
      const group = await Group.findById(game.group);
      const member = group.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este juego',
        });
      }

      // Solo admin puede eliminar, o el usuario que lo añadió
      if (member.role !== 'admin' && game.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Solo el administrador o quien añadió el juego puede eliminarlo',
        });
      }
    }

    // Soft delete
    game.isActive = false;
    await game.save();

    res.status(200).json({
      success: true,
      message: 'Juego eliminado exitosamente',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener juegos populares de BGG
 * @route   GET /api/games/bgg/hot
 * @access  Private
 */
exports.getHotGames = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const hotGames = await bggService.getHotGames(parseInt(limit));

    res.status(200).json({
      success: true,
      count: hotGames.length,
      data: hotGames,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de juegos de un grupo
 * @route   GET /api/games/stats/:groupId
 * @access  Private
 */
exports.getGroupGameStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Verificar acceso al grupo
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    const isMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Obtener estadísticas
    const totalGames = await Game.countDocuments({ group: groupId, isActive: true });
    const bggGames = await Game.countDocuments({ group: groupId, source: 'bgg', isActive: true });
    const customGames = await Game.countDocuments({ group: groupId, source: 'custom', isActive: true });
    
    const topRatedGames = await Game.find({ group: groupId, isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('name rating.average image');

    const mostPlayedGames = await Game.find({ group: groupId, isActive: true })
      .sort({ 'stats.timesPlayed': -1 })
      .limit(5)
      .select('name stats.timesPlayed image');

    const categoriesStats = await Game.aggregate([
      { $match: { group: group._id, isActive: true } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalGames,
        bySource: {
          bgg: bggGames,
          custom: customGames,
        },
        topRated: topRatedGames,
        mostPlayed: mostPlayedGames,
        topCategories: categoriesStats.map(c => ({ name: c._id, count: c.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};
