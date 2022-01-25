import BaseError from './baseError';

class ErrorBadRequest extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorBadRequest';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorBadRequest;
