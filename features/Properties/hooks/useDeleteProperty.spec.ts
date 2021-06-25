import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteProperties from './useDeleteProperty';
import propertiesApi from '../../../common/services/firestore/properties';
import errorReports from '../../../common/services/api/errorReports';
import properties from '../../../__mocks__/properties';

describe('Unit | Features | Properties | Hooks | Use Delete Property', () => {
  afterEach(() => sinon.restore());

  test('it sends queued property to be deleted', async () => {
    const expected = true;
    const [target] = properties;
    const targetId = target.id;
    const deleteRecord = sinon.stub(propertiesApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties({}, () => true);
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
    sinon.stub(propertiesApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties({}, sendNotification);
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

  test('it sends error notification on unsuccessful delete', async () => {
    const expected = 'error';
    const [target] = properties;
    const sendNotification = sinon.spy();

    sinon.stub(propertiesApi, 'deleteRecord').rejects();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties({}, sendNotification);
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
    sinon.stub(propertiesApi, 'deleteRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedPropertyForDeletion,
          queuePropertyForDelete,
          confirmPropertyDelete
        } = useDeleteProperties({}, () => true);
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
