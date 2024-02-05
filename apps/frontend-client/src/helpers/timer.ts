import { FIXED_DELTA_TIME } from '../config/constants';

export class Timer {
  public isCompleted: boolean = false;

  constructor(public current: number = 0, private onComplete?: () => void) {}

  tick(delta: number = FIXED_DELTA_TIME) {
    if (this.isCompleted) {
      return;
    }

    this.current -= delta;

    if (this.current < 0) {
      this.isCompleted = true;
      this.onComplete?.();
    }
  }
}

class Timers {
  private timers: Timer[] = [];

  public add(current?: number, onComplete?: () => void) {
    this.timers.push(new Timer(current, onComplete));
  }

  public tick(delta: number = FIXED_DELTA_TIME) {
    const uncompleted = [];

    for (const timer of this.timers) {
      if (!timer.isCompleted) {
        timer.tick(delta);
        uncompleted.push(timer);
      }
    }

    this.timers = uncompleted;
  }
}

export const timers = new Timers();
