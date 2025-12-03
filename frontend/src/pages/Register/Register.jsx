import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './Register.module.css';

/**
 * Página de Registro
 * Formulario de creación de cuenta con validación completa
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Cerrar modal al hacer clic fuera del formulario
  const handleOverlayClick = (e) => {
    // Solo cerrar si el clic fue directamente en el overlay, no en el formulario
    if (e.target === e.currentTarget) {
      navigate('/');
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validación de nombre
  const validateName = (name) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio';
    }
    if (name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (name.trim().length > 50) {
      return 'El nombre no puede exceder 50 caracteres';
    }
    return '';
  };

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'El email es obligatorio';
    }
    if (!emailRegex.test(email)) {
      return 'El formato del email no es válido';
    }
    return '';
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es obligatoria';
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    // Recomendaciones adicionales (no obligatorias)
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      // Solo advertir pero no bloquear
      return '';
    }
    return '';
  };

  // Validación de confirmación de contraseña
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Debes confirmar tu contraseña';
    }
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  // Calcular fortaleza de la contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complejidad
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2) {
      return { strength: 1, label: 'Débil', color: '#8b2e2e' };
    } else if (strength <= 4) {
      return { strength: 2, label: 'Media', color: '#d4af37' };
    } else {
      return { strength: 3, label: 'Fuerte', color: '#2d5016' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del servidor al escribir
    if (serverError) {
      setServerError('');
    }

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      switch (name) {
        case 'name':
          setErrors((prev) => ({ ...prev, name: validateName(value) }));
          break;
        case 'email':
          setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
          break;
        case 'password':
          setErrors((prev) => ({ 
            ...prev, 
            password: validatePassword(value),
            confirmPassword: formData.confirmPassword 
              ? validateConfirmPassword(formData.confirmPassword, value)
              : ''
          }));
          break;
        case 'confirmPassword':
          setErrors((prev) => ({ 
            ...prev, 
            confirmPassword: validateConfirmPassword(value, formData.password) 
          }));
          break;
        default:
          break;
      }
    }
  };

  // Manejar pérdida de foco (blur)
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo
    switch (name) {
      case 'name':
        setErrors((prev) => ({ ...prev, name: validateName(value) }));
        break;
      case 'email':
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setErrors((prev) => ({ 
          ...prev, 
          confirmPassword: validateConfirmPassword(value, formData.password) 
        }));
        break;
      default:
        break;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validar todos los campos
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    // Si hay errores, no enviar el formulario
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    // Enviar datos al servidor
    setIsLoading(true);
    setServerError('');

    try {
      const { name, email, password } = formData;
      const response = await register({ name, email, password });

      // Registro exitoso - el usuario ya está logueado en el contexto
      if (response.data?.user) {
        navigate('/', { 
          state: { 
            message: `¡Bienvenido/a, ${response.data.user.name}! Tu cuenta ha sido creada exitosamente.` 
          } 
        });
      }
    } catch (error) {
      // Manejar errores del servidor
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.message) {
        setServerError(error.message);
      } else {
        setServerError('Ha ocurrido un error. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage} onClick={handleOverlayClick}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <GiPerspectiveDiceSixFacesRandom className={styles.icon} />
            <h1 className={styles.title}>Crear Cuenta</h1>
            <p className={styles.subtitle}>
              Únete a la comunidad de Tabletop Mastering
            </p>
          </div>

          {/* Error del servidor */}
          {serverError && (
            <div className={styles.serverError}>
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Tu nombre"
              error={touched.name ? errors.name : ''}
              required
              icon={<MdPerson size={16} />}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              disabled={isLoading}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              placeholder="tu-email@ejemplo.com"
              error={touched.email ? errors.email : ''}
              required
              icon={<MdEmail size={16} />}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={isLoading}
            />

            <div>
              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                error={touched.password ? errors.password : ''}
                required
                icon={<MdLock size={16} />}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                disabled={isLoading}
              />
              
              {/* Indicador de fortaleza de contraseña */}
              {formData.password && !errors.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div 
                      className={styles.strengthFill}
                      style={{ 
                        width: `${(passwordStrength.strength / 3) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    />
                  </div>
                  <span 
                    className={styles.strengthLabel}
                    style={{ color: passwordStrength.color }}
                  >
                    Seguridad: {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="••••••••"
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
              icon={<MdLock size={16} />}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>o</span>
          </div>

          {/* Link a login */}
          <div className={styles.loginLink}>
            <p className={styles.loginText}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className={styles.link}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Información adicional */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Al crear una cuenta, aceptas nuestros términos de servicio
              y política de privacidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
