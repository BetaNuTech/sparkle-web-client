import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import useCategoriesActions from './useCategoriesActions';
import currentUser from '../../../common/utils/currentUser';
import errorReports from '../../../common/services/api/errorReports';
import categoriesApi from '../../../common/services/api/categories';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';

describe('Unit | Features | Templates | Hooks | Use Categories Actions', () => {
  afterEach(() => sinon.restore());

  // eslint-disable-next-line max-len
  test('should show user notification with appropriate message when the create API responds with an error', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    sinon
      .stub(categoriesApi, 'createRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden())
      .onCall(4)
      .rejects(new ErrorConflictingRequest())
      .onCall(5)
      .rejects(new ErrorBadRequest());

    const tests = [
      {
        expected: 'Failed to create category, please try again',
        message: 'shows generic error for unauthorized error'
      },
      {
        expected: 'Failed to create category, please try again',
        message: 'show generic error when record not found error'
      },
      {
        expected: 'Failed to create category, please try again',
        message: 'show generic error for system faliure error'
      },
      {
        expected: 'Failed to create category, please try again',
        message: 'show generic error for bad request forbidden error'
      },
      {
        expected:
          'Category name already exists, please choose a different name',
        message: 'show category name already exists for conflict error'
      },
      {
        expected: 'Failed to create category, please try again',
        message: 'show generic error for bad request'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));

    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.createCategory({
          id: 'cat-1',
          name: 'category-1'
        });
        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendNotification.called);
      });

      const actual = `${
        ((sendNotification.getCall(index) || {}).args || [])[0]
      }`;
      expect(actual, message).toEqual(expected);
    }
  });

  test('should send all possible error reports for create record API failures', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    // Stub create response
    sinon
      .stub(categoriesApi, 'createRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden())
      .onCall(4)
      .rejects(new ErrorBadRequest());

    const tests = [
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorUnauthorized',
        message: 'sends user authorization not accepted error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorNotFound',
        message: 'sends record not found error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorServerInternal',
        message: 'sends system faliure error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorForbidden',
        message: 'sends user lacks permission report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorBadRequest',
        message: 'sends user bad request report'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));
    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.createCategory({
          id: 'cat-1',
          name: 'category-1'
        });

        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendReport.called);
      });

      const actual = `${((sendReport.getCall(index) || {}).args || [])[0]}`;
      expect(actual, message).toEqual(expected);
    }
  });

  // eslint-disable-next-line max-len
  test('should show user notification with appropriate message when the update API responds with an error', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    sinon
      .stub(categoriesApi, 'updateRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden())
      .onCall(4)
      .rejects(new ErrorConflictingRequest())
      .onCall(5)
      .rejects(new ErrorBadRequest());

    const tests = [
      {
        expected: 'Failed to update category, please try again',
        message:
          'shows failed to update category message for unauthorized error'
      },
      {
        expected: 'Failed to update category, please try again',
        message:
          'shows failed to update category message for record not found error'
      },
      {
        expected: 'Failed to update category, please try again',
        message:
          'shows failed to update category message for system faliure error'
      },
      {
        expected: 'Failed to update category, please try again',
        message:
          'shows failed to update category message for user lacks permission'
      },
      {
        expected:
          'Category name already exists, please choose a different name',
        message: 'show Category name already exists'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));

    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.updateCategory({
          id: 'cat-1',
          name: 'category-1'
        });
        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendNotification.called);
      });

      const actual = `${
        ((sendNotification.getCall(index) || {}).args || [])[0]
      }`;
      expect(actual, message).toEqual(expected);
    }
  });

  test('should send all possible error reports for update record API failures', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    // Stub update response
    sinon
      .stub(categoriesApi, 'updateRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden())
      .onCall(4)
      .rejects(new ErrorBadRequest());

    const tests = [
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorUnauthorized',
        message: 'sends unauthorized report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorNotFound',
        message: 'sends record not found report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorServerInternal',
        message: 'sends system faliure report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorForbidden',
        message: 'sends forbidden report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: handleErrorResponse: ErrorBadRequest',
        message: 'sends bad request report'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));
    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.updateCategory({
          id: 'cat-1',
          name: 'category-1'
        });

        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendReport.called);
      });

      const actual = `${((sendReport.getCall(index) || {}).args || [])[0]}`;
      expect(actual, message).toEqual(expected);
    }
  });

  // eslint-disable-next-line max-len
  test('should show user notification with appropriate message when the delete API responds with an error', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    sinon
      .stub(categoriesApi, 'deleteRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden());

    const tests = [
      {
        expected: 'Failed to delete category: category-1, please try again',
        message: 'shows generic error message for unauthorized error'
      },
      {
        expected: 'Failed to delete category: category-1, please try again',
        message: 'shows generic error message when record not found error'
      },
      {
        expected: 'Failed to delete category: category-1, please try again',
        message: 'shows generic error message for system failure error'
      },
      {
        expected: 'Failed to delete category: category-1, please try again',
        message: 'shows generic error message when user lacks permission'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));

    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.deleteCategory({
          id: 'cat-1',
          name: 'category-1'
        });
        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendNotification.called);
      });

      const actual = `${
        ((sendNotification.getCall(index) || {}).args || [])[0]
      }`;
      expect(actual, message).toEqual(expected);
    }
  });

  test('should send all possible error reports for delete record API failures', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    // Stub create response
    sinon
      .stub(categoriesApi, 'deleteRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorNotFound())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(new ErrorForbidden());

    const tests = [
      {
        expected:
          'Error: features: Templates: hooks: useCategories: sendErrorReports: ErrorUnauthorized',
        message: 'sends unauthorization error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: sendErrorReports: ErrorNotFound',
        message: 'sends record not found error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: sendErrorReports: ErrorServerInternal',
        message: 'sends system faliure error report'
      },
      {
        expected:
          'Error: features: Templates: hooks: useCategories: sendErrorReports: ErrorForbidden',
        message: 'sends forbidden error report'
      }
    ];

    const { result } = renderHook(() => useCategoriesActions(sendNotification));
    // eslint-disable-next-line
    for (const index in tests) {
      const { message, expected } = tests[index];

      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        // eslint-disable-next-line
        result.current.deleteCategory({
          id: 'cat-1',
          name: 'category-1'
        });

        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => sendReport.called);
      });

      const actual = `${((sendReport.getCall(index) || {}).args || [])[0]}`;
      expect(actual, message).toEqual(expected);
    }
  });
});
