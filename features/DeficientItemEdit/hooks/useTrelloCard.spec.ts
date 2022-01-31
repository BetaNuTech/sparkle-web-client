import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import currentUser from '../../../common/utils/currentUser';
import errorReports from '../../../common/services/api/errorReports';
import deficientItemsApi from '../../../common/services/api/deficientItems';
import useTrelloCard from './useTrelloCard';

describe('Unit | Common | Hooks | Use Deficient Item', () => {
  afterEach(() => sinon.restore());

  test('should call the create trello card method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    const createApi = sinon
      .stub(deficientItemsApi, 'createTrelloCard')
      .resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloCard(sendNotification, 'deficient-item-1')
      );
      await result.current.onCreateTrelloCard();
    });

    const actual = createApi.called;
    expect(actual).toEqual(expected);
  });

  test('should call send notification method if api throw error', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    sinon.stub(deficientItemsApi, 'createTrelloCard').rejects();

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloCard(sendNotification, 'deficient-item-1')
      );
      await result.current.onCreateTrelloCard();
    });

    const actual = sendNotification.called;
    expect(actual).toEqual(expected);
  });
});
