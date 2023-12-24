export class TokenRevokedException extends Error {
  public name = 'TokenRevokedException';
  public message = 'The token has been revoked.';
}
