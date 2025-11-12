import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { MdEmail, MdLock } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || '/dashboard';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

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
    return '';
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue
    }));

    // Limpiar error del servidor al escribir
    if (serverError) {
      setServerError('');
    }

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      if (name === 'email') {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      } else if (name === 'password') {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
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
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true
    });

    // Validar todos los campos
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    // Si hay errores, no enviar el formulario
    if (emailError || passwordError) {
      return;
    }

    // Enviar datos al servidor
    setIsLoading(true);
    setServerError('');

    try {
      const { email, password } = formData;
      await login({ email, password });
      navigate(from, { 
        replace: true,
        state: { 
          message: '¡Bienvenido de nuevo!' 
        } 
      });
    } catch (error) {
      console.error('Error en el login:', error);
      
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
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Header */}
          <div className={styles.header}>
            <GiPerspectiveDiceSixFacesRandom className={styles.icon} />
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <p className={styles.subtitle}>
              Accede a tu cuenta de Tabletop Mastering
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
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              placeholder="tu-email@ejemplo.com"
              error={touched.email ? errors.email : ''}
              required
              icon={<MdEmail size={24} />}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={isLoading}
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              error={touched.password ? errors.password : ''}
              helpText={!touched.password && !errors.password ? 'Mínimo 8 caracteres' : ''}
              required
              icon={<MdLock size={24} />}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              disabled={isLoading}
            />

            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                Recordarme en este dispositivo
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>o</span>
          </div>

          {/* Link a registro */}
          <div className={styles.registerLink}>
            <p className={styles.registerText}>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className={styles.link}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
