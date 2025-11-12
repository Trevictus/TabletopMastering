import PropTypes from 'prop-types';
import styles from './Card.module.css';

/**
 * Componente Card reutilizable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del card
 * @param {string} props.title - Título del card (opcional)
 * @param {string} props.subtitle - Subtítulo del card (opcional)
 * @param {React.ReactNode} props.icon - Icono para el título (opcional)
 * @param {React.ReactNode} props.footer - Contenido del footer (opcional)
 * @param {'default' | 'elevated' | 'bordered' | 'flat'} props.variant - Variante visual del card
 * @param {boolean} props.noPadding - Si el card no debe tener padding en el body
 * @param {string} props.className - Clases CSS adicionales
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  variant = 'default',
  noPadding = false,
  className = '',
  ...props
}) => {
  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
    className
  ]
    .filter(Boolean)
    .join(' ');

  const bodyClasses = [
    styles.body,
    noPadding && styles.bodyNoPadding
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && (
            <h3 className={styles.title}>
              {icon && <span>{icon}</span>}
              {title}
            </h3>
          )}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      <div className={bodyClasses}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'flat']),
  noPadding: PropTypes.bool,
  className: PropTypes.string
};

export default Card;
