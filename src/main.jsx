import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initializeGTM } from './utils/analytics.js';

// Initialize analytics
initializeGTM();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
