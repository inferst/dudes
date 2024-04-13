import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';

import './i18n';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
