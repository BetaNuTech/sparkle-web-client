export interface ErrorItem {
  name?: string;
  detail: string;
}

class ErrorBadRequest extends Error {
  errors: ErrorItem[];

  constructor(message?: string) {
    super(message);
    this.name = 'ErrorBadRequest';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export default ErrorBadRequest;
