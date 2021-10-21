import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTrelloProperty from './useTrelloProperty';
import trelloDb from '../../../common/services/firestore/trello';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Trello | Hooks | Use Trello User', () => {
  afterEach(() => sinon.restore());

  test('should request Trello integration details for property', () => {
    const expected = true;
    const getUser = sinon
      .stub(trelloDb, 'getPropertyIntegrationDetails')
      .returns(emptyCollectionResult);
    renderHook(() => useTrelloProperty({}, 'property-123'));

    const actual = getUser.called;
    expect(actual).toEqual(expected);
  });
});
