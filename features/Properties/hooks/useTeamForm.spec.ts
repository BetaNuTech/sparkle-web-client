import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import teamsApi from '../../../common/services/api/teams';
import TeamModel from '../../../common/models/team';
import currentUser from '../../../common/utils/currentUser';
import useTeamForm from './useTeamForm';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

describe('Unit | Features | Prooperties | Hooks | Use Team Form', () => {
  afterEach(() => sinon.restore());

  test('it sends success notification after successfully creating a team', async () => {
    const expected = 'success';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').resolves({
      status: 201,
      json: () =>
        Promise.resolve({
          data: {
            id: 'team-1',
            name: 'update'
          }
        })
    });

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.createTeam({
        name: 'test'
      } as TeamModel);
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show error notifications after an unexpected error', async () => {
    const expected = 'error';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').rejects(new ErrorForbidden());

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.createTeam({ name: 'team 1' });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should provide errors to user after receiving a conflicting request', async () => {
    const expected = 'error that team name is taken';
    const conflictRequestError = new ErrorConflictingRequest(
      'conflicting request'
    );
    conflictRequestError.addErrors([
      { source: { pointer: 'name' }, title: 'name is taken', detail: expected }
    ]);

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').rejects(conflictRequestError);

    let errResult = null;
    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.createTeam({ name: 'team 1' });
      errResult = result.current.errors.name || { message: '' };
    });

    const actual = errResult ? errResult.message || '' : '';
    expect(actual).toEqual(expected);
  });

  test('should send an error report after an unexpected update error', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').rejects(new ErrorServerInternal());

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.createTeam({
        name: 'test'
      } as TeamModel);
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });
});
