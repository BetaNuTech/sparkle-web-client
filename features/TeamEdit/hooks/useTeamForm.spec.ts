import sinon from 'sinon';
import Router from 'next/router';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import teamsApi from '../../../common/services/api/teams';
import teamModel from '../../../common/models/team';
import currentUser from '../../../common/utils/currentUser';
import useTeamForm from './useTeamForm';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

describe('Unit | Features | Team Edit | Hooks | Use Team Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create team method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(teamsApi, 'createTeam');
    sinon.stub(Router, 'push').returns();

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.teamCreate({ name: 'test' } as teamModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update team method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(teamsApi, 'updateTeam');

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.teamUpdate('team-1', {
        name: 'test'
      } as teamModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('it sends success notification on successful save', async () => {
    const expected = 'success';
    const sendNotification = sinon.spy();

    // Stub update response
    sinon.stub(teamsApi, 'updateTeam').resolves({
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
      await result.current.teamUpdate('team-1', {
        name: 'test'
      } as teamModel);
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should show error notifications on unexpected errors', async () => {
    const expected = 'error';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(teamsApi, 'updateTeam').rejects(new ErrorForbidden());

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.teamUpdate('team-1', { name: 'updated team' });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should send an error report on unexpected update errors', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(teamsApi, 'updateTeam').rejects(new ErrorServerInternal());

    await act(async () => {
      const { result } = renderHook(() => useTeamForm(sendNotification));
      await result.current.teamUpdate('team-1', {
        name: 'test'
      } as teamModel);
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });
});
