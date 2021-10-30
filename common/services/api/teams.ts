import currentUser from '../../utils/currentUser';
import teamModel from '../../models/team';
import ErrorServerInternal from '../../models/errors/serverInternal';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorBadRequest from '../../models/errors/badRequest';
import ErrorConflictingRequest from '../../models/errors/conflictingRequest';

const PREFIX = 'services: api: teams:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST a Team Request
const postRequest = (authToken: string, team: teamModel): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/teams`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...team
    })
  });

// PATCH Team Request
const patchRequest = (
  authToken: string,
  teamId: string,
  team: teamModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...team
    })
  });

export const createTeam = async (team: teamModel): Promise<teamModel | any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createTeam: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postRequest(authToken, team);
  } catch (err) {
    throw Error(`${PREFIX} createTeam: POST request failed: ${err}`);
  }

  let responseJson: any = {};

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createTeam: failed to parse JSON: ${err}`);
  }

  if (response.status === 400) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const badRequest = new ErrorBadRequest(
      `${PREFIX} createTeam: fix request errors`
    );
    badRequest.addErrors(errorsResponse);
    throw badRequest;
  }

  if (response.status === 409) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const conflictingRequest = new ErrorConflictingRequest(
      `${PREFIX} createTeam: fix request errors`
    );
    conflictingRequest.addErrors(errorsResponse);
    throw conflictingRequest;
  }

  // 201 success
  return {
    id: responseJson.data.id,
    ...responseJson.data.attributes
  } as teamModel;
};

export const updateTeam = async (
  teamId: string,
  team: teamModel
): Promise<teamModel | any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateTeam: auth token could not be recovered: ${tokenErr}`
    );
  }
  let response = null;
  try {
    response = await patchRequest(authToken, teamId, team);
  } catch (err) {
    throw Error(`${PREFIX} updateTeam: PATCH request failed: ${err}`);
  }

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} updateTeam: system failure`);
  }

  if (response.status === 401) {
    throw new ErrorForbidden(`${PREFIX} updateTeam: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} updateTeam: record not found`);
  }

  let responseJson: any = {};

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateTeam: failed to parse JSON: ${err}`);
  }

  if (response.status === 400) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const badRequest = new ErrorBadRequest(
      `${PREFIX} updateTeam: fix request errors`
    );
    badRequest.addErrors(errorsResponse);
    throw badRequest;
  }

  if (response.status === 409) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const conflictingRequest = new ErrorConflictingRequest(
      `${PREFIX} createTeam: fix request errors`
    );
    conflictingRequest.addErrors(errorsResponse);

    throw conflictingRequest;
  }

  // 201 success
  return {
    id: responseJson.data.id,
    ...responseJson.data.attributes
  } as teamModel;
};

export default { createTeam, updateTeam };
