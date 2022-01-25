import BaseError from './baseError';

class ErrorProxyForbidden extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorProxyForbidden';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorProxyForbidden;
