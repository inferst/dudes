import { FIXED_DELTA_TIME } from "../config/constants";

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
