export interface ConflictingRequestItem {
  name: string;
  title?: string;
  detail?: string;
}

class ErrorConflictingRequest extends Error {
  errors: ConflictingRequestItem[];

  constructor(message?: string) {
    super(message);
    this.name = 'ErrorConflictingRequest';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // Populate bad request error list
  addErrors(errors: any | any[]): void {
    if (!Array.isArray(errors)) {
      return;
    }

    errors.forEach((err) => {
      if (!err || typeof err !== 'object') {
        return;
      }

      this.errors.push({
        name:
          err.source && err.source.pointer
            ? `${err.source.pointer}`
            : 'unknown',
        title: err.title ? `${err.title}` : '',
        detail: err.detail ? `${err.detail}` : ''
      } as ConflictingRequestItem);
    });
  }
}
export default ErrorConflictingRequest;
