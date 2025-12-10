import { Link } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FiMail, FiShield, FiFileText, FiInfo, FiEye, FiPackage } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Pie de página">
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <GiPerspectiveDiceSixFacesRandom className={styles.logo} aria-hidden="true" />
          <span className={styles.brandName}>Tabletop Mastering</span>
          <p className={styles.tagline}>
            Tu plataforma para organizar partidas y grupos de juegos de mesa.
          </p>
        </div>

        {/* Legal Links */}
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Legal</h4>
          <nav className={styles.links} aria-label="Enlaces legales">
            <Link to="/privacy" className={styles.link}>
              <FiShield className={styles.linkIcon} aria-hidden="true" />
              Privacidad
            </Link>
            <Link to="/terms" className={styles.link}>
              <FiFileText className={styles.linkIcon} aria-hidden="true" />
              Términos
            </Link>
            <Link to="/cookies" className={styles.link}>
              <FiInfo className={styles.linkIcon} aria-hidden="true" />
              Cookies
            </Link>
          </nav>
        </div>

        {/* Resources */}
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Recursos</h4>
          <nav className={styles.links} aria-label="Enlaces de recursos">
            <Link to="/accessibility" className={styles.link}>
              <FiEye className={styles.linkIcon} aria-hidden="true" />
              Accesibilidad
            </Link>
            <Link to="/licenses" className={styles.link}>
              <FiPackage className={styles.linkIcon} aria-hidden="true" />
              Licencias
            </Link>
            <a href="mailto:contacto@tabletopmastering.com" className={styles.link}>
              <FiMail className={styles.linkIcon} aria-hidden="true" />
              Contacto
            </a>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {currentYear} Tabletop Mastering. Todos los derechos reservados.
        </p>
        <p className={styles.rgpd}>
          Cumplimos con el RGPD y WCAG 2.1
        </p>
      </div>
    </footer>
  );
};

export default Footer;
