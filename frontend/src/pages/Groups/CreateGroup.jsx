import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { MdArrowBack } from 'react-icons/md';
import { GiTeamIdea } from 'react-icons/gi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import styles from './CreateGroup.module.css';
import groupService from '../../services/groupService';

/**
 * Página para crear un nuevo grupo
 */
const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadGroups } = useGroup();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('El nombre del grupo es requerido');
      }

      const response = await groupService.createGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      // Recargar grupos
      await loadGroups();

      // Navegar a grupos
      navigate('/groups', {
        state: { message: `✅ Grupo "${formData.name}" creado exitosamente` }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createGroupPage}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <MdArrowBack /> Atrás
        </Button>
        <div className={styles.headerContent}>
          <GiTeamIdea className={styles.headerIcon} />
          <h1>Crear Nuevo Grupo</h1>
        </div>
      </div>

      {/* Formulario */}
      <Card variant="elevated" className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Error */}
          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Nombre */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre del Grupo *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ej: Los Conquistadores del Multiuso"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <p className={styles.hint}>
              Elige un nombre descriptivo para tu grupo
            </p>
          </div>

          {/* Descripción */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe el propósito o tema de tu grupo (opcional)"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className={styles.textarea}
              rows="4"
            />
            <p className={styles.hint}>
              Máximo 500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Grupo'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info */}
      <Card variant="bordered" className={styles.infoCard}>
        <div className={styles.infoContent}>
          <h3>💡 Información Importante</h3>
          <ul className={styles.infoList}>
            <li>Serás el administrador del grupo automáticamente</li>
            <li>Podrás invitar a otros jugadores al grupo</li>
            <li>Podrás registrar partidas y ver estadísticas del grupo</li>
            <li>El nombre del grupo debe ser único</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default CreateGroup;
