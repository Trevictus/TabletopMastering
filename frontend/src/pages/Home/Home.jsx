import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom, GiCardPlay, GiTrophy, GiTeamIdea, GiDiceSixFacesFive, GiDiceSixFacesSix } from 'react-icons/gi';
import { FiUsers, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <GiPerspectiveDiceSixFacesRandom className={styles.heroIcon} />
        <h1>Tabletop Mastering</h1>
        <p>Gestiona tus partidas de juegos de mesa, organiza grupos y lleva el control de tus estadísticas</p>
        <div className={styles.cta}>
          <Link to="/login">
            <Button variant="primary" size="large">Iniciar Sesión</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="large">Crear Cuenta</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <GiCardPlay className={styles.featureIcon} />
          <div>
            <h3>Explora Juegos</h3>
            <p>Miles de juegos de mesa con info de BGG</p>
          </div>
        </div>
        <div className={styles.feature}>
          <FiUsers className={styles.featureIcon} />
          <div>
            <h3>Crea Grupos</h3>
            <p>Organiza grupos privados con códigos únicos</p>
          </div>
        </div>
        <div className={styles.feature}>
          <FiCalendar className={styles.featureIcon} />
          <div>
            <h3>Programa Partidas</h3>
            <p>Calendario visual para tus sesiones</p>
          </div>
        </div>
        <div className={styles.feature}>
          <FiBarChart2 className={styles.featureIcon} />
          <div>
            <h3>Rankings</h3>
            <p>Estadísticas y clasificaciones</p>
          </div>
        </div>
      </section>

      {/* Cómo funciona - Sección diferente */}
      <section className={styles.howItWorks}>
        <h2>Así de fácil</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h4>Crea tu grupo</h4>
            <p>Invita a tus amigos con un código único</p>
          </div>
          <div className={styles.stepArrow}>
            <GiDiceSixFacesFive />
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h4>Programa partidas</h4>
            <p>Elige juego, fecha y jugadores</p>
          </div>
          <div className={styles.stepArrow}>
            <GiDiceSixFacesSix />
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h4>Registra resultados</h4>
            <p>El sistema calcula puntos y rankings</p>
          </div>
        </div>
        <div className={styles.ctaFinal}>
          <Link to="/register">
            <Button variant="accent" size="large">Empezar Gratis</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
