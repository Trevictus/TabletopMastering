import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import styles from './LegalPages.module.css';

const TermsOfService = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Volver al inicio
        </Link>

        <header className={styles.header}>
          <FiFileText className={styles.headerIcon} />
          <h1>Términos de Uso</h1>
          <p className={styles.lastUpdate}>Última actualización: Diciembre 2025</p>
        </header>

        <section className={styles.section}>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al registrarte y usar <strong>Tabletop Mastering</strong>, aceptas estos términos de uso. 
            Si no estás de acuerdo, no utilices la plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descripción del Servicio</h2>
          <p>
            Tabletop Mastering es una plataforma para gestionar grupos de juegos de mesa, 
            registrar partidas, calcular rankings y organizar sesiones de juego.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Uso Permitido</h2>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <FiCheck className={styles.allowedIcon} />
              <span>Crear y gestionar grupos de juego</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheck className={styles.allowedIcon} />
              <span>Registrar partidas y resultados</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheck className={styles.allowedIcon} />
              <span>Consultar estadísticas y rankings</span>
            </div>
            <div className={styles.ruleItem}>
              <FiCheck className={styles.allowedIcon} />
              <span>Invitar amigos a tus grupos</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. Conducta Prohibida</h2>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Compartir contenido ofensivo o ilegal</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Intentar acceder a cuentas ajenas</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Usar bots o automatizaciones no autorizadas</span>
            </div>
            <div className={styles.ruleItem}>
              <FiX className={styles.prohibitedIcon} />
              <span>Manipular rankings de forma fraudulenta</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. Cuentas de Usuario</h2>
          <ul className={styles.list}>
            <li>Eres responsable de mantener la seguridad de tu cuenta</li>
            <li>No compartas tus credenciales con terceros</li>
            <li>Debes proporcionar información veraz al registrarte</li>
            <li>Puedes eliminar tu cuenta en cualquier momento</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Propiedad Intelectual</h2>
          <p>
            El código, diseño y marca de Tabletop Mastering son propiedad del proyecto. 
            Los datos de juegos provienen de <strong>BoardGameGeek</strong> bajo sus términos de uso.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitación de Responsabilidad</h2>
          <div className={styles.warningBox}>
            <FiAlertCircle className={styles.warningIcon} />
            <p>
              El servicio se proporciona "tal cual". No garantizamos disponibilidad 
              ininterrumpida ni nos responsabilizamos de pérdida de datos por causas 
              ajenas a nuestro control.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>8. Suspensión de Cuentas</h2>
          <p>
            Nos reservamos el derecho de suspender o eliminar cuentas que incumplan 
            estos términos, sin previo aviso en casos graves.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos. Te notificaremos cambios significativos 
            por correo electrónico o mediante aviso en la plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contacto</h2>
          <p>
            Para consultas sobre estos términos: 
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
