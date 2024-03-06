import { app } from './app/app';
import './style.css';

const init = async (): Promise<void> => {
  // Hot reload
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      //
    });
  }

  await app.init();
};

init();
