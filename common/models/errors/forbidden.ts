import BaseError from './baseError';

class ErrorForbidden extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorForbidden';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorForbidden;
