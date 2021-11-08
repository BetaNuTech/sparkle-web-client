class ErrorProxyForbidden extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorProxyForbidden';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorProxyForbidden;
