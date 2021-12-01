class ErrorUnauthorized extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorUnauthorized';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorUnauthorized;
