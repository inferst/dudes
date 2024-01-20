import { Constants } from '../config/constants';

export class Timer {
  public isCompleted: boolean = false;

  constructor(private current: number, private onComplete: () => void) {}

  tick(delta: number = Constants.fixedDeltaTime) {
    if (this.isCompleted) {
      return;
    }

    this.current -= delta;

    if (this.current < 0) {
      this.isCompleted = true;
      this.onComplete();
    }
  }
}
