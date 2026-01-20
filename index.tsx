import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Added by user instruction
import './i18n'; // Import i18n configuration - Added by user instruction

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}