import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import teamsApi from '../../../common/services/api/teams';

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
    const expectedMessage = 'The team: update was created successfully';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').resolves({
      id: 'team-1',
      name: 'update'
    });
    const { result: hook } = renderHook(() => useTeamForm(sendNotification));

    act(() => {
      hook.current.addTeam();
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    const actualMessage = result.args[0] || '';
    expect(actual).toEqual(expected);
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('it sends success notification after successfully updating a team', async () => {
    const expected = 'success';
    const expectedMessage = 'The team: update was updated successfully';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(teamsApi, 'updateTeam').resolves({
      id: 'team-1',
      name: 'update'
    });
    const { result: hook } = renderHook(() => useTeamForm(sendNotification));

    act(() => {
      hook.current.editTeam({ name: 'team', id: 'team-1' });
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    const actualMessage = result.args[0] || '';
    expect(actual).toEqual(expected);
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('should show error notifications after an unexpected error in create team reponse', async () => {
    const expected = 'error';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').rejects(new ErrorForbidden());

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.addTeam();
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show error notifications after an unexpected error in update team reponse', async () => {
    const expected = 'error';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(teamsApi, 'updateTeam').rejects(new ErrorForbidden());

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.editTeam({ name: 'team', id: 'team-1' });
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should provide errors to user after receiving a conflicting request in create team response', async () => {
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

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.addTeam();
    });

    let errResult = null;
    await act(async () => {
      await hook.current.onSubmit('update');
      errResult = hook.current.errors.name || { message: '' };
    });

    const actual = errResult ? errResult.message || '' : '';
    expect(actual).toEqual(expected);
  });

  test('should provide errors to user after receiving a conflicting request in update team response', async () => {
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
    sinon.stub(teamsApi, 'updateTeam').rejects(conflictRequestError);

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.editTeam({ name: 'team', id: 'team-1' });
    });

    let errResult = null;
    await act(async () => {
      await hook.current.onSubmit('update');
      errResult = hook.current.errors.name || { message: '' };
    });

    const actual = errResult ? errResult.message || '' : '';
    expect(actual).toEqual(expected);
  });

  test('should send an error report after reciving an unexpected error in create team response', async () => {
    const expected = true;
    const expectedMessage =
      'Error: features: Properties: hooks: useTeamForm: Could not complete team create operation: ErrorServerInternal';
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(teamsApi, 'createTeam').rejects(new ErrorServerInternal());

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.addTeam();
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendErrorReport.firstCall || { args: [] };
    const actualMessage = result.args[0] || '';
    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
    expect(`${actualMessage}`).toEqual(expectedMessage);
  });

  test('should send an error report after reciving an unexpected error in update team response', async () => {
    const expected = true;
    const expectedMessage =
      'Error: features: Properties: hooks: useTeamForm: Could not complete team update operation: ErrorServerInternal';
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(teamsApi, 'updateTeam').rejects(new ErrorServerInternal());

    const { result: hook } = renderHook(() => useTeamForm(sendNotification));
    act(() => {
      hook.current.editTeam({ name: 'team', id: 'team-1' });
    });

    await act(async () => {
      await hook.current.onSubmit('update');
    });

    const result = sendErrorReport.firstCall || { args: [] };
    const actualMessage = result.args[0] || '';
    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
    expect(`${actualMessage}`).toEqual(expectedMessage);
  });
});
