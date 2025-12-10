/**
 * @fileoverview Punto de entrada de la aplicación React
 * @description Renderiza el componente App en el DOM
 * @module main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
