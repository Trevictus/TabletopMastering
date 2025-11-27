import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Componente Button reutilizable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {'primary' | 'secondary' | 'outline'} props.variant - Variante visual del botón
 * @param {'small' | 'medium' | 'large'} props.size - Tamaño del botón
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {boolean} props.fullWidth - Si el botón ocupa todo el ancho
 * @param {'button' | 'submit' | 'reset'} props.type - Tipo de botón HTML
 * @param {Function} props.onClick - Función a ejecutar al hacer click
 * @param {string} props.className - Clases CSS adicionales
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    size !== 'medium' && styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;
