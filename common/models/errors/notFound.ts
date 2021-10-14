class ErrorNotFound extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorNotFound';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorNotFound;
