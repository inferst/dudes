import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  public serializeUser(
    user: unknown,
    done: (err: null, user: unknown) => void
  ): void {
    done(null, user);
  }

  public deserializeUser(
    payload: unknown,
    done: (err: null, user: unknown) => void
  ): void {
    done(null, payload);
  }
}
