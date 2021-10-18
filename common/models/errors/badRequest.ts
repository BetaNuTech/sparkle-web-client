export interface BadRequestItem {
  name: string;
  title?: string;
  detail?: string;
}

class ErrorBadRequest extends Error {
  errors: BadRequestItem[];

  constructor(message?: string) {
    super(message);
    this.name = 'ErrorBadRequest';
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
      } as BadRequestItem);
    });
  }
}
export default ErrorBadRequest;
