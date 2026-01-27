/**
 * @fileoverview Componente Principal de la Aplicación
 * @description Configura routing, providers y layout principal
 * @module App
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import Navbar from './components/layout/Navbar';
import { Home, Login, Register, Dashboard, Profile, Games, Rankings, Groups, CreateGroup, GroupDetail, Calendar, History, NotFound, PrivacyPolicy, TermsOfService, CookiePolicy, Accessibility, Licenses } from './pages';
import './styles/variables.css';
import './styles/components.css';
import './styles/layout.css';
import './App.css';

/**
 * Configuración de rutas protegidas
 * Centraliza todas las rutas que requieren autenticación
 */
const protectedRoutes = [
  { path: '/home', element: Dashboard },
  { path: '/profile', element: Profile },
  { path: '/games', element: Games },
  { path: '/rankings', element: Rankings },
  { path: '/groups', element: Groups },
  { path: '/groups/new', element: CreateGroup },
  { path: '/groups/:id', element: GroupDetail },
  { path: '/calendar', element: Calendar },
  { path: '/history', element: History },
];

function AppContent() {
  const location = useLocation();
  const showLogin = location.pathname === '/login';
  const showRegister = location.pathname === '/register';

  return (
    <>
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Home />} />
            <Route path="/register" element={<Home />} />
            
            {/* Rutas legales (públicas) */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/licenses" element={<Licenses />} />

            {/* Rutas protegidas - generadas desde configuración */}
            {/* eslint-disable-next-line no-unused-vars */}
            {protectedRoutes.map(({ path, element: RouteComponent }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <RouteComponent />
                  </ProtectedRoute>
                }
              />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Modals de autenticación superpuestos */}
      {showLogin && (
        <PublicRoute>
          <Login />
        </PublicRoute>
      )}
      {showRegister && (
        <PublicRoute>
          <Register />
        </PublicRoute>
      )}

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


