import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LocaleProvider } from './i18n/provider.tsx';
import { appDb } from './infra/tauri/db';
import { isTauri } from './infra/tauri/runtime';

if (isTauri()) {
  void appDb.init().catch((error) => {
    console.error('Failed to initialize SQLite schema', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
