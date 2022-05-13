import sinon from 'sinon';
import Router from 'next/router';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import integrationsDb from '../../../common/services/firestore/integrations';
import propertyTrelloIntegration from '../../../common/models/propertyTrelloIntegration';
import { propertyTrelloIntegration as mockPropertyTrello } from '../../../__mocks__/trello';
import { admin as user } from '../../../__mocks__/users';
import useTrelloSave from './useTrelloSave';
import errorReports from '../../../common/services/api/errorReports';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';

describe('Unit | Features | Trello | Hooks | Use Trello Save', () => {
  afterEach(() => sinon.restore());

  test('should request to save any user updates to a property trello integration', async () => {
    const expected = {
      closedBoard: 'board-123',
      closedBoardName: 'closing test'
    };

    // Stubs
    const onUpdate = sinon
      .stub(integrationsDb, 'upsertPropertyTrelloRecord')
      .resolves({} as propertyTrelloIntegration);
    const sendNotification = sinon.spy();
    sinon.stub(Router, 'push').returns();
    const firestore = stubFirestore(); // eslint-disable-line

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloSave(firestore, sendNotification, user)
      );
      await result.current.updateTrelloIntegration(
        'prop-1',
        {
          closeBoard: {
            id: expected.closedBoard,
            name: expected.closedBoardName
          }
        },
        mockPropertyTrello
      );
    });

    const result = onUpdate.firstCall || { args: [] };
    const actual = result.args[2] || {};
    expect(actual).toEqual(expected);
  });

  test('should send error report when it fails to save the property trello integration', async () => {
    const expected = true;

    // Stubs
    sinon
      .stub(integrationsDb, 'upsertPropertyTrelloRecord')
      .rejects(Error('fail'));
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    const sendNotification = sinon.spy();
    const firestore = stubFirestore(); // eslint-disable-line

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloSave(firestore, sendNotification, user)
      );
      await result.current
        .updateTrelloIntegration(
          'prop-1',
          {
            closeBoard: {
              id: '2',
              name: 'Close'
            }
          },
          mockPropertyTrello
        )
        .catch(() => {}); // eslint-disable-line
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });

  test('should redirect user to property profile after successful save', async () => {
    const expected = true;
    const propertyId = 'property-123';

    // Stubs
    sinon
      .stub(integrationsDb, 'upsertPropertyTrelloRecord')
      .resolves({} as propertyTrelloIntegration);
    const sendNotification = sinon.spy();
    const redirect = sinon.stub(Router, 'push').returns();
    const firestore = stubFirestore(); // eslint-disable-line

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloSave(firestore, sendNotification, user)
      );
      await result.current.updateTrelloIntegration(
        propertyId,
        {
          closeBoard: {
            id: 'board-123',
            name: 'test'
          }
        },
        mockPropertyTrello
      );
    });

    const result = redirect.firstCall || { args: [] };
    const actual = (result.args[0] || '').search(propertyId) > -1;
    expect(actual).toEqual(expected);
  });
});
