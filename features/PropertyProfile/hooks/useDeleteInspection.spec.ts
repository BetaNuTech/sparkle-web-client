import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteInspection from './useDeleteInspection';
import inspectionApi from '../../../common/services/firestore/inspections';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import inspections from '../../../__mocks__/inspections';
import { admin } from '../../../__mocks__/users';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';

describe('Unit | Features | Property Profile | Hooks | Use Delete Inspection', () => {
  afterEach(() => sinon.restore());

  test('it sends queued inspection to be deleted', async () => {
    const expected = true;
    const [target] = inspections;
    const targetId = target.id;
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    const deleteRecord = sinon.stub(inspectionApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useDeleteInspection(firestore, () => true, admin);
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
    sinon.stub(inspectionApi, 'deleteRecord').resolves();

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
        } = useDeleteInspection(firestore, () => true, admin);
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
    sinon.stub(inspectionApi, 'deleteRecord').rejects();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useDeleteInspection(firestore, sendNotification, admin);
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
    sinon.stub(inspectionApi, 'deleteRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const {
          queuedInspectionForDeletion,
          queueInspectionForDelete,
          confirmInspectionDelete
        } = useDeleteInspection(firestore, () => true, admin);
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
});
