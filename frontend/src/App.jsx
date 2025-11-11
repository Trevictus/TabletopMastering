import { AuthProvider } from './context/AuthContext';
import './styles/variables.css';
import './styles/components.css';
import './styles/layout.css';

function App() {
  return (
    <AuthProvider>
      <div className="page-container">
        <div className="main-content">
          <div className="container">
            <div className="text-center" style={{ paddingTop: '3rem' }}>
              <h1>🎲 Tabletop Mastering</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Sistema de gestión de partidas de juegos de mesa
              </p>
              <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div className="card-body">
                  <h3>🚀 Aplicación React Configurada</h3>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    La estructura del frontend está lista para comenzar el desarrollo.
                  </p>
                  <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <h4>✅ Estructura creada:</h4>
                    <ul style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                      <li>✓ Servicios API (auth, groups, games, matches)</li>
                      <li>✓ Context API para autenticación</li>
                      <li>✓ Utilidades (validadores, formateo de fechas, manejo de errores)</li>
                      <li>✓ Sistema de estilos CSS con variables</li>
                      <li>✓ Componentes reutilizables (botones, cards, forms)</li>
                      <li>✓ Layout responsive</li>
                    </ul>
                  </div>
                  <div style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary btn-lg">
                      Próximo paso: Crear componentes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
