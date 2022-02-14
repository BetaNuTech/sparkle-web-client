import ErrorBadRequest from '../../models/errors/badRequest';
import ErrorConflictingRequest from '../../models/errors/conflictingRequest';
import ErrorUnauthorized from '../../models/errors/unauthorized';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorProxyForbidden from '../../models/errors/proxyForbidden';
import ErrorServerInternal from '../../models/errors/serverInternal';

export const DEFAULT_ERROR_MESSAGES = Object.freeze({
  400: 'fix request errors',
  401: 'user authorization not accepted',
  403: 'user lacks permission',
  404: 'record not found',
  407: '3rd party service not authenticated',
  409: 'fix conflicting request errors',
  500: 'system failure'
});

const createError = (
  prefix: string,
  customMessages: Record<number, string> = {}
): ((s: number, j: any) => void | Error) => {
  // Merge default errors with
  // any custom error messages
  const errorMessages = {
    ...DEFAULT_ERROR_MESSAGES,
    ...customMessages
  };

  return (responseStatus: number, responseErrors: any = []): Error | null => {
    const apiErrors =
      responseErrors && Array.isArray(responseErrors) ? responseErrors : [];

    // Bad user request
    if (responseStatus === 400) {
      const badRequest = new ErrorBadRequest(`${prefix} ${errorMessages[400]}`);
      badRequest.addErrors(apiErrors);
      return badRequest;
    }

    // Unauthenticated / Unauthorized
    if (responseStatus === 401) {
      const unauthorizedRequest = new ErrorUnauthorized(
        `${prefix} ${errorMessages[401]}`
      );
      unauthorizedRequest.addErrors(apiErrors);
      return unauthorizedRequest;
    }

    // Unauthenticated / Forbidden
    if (responseStatus === 403) {
      const forbiddenRequest = new ErrorForbidden(
        `${prefix} ${errorMessages[403]}`
      );
      forbiddenRequest.addErrors(apiErrors);
      return forbiddenRequest;
    }

    // Record(s) not found
    if (responseStatus === 404) {
      const notFoundRequest = new ErrorNotFound(
        `${prefix} ${errorMessages[404]}`
      );
      notFoundRequest.addErrors(apiErrors);
      return notFoundRequest;
    }

    // Proxy service was unable to auth request
    if (responseStatus === 407) {
      const proxyForbiddenRequest = new ErrorProxyForbidden(
        `${prefix} ${errorMessages[407]}`
      );
      proxyForbiddenRequest.addErrors(apiErrors);
      return proxyForbiddenRequest;
    }

    // Database state conflicts with request
    if (responseStatus === 409) {
      const conflictingRequest = new ErrorConflictingRequest(
        `${prefix} ${errorMessages[409]}`
      );
      conflictingRequest.addErrors(apiErrors);
      return conflictingRequest;
    }

    // Unexpected internal error
    if (responseStatus === 500) {
      const serverInternalRequest = new ErrorServerInternal(
        `${prefix} ${errorMessages[500]}`
      );
      serverInternalRequest.addErrors(apiErrors);
      return serverInternalRequest;
    }

    return null;
  };
};

export default createError;
