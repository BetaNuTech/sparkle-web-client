import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTrelloBoards from './useTrelloBoards';
import trelloApi from '../../../common/services/api/trello';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Trello | Hooks | Use Trello Boards', () => {
  afterEach(() => sinon.restore());

  test('should request Trello boards', () => {
    const expected = true;
    const getUser = sinon
      .stub(trelloApi, 'findAllBoards')
      .returns(emptyCollectionResult);
    renderHook(() => useTrelloBoards());

    const actual = getUser.called;
    expect(actual).toEqual(expected);
  });
});
