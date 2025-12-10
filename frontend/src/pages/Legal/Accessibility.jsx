import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiMonitor, FiCheckCircle, FiX } from 'react-icons/fi';
import styles from './LegalPages.module.css';

const Accessibility = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Volver al inicio
        </Link>

        <header className={styles.header}>
          <FiEye className={styles.headerIcon} />
          <h1>Accesibilidad Web</h1>
          <p className={styles.lastUpdate}>Cumplimiento WCAG 2.1</p>
        </header>

        <section className={styles.section}>
          <h2>1. Nuestro Compromiso</h2>
          <p>
            <strong>Tabletop Mastering</strong> se compromete a garantizar la accesibilidad digital 
            para todas las personas, incluyendo aquellas con discapacidades. Trabajamos para 
            cumplir con las <strong>WCAG 2.1</strong> (Web Content Accessibility Guidelines) nivel AA.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Características de Accesibilidad</h2>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Contraste de colores adecuado (ratio mínimo 4.5:1)</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Navegación completa por teclado</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Etiquetas descriptivas en formularios</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Estructura semántica HTML5</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Textos alternativos en imágenes</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheckCircle className={styles.allowedIcon} />
              <span>Compatible con lectores de pantalla</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. Navegación por Teclado</h2>
          <table className={styles.cookieTable}>
            <thead>
              <tr>
                <th>Tecla</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code></td>
                <td>Navegar al siguiente elemento interactivo</td>
              </tr>
              <tr>
                <td><code>Shift + Tab</code></td>
                <td>Navegar al elemento anterior</td>
              </tr>
              <tr>
                <td><code>Enter</code></td>
                <td>Activar botón o enlace seleccionado</td>
              </tr>
              <tr>
                <td><code>Escape</code></td>
                <td>Cerrar modales y menús</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>4. Lectores de Pantalla</h2>
          <p>Nuestra web es compatible con los principales lectores de pantalla:</p>
          <ul className={styles.list}>
            <li><strong>NVDA</strong> (Windows) - Gratuito</li>
            <li><strong>JAWS</strong> (Windows)</li>
            <li><strong>VoiceOver</strong> (macOS / iOS)</li>
            <li><strong>TalkBack</strong> (Android)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Mejoras Continuas</h2>
          <p>
            Trabajamos continuamente para mejorar la accesibilidad. Si encuentras 
            barreras de acceso, por favor contáctanos para que podamos solucionarlo.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Contacto</h2>
          <p>
            Para reportar problemas de accesibilidad o sugerencias:
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Accessibility;
