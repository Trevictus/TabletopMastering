import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiMail, FiUser, FiLock, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import styles from './LegalPages.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <FiArrowLeft /> Volver al inicio
        </Link>

        <header className={styles.header}>
          <FiShield className={styles.headerIcon} />
          <h1>Política de Privacidad</h1>
          <p className={styles.lastUpdate}>Última actualización: Diciembre 2025</p>
        </header>

        <section className={styles.section}>
          <h2>1. Responsable del Tratamiento</h2>
          <p>
            <strong>Tabletop Mastering</strong> es responsable del tratamiento de los datos personales 
            que nos proporciones. Puedes contactarnos en: 
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Datos que Recopilamos</h2>
          <div className={styles.dataList}>
            <div className={styles.dataItem}>
              <FiUser className={styles.dataIcon} />
              <div>
                <h4>Datos de registro</h4>
                <p>Nombre de usuario, correo electrónico y contraseña cifrada.</p>
              </div>
            </div>
            <div className={styles.dataItem}>
              <FiLock className={styles.dataIcon} />
              <div>
                <h4>Datos de uso</h4>
                <p>Partidas registradas, grupos, puntuaciones y actividad en la plataforma.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. Finalidad del Tratamiento</h2>
          <ul className={styles.list}>
            <li>Gestionar tu cuenta y autenticación</li>
            <li>Proporcionar los servicios de la plataforma</li>
            <li>Calcular rankings y estadísticas</li>
            <li>Enviar notificaciones relacionadas con el servicio</li>
            <li>Mejorar la experiencia de usuario</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Base Legal</h2>
          <p>
            El tratamiento de tus datos se basa en el <strong>consentimiento explícito</strong> que 
            proporcionas al registrarte y la <strong>ejecución del contrato</strong> de uso del servicio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Tus Derechos (RGPD)</h2>
          <p>Conforme al Reglamento General de Protección de Datos, tienes derecho a:</p>
          <div className={styles.rightsGrid}>
            <div className={styles.rightItem}>
              <FiUser className={styles.rightIcon} />
              <span><strong>Acceso:</strong> Solicitar una copia de tus datos</span>
            </div>
            <div className={styles.rightItem}>
              <FiEdit className={styles.rightIcon} />
              <span><strong>Rectificación:</strong> Corregir datos inexactos</span>
            </div>
            <div className={styles.rightItem}>
              <FiTrash2 className={styles.rightIcon} />
              <span><strong>Supresión:</strong> Eliminar tus datos</span>
            </div>
            <div className={styles.rightItem}>
              <FiDownload className={styles.rightIcon} />
              <span><strong>Portabilidad:</strong> Exportar tus datos</span>
            </div>
          </div>
          <p className={styles.contactNote}>
            Para ejercer estos derechos, contacta con: 
            <a href="mailto:contacto@tabletopmastering.com"> contacto@tabletopmastering.com</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Seguridad de los Datos</h2>
          <ul className={styles.list}>
            <li>Contraseñas cifradas con <strong>bcrypt</strong></li>
            <li>Comunicaciones protegidas con <strong>HTTPS/TLS</strong></li>
            <li>Acceso restringido a datos personales</li>
            <li>Copias de seguridad cifradas</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Conservación de Datos</h2>
          <p>
            Conservamos tus datos mientras mantengas tu cuenta activa. Puedes solicitar 
            la eliminación en cualquier momento desde tu perfil o contactándonos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad:
          </p>
          <div className={styles.contactBox}>
            <FiMail className={styles.contactIcon} />
            <a href="mailto:contacto@tabletopmastering.com">contacto@tabletopmastering.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
