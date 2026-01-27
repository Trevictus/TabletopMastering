import { Link } from 'react-router-dom';
import { FiArrowLeft, FiInfo, FiSettings, FiCheck, FiX } from 'react-icons/fi';
import styles from './LegalPages.module.css';

const CookiePolicy = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Volver al inicio
        </Link>

        <header className={styles.header}>
          <FiInfo className={styles.headerIcon} />
          <h1>Política de Cookies</h1>
          <p className={styles.lastUpdate}>Última actualización: Diciembre 2025</p>
        </header>

        <section className={styles.section}>
          <h2>1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
            cuando visitas un sitio web. Permiten recordar preferencias y mejorar la experiencia.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Cookies que Utilizamos</h2>
          
          <div className={styles.cookieCategory}>
            <div className={styles.cookieHeader}>
              <FiCheck className={styles.essentialIcon} />
              <h3>Cookies Técnicas (Esenciales)</h3>
              <span className={styles.requiredBadge}>Obligatorias</span>
            </div>
            <p>Necesarias para el funcionamiento básico de la plataforma.</p>
            <table className={styles.cookieTable}>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Propósito</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>auth_token</code></td>
                  <td>Mantener la sesión iniciada</td>
                  <td>7 días</td>
                </tr>
                <tr>
                  <td><code>selected_group</code></td>
                  <td>Recordar grupo activo</td>
                  <td>Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.cookieCategory}>
            <div className={styles.cookieHeader}>
              <FiSettings className={styles.preferencesIcon} />
              <h3>Cookies de Preferencias</h3>
              <span className={styles.optionalBadge}>Opcionales</span>
            </div>
            <p>Mejoran la experiencia recordando tus preferencias.</p>
            <table className={styles.cookieTable}>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Propósito</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>theme</code></td>
                  <td>Preferencia de tema visual</td>
                  <td>1 año</td>
                </tr>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td>Recordar preferencias de cookies</td>
                  <td>1 año</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. Cookies que NO Utilizamos</h2>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Cookies de publicidad</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Cookies de seguimiento de terceros</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Cookies de redes sociales</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Google Analytics u otras herramientas de tracking</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. Gestión de Cookies</h2>
          <p>
            Puedes gestionar las cookies desde la configuración de tu navegador:
          </p>
          <ul className={styles.list}>
            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
            <li><strong>Firefox:</strong> Opciones → Privacidad → Cookies</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
            <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
          </ul>
          <p className={styles.note}>
            <FiInfo className={styles.noteIcon} />
            Desactivar cookies esenciales puede afectar al funcionamiento de la plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Consentimiento</h2>
          <p>
            Al continuar navegando en Tabletop Mastering, aceptas el uso de cookies 
            técnicas esenciales. Para cookies opcionales, solicitamos tu consentimiento explícito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Contacto</h2>
          <p>
            Para consultas sobre cookies: 
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
