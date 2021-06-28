import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteTeam from './useDeleteTeam';
import teamsApi from '../../../common/services/firestore/teams';
import errorReports from '../../../common/services/api/errorReports';
import teams from '../../../__mocks__/teams';

describe('Unit | Features | Properties | Hooks | Use Delete Team', () => {
  afterEach(() => sinon.restore());

  test('it sends queued team to be deleted', async () => {
    const expected = true;
    const [target] = teams;
    const targetId = target.id;
    const deleteRecord = sinon.stub(teamsApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam({}, () => true);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve);
        }
      });
    });

    const result = deleteRecord.firstCall || { args: [] };
    const actual = result.args[1] === targetId;
    expect(actual).toEqual(expected);
  });

  test('it sends success notification on successful team delete', async () => {
    const expected = 'success';
    const [target] = teams;
    const sendNotification = sinon.spy();
    sinon.stub(teamsApi, 'deleteRecord').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam({}, sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.appearance : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends error report on unsuccessful team delete', async () => {
    const expected = 'error';
    const [target] = teams;
    const sendNotification = sinon.spy();

    sinon.stub(teamsApi, 'deleteRecord').rejects();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam({}, sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve).catch(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.appearance : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends error report on unsuccessful team delete', async () => {
    const expected = true;
    const [target] = teams;
    sinon.stub(teamsApi, 'deleteRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam({}, () => true);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve).catch(resolve);
        }
      });
    });

    const actual = sendError.called;
    expect(actual).toEqual(expected);
  });
});
