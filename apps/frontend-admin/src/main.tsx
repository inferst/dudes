import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';

import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
