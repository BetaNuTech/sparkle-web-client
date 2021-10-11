import sinon from 'sinon';
import trelloApi from './trello';
import currentUser from '../../utils/currentUser';
import {
  trelloOrg,
  trelloBoardWithOrg,
  openList
} from '../../../__mocks__/trello';

const API_TELLO_BOARDS_RESULT = {
  data: [
    {
      id: trelloBoardWithOrg.id,
      type: 'trello-board',
      attributes: {
        name: trelloBoardWithOrg.name
      },
      relationships: {
        trelloOrganization: {
          data: {
            id: trelloOrg.id,
            type: 'trello-organization'
          }
        }
      }
    }
  ],
  included: [
    {
      id: trelloOrg.id,
      type: 'trello-organization',
      attributes: {
        name: trelloOrg.name
      }
    }
  ]
};

const API_TELLO_LISTS_RESULT = {
  data: [
    {
      id: openList.id,
      type: 'trello-list',
      attributes: {
        name: openList.name
      }
    }
  ]
};

const jsonOK = (body) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Trello', () => {
  afterEach(() => sinon.restore());

  test('it resolves trello boards', async () => {
    const expected = [trelloBoardWithOrg];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_TELLO_BOARDS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await trelloApi.findAllBoards();

    expect(actual).toEqual(expected);
  });

  test('it resolves trello lists', async () => {
    const expected = [openList];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_TELLO_LISTS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await trelloApi.findAllBoardLists('board-1');

    expect(actual).toEqual(expected);
  });
});
