import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTrelloUser from './useTrelloUser';
import trelloDb from '../../../common/services/firestore/trello';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Trello | Hooks | Use Trello User', () => {
  afterEach(() => sinon.restore());

  test('should request Trello user', () => {
    const expected = true;
    const getUser = sinon
      .stub(trelloDb, 'getUser')
      .returns(emptyCollectionResult);
    renderHook(() => useTrelloUser({}));

    const actual = getUser.called;
    expect(actual).toEqual(expected);
  });
});
