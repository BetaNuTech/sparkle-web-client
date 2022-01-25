import BaseError from './baseError';

class ErrorNotFound extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorNotFound';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorNotFound;
