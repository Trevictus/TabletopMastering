import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiExternalLink, FiCheck } from 'react-icons/fi';
import styles from './LegalPages.module.css';

const Licenses = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Volver al inicio
        </Link>

        <header className={styles.header}>
          <FiPackage className={styles.headerIcon} />
          <h1>Licencias y Atribuciones</h1>
          <p className={styles.lastUpdate}>Recursos de terceros utilizados</p>
        </header>

        <section className={styles.section}>
          <h2>1. Licencia del Proyecto</h2>
          <p>
            <strong>Tabletop Mastering</strong> es un proyecto desarrollado con fines educativos 
            y de demostración. El código fuente está disponible bajo licencia MIT.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Iconos</h2>
          <div className={styles.cookieCategory}>
            <div className={styles.cookieHeader}>
              <FiCheck className={styles.essentialIcon} />
              <h3>React Icons</h3>
              <span className={styles.optionalBadge}>MIT License</span>
            </div>
            <p>Utilizamos iconos de las siguientes colecciones bajo licencia MIT/Open Source:</p>
            <ul className={styles.list}>
              <li><strong>Feather Icons</strong> (Fi*) - MIT License</li>
              <li><strong>Game Icons</strong> (Gi*) - CC BY 3.0</li>
              <li><strong>Material Design Icons</strong> (Md*) - Apache 2.0</li>
            </ul>
            <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <FiExternalLink /> react-icons.github.io
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. Tipografías</h2>
          <div className={styles.cookieCategory}>
            <div className={styles.cookieHeader}>
              <FiCheck className={styles.essentialIcon} />
              <h3>System Fonts</h3>
              <span className={styles.requiredBadge}>Sin licencia requerida</span>
            </div>
            <p>
              Utilizamos la pila de fuentes del sistema operativo para máximo 
              rendimiento y compatibilidad nativa.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. APIs Externas</h2>
          <div className={styles.cookieCategory}>
            <div className={styles.cookieHeader}>
              <FiCheck className={styles.essentialIcon} />
              <h3>BoardGameGeek API</h3>
              <span className={styles.optionalBadge}>Uso permitido</span>
            </div>
            <p>
              Los datos de juegos de mesa provienen de <strong>BoardGameGeek</strong>. 
              Respetamos sus términos de servicio y límites de uso de API.
            </p>
            <a href="https://boardgamegeek.com/wiki/page/BGG_XML_API2" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <FiExternalLink /> Documentación BGG API
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. Frameworks y Librerías</h2>
          <table className={styles.cookieTable}>
            <thead>
              <tr>
                <th>Tecnología</th>
                <th>Licencia</th>
                <th>Uso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>React</strong></td>
                <td>MIT</td>
                <td>Frontend framework</td>
              </tr>
              <tr>
                <td><strong>Vite</strong></td>
                <td>MIT</td>
                <td>Build tool</td>
              </tr>
              <tr>
                <td><strong>Node.js</strong></td>
                <td>MIT</td>
                <td>Backend runtime</td>
              </tr>
              <tr>
                <td><strong>Express</strong></td>
                <td>MIT</td>
                <td>Backend framework</td>
              </tr>
              <tr>
                <td><strong>MongoDB</strong></td>
                <td>SSPL</td>
                <td>Base de datos</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>6. Imágenes y Recursos</h2>
          <p>
            Las imágenes de juegos de mesa son propiedad de sus respectivos editores 
            y se utilizan con fines informativos. Las imágenes de usuarios son 
            subidas por los propios usuarios bajo su responsabilidad.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Contacto</h2>
          <p>
            Para consultas sobre licencias:
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Licenses;
