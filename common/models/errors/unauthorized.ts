import BaseError from './baseError';

class ErrorUnauthorized extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorUnauthorized';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorUnauthorized;
