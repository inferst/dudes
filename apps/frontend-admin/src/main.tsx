import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
// @TODO: uncomment when new UI will be implemented.
// import './style.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
