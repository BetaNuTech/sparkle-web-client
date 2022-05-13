import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import trelloApi from '../../../common/services/api/trello';

import currentUser from '../../../common/utils/currentUser';
import useTrelloSave from './useTrelloSave';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

describe('Unit | Features | Property Edit | Hooks | Use Trello Save', () => {
  afterEach(() => sinon.restore());

  test('it sends success notification after successfull trello response', async () => {
    const expected = 'success';
    const expectedMessage = 'Trello settings were successfuly updated';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(trelloApi, 'updatePropertyTrello').resolves({
      id: 'team-1',
      name: 'update'
    });
    const { result: hook } = renderHook(() =>
      useTrelloSave('property-1', sendNotification)
    );

    await act(async () => {
      await hook.current.updateTrelloIntegration({
        closeBoard: {
          id: 'close-1',
          name: 'close-board-1'
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    const actualMessage = result.args[0] || '';
    expect(actual).toEqual(expected);
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('should show error notifications after an conflicting request in update trello', async () => {
    const expected = 'error';
    const expectedMessage = 'Please authorize Trello for your organization';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon
      .stub(trelloApi, 'updatePropertyTrello')
      .rejects(new ErrorConflictingRequest());
    const { result: hook } = renderHook(() =>
      useTrelloSave('property-1', sendNotification)
    );

    await act(async () => {
      await hook.current.updateTrelloIntegration({
        closeBoard: {
          id: 'close-1',
          name: 'close-board-1'
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    const actualMessage = result.args[0] || '';
    expect(actual).toEqual(expected);
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('should show error notifications after an unexpected error in update trello', async () => {
    const expected = 'error';
    const expectedMessage =
      'Failed to update the property’s Trello configuration, please try again or contact an admin';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(trelloApi, 'updatePropertyTrello').rejects(new ErrorForbidden());
    const { result: hook } = renderHook(() =>
      useTrelloSave('property-1', sendNotification)
    );

    await act(async () => {
      await hook.current.updateTrelloIntegration({
        closeBoard: {
          id: 'close-1',
          name: 'close-board-1'
        }
      });
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    const actualMessage = result.args[0] || '';
    expect(actual).toEqual(expected);
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('should send an error report after reciving an error in update trello', async () => {
    const expected = true;

    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(trelloApi, 'updatePropertyTrello').rejects(new ErrorForbidden());

    const { result: hook } = renderHook(() =>
      useTrelloSave('property-1', sendNotification)
    );

    await act(async () => {
      await hook.current.updateTrelloIntegration({
        closeBoard: {
          id: 'close-1',
          name: 'close-board-1'
        }
      });
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });
});
