class ErrorServerInternal extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorServerInternal';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorServerInternal;
