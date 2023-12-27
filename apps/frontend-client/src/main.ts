import { Debug } from './debug/debug';
import './style.css';
import { World } from './world/World';
import { Renderer } from 'pixi.js';

export const renderer = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
});

const init = async (): Promise<void> => {
  // Hot reload
  if (import.meta.hot) {
    import.meta.hot.accept(() => {});
  }

  document.body.appendChild(renderer.view as HTMLCanvasElement);

  window.onresize = (): void => {
    renderer.resize(window.innerWidth, window.innerHeight);
  };

  const world = new World();
  await world.init();

  let lastTime = performance.now();
  let lastFrame = -1;

  const maxFps = 60;

  const minElapsedMS = 1000 / maxFps;
  const maxElapsedMS = 100;

  const debug = new Debug(world);

  requestAnimationFrame(animate);
  function animate(currentTime = performance.now()): void {
    let elapsedMS = currentTime - lastTime;

    if (elapsedMS > maxElapsedMS) {
      elapsedMS = maxElapsedMS;
    }

    const delta = (currentTime - lastFrame) | 0;

    if (delta > minElapsedMS) {
      lastFrame = currentTime - (delta % minElapsedMS);
      lastTime = currentTime;

      world.update();
      renderer.render(world.stage);
    }

    requestAnimationFrame(animate);
  }
};

init();
