const mongoose = require('mongoose');

/**
 * Esquema para cachear datos de BoardGameGeek
 * Reduce llamadas a la API externa y mejora el rendimiento
 */
const bggCacheSchema = new mongoose.Schema(
  {
    bggId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: Object,
      required: true,
    },
    lastSync: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice TTL para auto-eliminación de documentos expirados
// MongoDB eliminará automáticamente documentos cuando expiresAt < now
bggCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Método estático para obtener datos de caché válidos
bggCacheSchema.statics.getValidCache = async function(bggId) {
  const cached = await this.findOne({
    bggId: bggId,
    expiresAt: { $gt: new Date() },
  });
  
  return cached ? cached.data : null;
};

// Método estático para guardar en caché con expiración de 30 días
bggCacheSchema.statics.saveToCache = async function(bggId, data, expirationDays = 30) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);
  
  await this.findOneAndUpdate(
    { bggId: bggId },
    {
      bggId: bggId,
      data: data,
      lastSync: new Date(),
      expiresAt: expiresAt,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

// Método estático para invalidar caché de un juego específico
bggCacheSchema.statics.invalidateCache = async function(bggId) {
  await this.deleteOne({ bggId: bggId });
};

// Método estático para limpiar toda la caché (útil para mantenimiento)
bggCacheSchema.statics.clearAllCache = async function() {
  await this.deleteMany({});
};

// Método estático para obtener estadísticas de caché
bggCacheSchema.statics.getCacheStats = async function() {
  const total = await this.countDocuments();
  const expired = await this.countDocuments({
    expiresAt: { $lt: new Date() },
  });
  const valid = total - expired;
  
  return {
    total,
    valid,
    expired,
    hitRate: total > 0 ? (valid / total * 100).toFixed(2) + '%' : '0%',
  };
};

module.exports = mongoose.model('BGGCache', bggCacheSchema);
