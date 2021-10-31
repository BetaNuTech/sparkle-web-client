import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeleteTeam from './useDeleteTeam';
import teamsApi from '../../../common/services/api/teams';
import errorReports from '../../../common/services/api/errorReports';
import teams from '../../../__mocks__/teams';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';

describe('Unit | Features | Properties | Hooks | Use Delete Team', () => {
  afterEach(() => sinon.restore());

  test('it sends queued team to be deleted', async () => {
    const expected = true;
    const [target] = teams;
    const targetId = target.id;
    const deleteTeam = sinon.stub(teamsApi, 'deleteTeam').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(() => true);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve);
        }
      });
    });

    const result = deleteTeam.firstCall || { args: [] };
    const actual = result.args[0] === targetId;
    expect(actual).toEqual(expected);
  });

  test('it sends success notification on successful team delete', async () => {
    const expected = 'success';
    const [target] = teams;
    const sendNotification = sinon.spy();
    sinon.stub(teamsApi, 'deleteTeam').resolves();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.type : 'NA';
    expect(actual).toEqual(expected);
  });

  test('it sends error notification on forbidden request error', async () => {
    const expected = 'You are not allowed to delete this team.';
    const [target] = teams;
    const sendNotification = sinon.spy();

    const conflictingRequest = new ErrorForbidden('you lack permission');
    sinon.stub(teamsApi, 'deleteTeam').rejects(conflictingRequest);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve).catch(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[0];
    expect(actual).toEqual(expected);
  });

  test('it sends error notification on not found request error', async () => {
    const expected =
      'Team to delete could not be found. Please ensure team exists.';
    const [target] = teams;
    const sendNotification = sinon.spy();

    const conflictingRequest = new ErrorNotFound('team not found');
    sinon.stub(teamsApi, 'deleteTeam').rejects(conflictingRequest);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve).catch(resolve);
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[0];
    expect(actual).toEqual(expected);
  });

  test('it sends error notification on failure', async () => {
    const expected = 'error';
    const [target] = teams;
    const sendNotification = sinon.spy();

    sinon.stub(teamsApi, 'deleteTeam').rejects(new ErrorServerInternal());
    sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(sendNotification);
        queueTeamForDelete(target);
        if (queuedTeamForDeletion && !confirm) {
          confirm = true;
          confirmTeamDelete().then(resolve).catch(resolve);
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
    const [target] = teams;
    const sendNotification = sinon.spy();
    sinon.stub(teamsApi, 'deleteTeam').rejects(new ErrorServerInternal());
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await new Promise((resolve) => {
      let confirm = false;
      renderHook(() => {
        const { queuedTeamForDeletion, queueTeamForDelete, confirmTeamDelete } =
          useDeleteTeam(sendNotification);
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
