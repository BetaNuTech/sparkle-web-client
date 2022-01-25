import BaseError from './baseError';

class ErrorConflictingRequest extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorConflictingRequest';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorConflictingRequest;
