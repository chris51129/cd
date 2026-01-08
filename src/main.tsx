/**
 * CryptoDuels - Application Entry Point
 * 
 * SECURITY (Protocolo Sigma):
 * Security hardening is initialized FIRST before any other code.
 * This includes prototype freezing and Trusted Types policy.
 */

// ============================================
// SECURITY FIRST - Initialize before anything else
// ============================================
import { freezePrototypes } from './security/hardening';
import './security/trustedTypes'; // Initialize Trusted Types policy

// Freeze prototypes immediately to prevent pollution attacks
freezePrototypes();

// ============================================
// Application Imports
// ============================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

// ============================================
// Application Mount
// ============================================
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('[CRITICAL] Root element not found');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
