import { Injectable } from '@nestjs/common';

export type AuthUserProps = {
  name: string;
};

@Injectable()
export class AuthService {
  public validate(): void {
    // TODO: implement.
  }
}
