class ErrorForbidden extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorForbidden';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorForbidden;
