import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { loadOpenAPIOnce } from './api/axios.js';

// Ensure OpenAPI spec is requested at app startup (as required)
loadOpenAPIOnce();

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
