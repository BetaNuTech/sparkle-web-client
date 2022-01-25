import BaseError from './baseError';

class ErrorServerInternal extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorServerInternal';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorServerInternal;
