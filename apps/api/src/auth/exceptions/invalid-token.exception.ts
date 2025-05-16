export class InvalidTokenException extends Error {
  public name = 'InvalidTokenException';

  public message = 'Access token is invalid.';
}
