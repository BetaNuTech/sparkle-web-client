import sinon from 'sinon';
import trelloApi from './trello';
import currentUser from '../../utils/currentUser';
import { trelloOrg, trelloBoardWithOrg } from '../../../__mocks__/trello';

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

  test('builds a correct data on success', async () => {
    const expected = [trelloBoardWithOrg];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_TELLO_BOARDS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await trelloApi.findAllBoards();

    expect(actual).toEqual(expected);
  });
});
