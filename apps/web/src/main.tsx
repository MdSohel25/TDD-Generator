import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router/AppRouter';
import { AppProviders } from './app/providers/AppProviders';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
