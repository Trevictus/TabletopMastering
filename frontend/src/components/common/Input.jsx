import PropTypes from 'prop-types';
import styles from './Input.module.css';

/**
 * Componente Input reutilizable
 * @param {Object} props
 * @param {string} props.label - Etiqueta del input
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.name - Nombre del input
 * @param {string} props.value - Valor del input
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.error - Mensaje de error
 * @param {string} props.helpText - Texto de ayuda
 * @param {boolean} props.disabled - Si el input está deshabilitado
 * @param {boolean} props.required - Si el input es obligatorio
 * @param {React.ReactNode} props.icon - Icono a mostrar (componente de react-icons)
 * @param {Function} props.onChange - Función a ejecutar al cambiar el valor
 * @param {Function} props.onBlur - Función a ejecutar al perder el foco
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  error,
  helpText,
  disabled = false,
  required = false,
  icon,
  onChange,
  onBlur,
  className = '',
  ...props
}) => {
  const inputClasses = [
    styles.input,
    icon && styles.inputWithIcon,
    error && styles.error,
    disabled && styles.disabled,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span style={{ color: 'var(--error-color)' }}> *</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          {...props}
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!error && helpText && (
        <div className={styles.helpText}>{helpText}</div>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string
};

export default Input;
