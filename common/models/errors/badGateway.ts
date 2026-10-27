import BaseError from './baseError';

// Upstream 3rd party service (ie Yardi)
// could not process the request
class ErrorBadGateway extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ErrorBadGateway';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ErrorBadGateway;
