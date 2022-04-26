import TrelloIntegration from '../../models/trelloIntegration';
import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: trello:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

export interface trelloResult {
  status: string;
  error?: Error;
  data: any;
}

export interface trelloOrganization {
  id: string;
  name: string;
}

export interface trelloBoard {
  id: string;
  name: string;
  organization?: trelloOrganization;
}

export interface trelloList {
  id: string;
  name: string;
  board?: string;
}

const generateAuhtoriseError = createApiError(`${PREFIX} authorise:`);

// Request all Trello user's boards
const getBoardsRequest = async (authToken: string): Promise<trelloBoard[]> => {
  let res;
  try {
    res = await window.fetch(
      `${API_DOMAIN}/api/v0/integrations/trello/boards`,
      {
        method: 'GET',
        headers: {
          Authorization: `FB-JWT ${authToken}`
        }
      }
    );
  } catch (err) {
    throw Error(`${PREFIX} getBoardsRequest: request failed: ${err}`);
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch (err) {
    throw Error(`${PREFIX} getBoardsRequest: failed to parse JSON: ${err}`);
  }

  const included = (payload.included || []) as Array<any>;

  // Flatten board data append
  // any organization to the booard
  return payload.data.map((board) => {
    const record = { id: board.id, ...board.attributes } as trelloBoard;

    if (board.relationships && board.relationships.trelloOrganization) {
      const trelloOrgData = board.relationships.trelloOrganization.data || {};
      const orgId = trelloOrgData.id || '';
      const organization = included.find((org) => org.id === orgId) || null;

      if (organization) {
        record.organization = {
          id: orgId,
          name: organization.attributes.name || ''
        };
      }
    }

    return record;
  });
};

// Request a boards lists
const getBoardListRequest = async (
  authToken: string,
  boardId: string
): Promise<trelloList[]> => {
  let res;
  try {
    res = await fetch(
      `${API_DOMAIN}/api/v0/integrations/trello/boards/${boardId}/lists`,
      {
        method: 'GET',
        headers: {
          Authorization: `FB-JWT ${authToken}`
        }
      }
    );
  } catch (err) {
    throw Error(`${PREFIX} getBoardListRequest: request failed: ${err}`);
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch (err) {
    throw Error(`${PREFIX} getBoardListRequest: failed to parse JSON: ${err}`);
  }

  // Convert payload to Trello Boards
  return payload.data.map(
    (list) =>
      ({
        id: list.id,
        ...list.attributes,
        board: boardId
      } as trelloList)
  );
};

// POST request to authorise trello
const postAuthoriseRequest = (
  authToken: string,
  body: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/integrations/trello/authorization`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body })
  });

// Request to authorise trello
const authorise = async (
  data: Record<string, string>
): Promise<TrelloIntegration> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} authorise: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postAuthoriseRequest(authToken, data);
  } catch (err) {
    throw Error(`${PREFIX} authorise: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  if (response.status !== 204) {
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(`${PREFIX} authorise: failed to parse JSON: ${err}`);
    }
  }

  // Throw unsuccessful request API error
  const apiError: any = generateAuhtoriseError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return {
    id: responseJson.data.id,
    ...responseJson.data.attributes
  };
};

// Request Boards for previously
// authorized Trello user
export default {
  async findAllBoards(): Promise<trelloBoard[]> {
    let authToken = '';
    try {
      authToken = await currentUser.getIdToken();
    } catch (tokenErr) {
      throw Error(
        `${PREFIX} findAllBoards: auth token could not be recovered: ${tokenErr}`
      );
    }

    return getBoardsRequest(authToken);
  },

  // GET all lists belonging to a trello board
  async findAllBoardLists(boardId: string): Promise<trelloList[]> {
    let authToken = '';
    try {
      authToken = await currentUser.getIdToken();
    } catch (tokenErr) {
      throw Error(
        `${PREFIX} findAllBoardLists: auth token could not be recovered: ${tokenErr}`
      );
    }

    return getBoardListRequest(authToken, boardId);
  },
  authorise
};
