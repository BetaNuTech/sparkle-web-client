import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useTrelloLists, { setCachedLists } from './useTrelloLists';
import TrelloApi from '../../../common/services/api/trello';
import errorReports from '../../../common/services/api/errorReports';
import { openList } from '../../../__mocks__/trello';

describe('Unit | Features | Trello | Hooks | Use Trello Lists', () => {
  afterEach(() => sinon.restore());

  test('should request lists associated with a board', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const findAll = sinon.stub(TrelloApi, 'findAllBoardLists').resolves([]);

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloLists('', '', sendNotification)
      );
      await result.current.findLists('board-1', true);
    });

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should show error notifications on unexpected update errors', async () => {
    const expected = 'error';

    // Stubs
    const sendNotification = sinon.spy();
    sinon.stub(errorReports, 'send').callsFake(() => true);
    sinon.stub(TrelloApi, 'findAllBoardLists').rejects(Error('fail'));

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloLists('', '', sendNotification)
      );
      await result.current.findLists('board-1', true);
    });

    const result = sendNotification.firstCall || { args: [] };
    const actual = result.args[1] ? result.args[1].type : '';
    expect(actual).toEqual(expected);
  });

  test('should send an error report on unexpected update errors', async () => {
    const expected = true;

    // Stubs
    const sendNotification = sinon.spy();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(TrelloApi, 'findAllBoardLists').rejects(Error('fail'));

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloLists('', '', sendNotification)
      );
      await result.current.findLists('board-1', true);
    });

    const actual = sendErrorReport.called;
    expect(actual).toEqual(expected);
  });

  test('should resolve all cached lists for a board without requesting them again', async () => {
    const expected = false;
    const sendNotification = sinon.spy();
    const boardId = 'board-123';
    const findAll = sinon.stub(TrelloApi, 'findAllBoardLists').resolves([]);
    setCachedLists(boardId, [openList]);

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloLists('', '', sendNotification)
      );
      await result.current.findLists(boardId, true);
    });

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });
});
