import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import useInspectionActions, {
  USER_NOTIFICATIONS
} from './useInspectionActions';
import inspectionFirestoreApi from '../../../common/services/firestore/inspections';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import inspections from '../../../__mocks__/inspections';
import { admin } from '../../../__mocks__/users';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import wait from '../../../__tests__/helpers/wait';
import inspectionApi from '../../../common/services/api/inspections';

describe('Unit | Features | Property Profile | Hooks | Use Delete Inspection', () => {
  afterEach(() => sinon.restore());

  test('it sends queued inspection to be deleted', async () => {
    const expected = true;
    const [target] = inspections;
    const targetId = target.id;
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    const deleteRecord = sinon
      .stub(inspectionFirestoreApi, 'deleteRecord')
      .resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useInspectionActions(firestore, () => true, admin);
        queueInspectionForDelete(target);
        if (queuedInspectionForDeletion && !confirm) {
          confirm = true;
          confirmInspectionDelete().then(resolve);
        }
      });
    });

    const result = deleteRecord.firstCall || { args: [] };
    const actual = result.args[1] === targetId;
    expect(actual).toEqual(expected);
  });

  test('it sends success global notification on successful inspection delete', async () => {
    const expected = true;
    const [target] = inspections;

    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(inspectionFirestoreApi, 'deleteRecord').resolves();

    const globalNotificaion = sinon
      .stub(globalNotification, 'send')
      .callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useInspectionActions(firestore, () => true, admin);
        queueInspectionForDelete(target);
        if (queuedInspectionForDeletion && !confirm) {
          confirm = true;
          confirmInspectionDelete().then(resolve);
        }
      });
    });

    const actual = globalNotificaion.called;
    expect(actual).toEqual(expected);
  });

  test('it sends error notification on failure', async () => {
    const expected = 'error';
    const [target] = inspections;
    const sendNotification = sinon.spy();

    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(inspectionFirestoreApi, 'deleteRecord').rejects();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useInspectionActions(firestore, sendNotification, admin);
        queueInspectionForDelete(target);
        if (queuedInspectionForDeletion && !confirm) {
          confirm = true;
          confirmInspectionDelete().then(resolve).catch(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.type : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends error report on failure', async () => {
    const expected = true;
    const [target] = inspections;
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(inspectionFirestoreApi, 'deleteRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useInspectionActions(firestore, () => true, admin);
        queueInspectionForDelete(target);
        if (queuedInspectionForDeletion && !confirm) {
          confirm = true;
          confirmInspectionDelete().then(resolve).catch(resolve);
        }
      });
    });

    const actual = sendError.called;
    expect(actual).toEqual(expected);
  });

  test('should show user facing error message according to error type', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show generic error message for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS.badRequest,
        message: 'show invalid template updates error for bad request'
      },
      {
        expected: USER_NOTIFICATIONS.badRequest,
        message: 'show invalid template updates error for bad request'
      },
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error on forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS.generic,
        message: 'show generic error message for internal server error'
      }
    ];
    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(inspectionApi, 'updateInspection')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorBadRequest())
      .onCall(2)
      .rejects(new ErrorConflictingRequest())
      .onCall(3)
      .rejects(new ErrorForbidden())
      .onCall(4)
      .rejects(new ErrorServerInternal());

    const firestore = stubFirestore(); // eslint-disable-line

    const { result } = renderHook(() =>
      useInspectionActions(firestore, sendNotification, admin)
    );

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.setQueueInspectionForMove(inspections[0]);
        await wait(100);
        result.current.confirmMoveInspection('property-1');
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });
});
