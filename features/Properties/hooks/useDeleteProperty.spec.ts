import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteProperties from './useDeleteProperty';
import propertiesApi from '../../../common/services/firestore/properties';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import properties from '../../../__mocks__/properties';
import { admin } from '../../../__mocks__/users';

describe('Unit | Features | Properties | Hooks | Use Delete Property', () => {
  afterEach(() => sinon.restore());

  test('it sends queued property to be deleted', async () => {
    const expected = true;
    const [target] = properties;
    const targetId = target.id;
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    const deleteRecord = sinon.stub(propertiesApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties(firestore, () => true, admin);
        queuePropertyForDelete(target);
        if (queuedPropertyForDeletion && !confirm) {
          confirm = true;
          confirmPropertyDelete().then(resolve);
        }
      });
    });

    const result = deleteRecord.firstCall || { args: [] };
    const actual = result.args[1] === targetId;
    expect(actual).toEqual(expected);
  });

  test('it sends success notification on successful delete', async () => {
    const expected = 'success';
    const [target] = properties;
    const sendNotification = sinon.spy();
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(propertiesApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties(firestore, sendNotification, admin);
        queuePropertyForDelete(target);
        if (queuedPropertyForDeletion && !confirm) {
          confirm = true;
          confirmPropertyDelete().then(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.appearance : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends success global notification on successful property delete', async () => {
    const expected = true;
    const [target] = properties;

    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(propertiesApi, 'deleteRecord').resolves();

    const globalNotificaion = sinon
      .stub(globalNotification, 'send')
      .callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties(firestore, () => true, admin);
        queuePropertyForDelete(target);
        if (queuedPropertyForDeletion && !confirm) {
          confirm = true;
          confirmPropertyDelete().then(resolve);
        }
      });
    });

    const actual = globalNotificaion.called;
    expect(actual).toEqual(expected);
  });

  test('it sends error report on unsuccessful delete', async () => {
    const expected = 'error';
    const [target] = properties;
    const sendNotification = sinon.spy();

    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(propertiesApi, 'deleteRecord').rejects();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties(firestore, sendNotification, admin);
        queuePropertyForDelete(target);
        if (queuedPropertyForDeletion && !confirm) {
          confirm = true;
          confirmPropertyDelete().then(resolve).catch(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.appearance : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends error report on unsuccessful delete', async () => {
    const expected = true;
    const [target] = properties;
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(propertiesApi, 'deleteRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties(firestore, () => true, admin);
        queuePropertyForDelete(target);
        if (queuedPropertyForDeletion && !confirm) {
          confirm = true;
          confirmPropertyDelete().then(resolve).catch(resolve);
        }
      });
    });

    const actual = sendError.called;
    expect(actual).toEqual(expected);
  });
});

function stubFirestore(success = true, err = Error()): any {
  return {
    collection: () => ({
      add: (notification) => {
        if (success) {
          return Promise.resolve(notification);
        }
        return Promise.reject(err);
      }
    })
  };
}
