import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import Navbar from './components/layout/Navbar';
import { Home, Login, Register, Dashboard, Profile, NotFound } from './pages';
import './styles/variables.css';
import './styles/components.css';
import './styles/layout.css';
import './App.css';

function App() {
  console.log('🎲 App component rendering...');
  
  return (
    <AuthProvider>
      <Router>
        <div className="page-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              
              {/* Rutas Públicas (redirigen a dashboard si ya está autenticado) */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Rutas Protegidas (requieren autenticación) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Ruta 404 - No Encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
