import ErrorItem from './item';

class BaseError extends Error {
  errors: ErrorItem[];

  constructor(message?: string) {
    super(message);
    this.name = 'Error';
    this.errors = [];
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // Populate error list
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
      } as ErrorItem);
    });
  }

  toString(): string {
    const errorsMsgs = Array.isArray(this.errors)
      ? this.errors
          .map(({ title, detail }) => [title, detail].filter(Boolean))
          .join(', ')
      : '';
    return `${this.message || this.name}${errorsMsgs ? ': ' : ''}${errorsMsgs}`;
  }
}

export default BaseError;
