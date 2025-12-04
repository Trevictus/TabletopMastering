import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { MdEmail, MdLock, MdPerson, MdAlternateEmail } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
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
    nickname: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    nickname: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    nickname: false,
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [nicknameSuggestions, setNicknameSuggestions] = useState([]);
  const [nicknameAvailable, setNicknameAvailable] = useState(null); // null=no verificado, true/false
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Validación de nombre de jugador
  const validateNickname = (nickname) => {
    if (!nickname.trim()) {
      return 'El nombre de jugador es obligatorio';
    }
    if (nickname.trim().length < 3) {
      return 'El nombre de jugador debe tener al menos 3 caracteres';
    }
    if (nickname.trim().length > 20) {
      return 'El nombre de jugador no puede exceder 20 caracteres';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(nickname.trim())) {
      return 'Solo letras, números y guiones bajos';
    }
    return '';
  };

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

    // Resetear disponibilidad al escribir
    if (name === 'nickname') {
      setNicknameAvailable(null);
      setNicknameSuggestions([]);
    }
    if (name === 'email') {
      setEmailAvailable(null);
    }

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      switch (name) {
        case 'nickname':
          setErrors((prev) => ({ ...prev, nickname: validateNickname(value) }));
          break;
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
  const handleBlur = async (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo
    switch (name) {
      case 'nickname': {
        const nicknameError = validateNickname(value);
        setErrors((prev) => ({ ...prev, nickname: nicknameError }));
        
        // Si no hay error de formato, verificar disponibilidad
        if (!nicknameError && value.trim()) {
          setCheckingNickname(true);
          setNicknameAvailable(null);
          setNicknameSuggestions([]);
          try {
            const result = await authService.checkNickname(value.trim());
            if (result.available) {
              setNicknameAvailable(true);
              setNicknameSuggestions([]);
            } else {
              setNicknameAvailable(false);
              setErrors((prev) => ({ ...prev, nickname: 'Este nombre de jugador ya está en uso' }));
              setNicknameSuggestions(result.suggestions || []);
            }
          } catch {
            // Si falla la verificación, permitir continuar
            setNicknameAvailable(null);
          } finally {
            setCheckingNickname(false);
          }
        }
        break;
      }
      case 'name':
        setErrors((prev) => ({ ...prev, name: validateName(value) }));
        break;
      case 'email': {
        const emailError = validateEmail(value);
        setErrors((prev) => ({ ...prev, email: emailError }));
        
        // Si no hay error de formato, verificar disponibilidad
        if (!emailError && value.trim()) {
          setCheckingEmail(true);
          setEmailAvailable(null);
          try {
            const result = await authService.checkEmail(value.trim());
            if (result.available) {
              setEmailAvailable(true);
            } else {
              setEmailAvailable(false);
              setErrors((prev) => ({ ...prev, email: 'Este email ya está registrado' }));
            }
          } catch {
            // Si falla la verificación, permitir continuar
            setEmailAvailable(null);
          } finally {
            setCheckingEmail(false);
          }
        }
        break;
      }
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

  // Seleccionar una sugerencia de nickname
  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, nickname: suggestion }));
    setNicknameSuggestions([]);
    setErrors((prev) => ({ ...prev, nickname: '' }));
    setNicknameAvailable(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      nickname: true,
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validar todos los campos
    const nicknameError = validateNickname(formData.nickname);
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    setErrors({
      nickname: nicknameError,
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    // Si hay errores, no enviar el formulario
    if (nicknameError || nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    // Si sabemos que el nickname o email no están disponibles, no enviar
    if (nicknameAvailable === false || emailAvailable === false) {
      return;
    }

    // Enviar datos al servidor
    setIsLoading(true);
    setServerError('');
    setNicknameSuggestions([]);

    try {
      const { nickname, name, email, password } = formData;
      const response = await register({ nickname, name, email, password });

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
      const errorData = error.response?.data;
      if (errorData?.message) {
        setServerError(errorData.message);
        // Si hay sugerencias de nickname, mostrarlas
        if (errorData.suggestions && errorData.suggestions.length > 0) {
          setNicknameSuggestions(errorData.suggestions);
        }
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
            <div className={styles.fieldWithFeedback}>
              <Input
                label="Nombre de jugador"
                type="text"
                name="nickname"
                value={formData.nickname}
                placeholder="nombre_jugador"
                error={touched.nickname ? errors.nickname : ''}
                helpText={!touched.nickname ? 'Único. Solo letras, números y _' : (checkingNickname ? 'Verificando disponibilidad...' : (nicknameAvailable === true && !errors.nickname ? '✓ Disponible' : ''))}
                required
                icon={<MdAlternateEmail size={16} />}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
                disabled={isLoading}
              />
              
              {/* Sugerencias de nickname debajo del campo */}
              {nicknameSuggestions.length > 0 && (
                <div className={styles.inlineSuggestions}>
                  <span className={styles.suggestionsLabel}>Prueba con:</span>
                  <div className={styles.suggestionsList}>
                    {nicknameSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className={styles.suggestionBtn}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
              helpText={checkingEmail ? 'Verificando disponibilidad...' : (emailAvailable === true && !errors.email ? '✓ Disponible' : '')}
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
