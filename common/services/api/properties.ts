import currentUser from '../../utils/currentUser';
import propertyModel from '../../models/property';
import ErrorServerInternal from '../../models/errors/serverInternal';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorBadRequest from '../../models/errors/badRequest';

const PREFIX = 'services: api: properties:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST a Property Request
const postRequest = (
  authToken: string,
  property: propertyModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...property
    })
  });

// PUT Property Request
const putRequest = (
  authToken: string,
  propertyId: string,
  property: propertyModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}`, {
    method: 'PUT',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...property
    })
  });

// POST image
const postFileRequest = (
  authToken: string,
  propertyId: string,
  target: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(
    `${API_DOMAIN}/api/v0/properties/${propertyId}/image?target=${target}`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`
      },
      body: formData
    }
  );
};

export const createProperty = async (
  property: propertyModel
): Promise<propertyModel | any> => {
  let authToken = '';
  let newProperty: propertyModel = null;

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createProperty: auth token could not be recovered: ${tokenErr}`
    );
  }
  const response = await postRequest(authToken, property);

  let responseJson: any = {};

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createProperty: failed to parse JSON: ${err}`);
  }

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} createProperty: system failure`);
  }

  if (response.status === 403) {
    throw new ErrorForbidden(`${PREFIX} createProperty: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} createProperty: record not found`);
  }

  if (response.status === 400) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const badRequest = new ErrorBadRequest(
      `${PREFIX} createProperty: fix request errors`
    );
    badRequest.addErrors(errorsResponse);
    throw badRequest;
  }

  if (response.status === 201) {
    newProperty = {
      id: responseJson.data.id,
      ...responseJson.data,
      ...responseJson.data.attributes
    } as propertyModel;
  }

  return newProperty;
};

export const updateProperty = async (
  propertyId: string,
  property: propertyModel
): Promise<propertyModel> => {
  let authToken = '';
  let newProperty: propertyModel = null;

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateProperty: auth token could not be recovered: ${tokenErr}`
    );
  }
  const response = await putRequest(authToken, propertyId, property);

  let responseJson: any = {};

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateProperty: failed to parse JSON: ${err}`);
  }

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} updateProperty: system failure`);
  }

  if (response.status === 403) {
    throw new ErrorForbidden(`${PREFIX} updateProperty: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} updateProperty: record not found`);
  }

  if (response.status === 400) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const badRequest = new ErrorBadRequest(
      `${PREFIX} updateProperty: fix request errors`
    );
    badRequest.addErrors(errorsResponse);
    throw badRequest;
  }

  if (response.status === 201) {
    newProperty = {
      id: responseJson.data.id,
      ...responseJson.data.attributes
    } as propertyModel;
  }

  return newProperty;
};

const uploadImage = async (
  property: propertyModel,
  propertyId: string,
  target: string,
  file: File
): Promise<propertyModel> => {
  let authToken = '';
  let newProperty: propertyModel = null;

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} uploadImage: auth token could not be recovered: ${tokenErr}`
    );
  }

  const response = await postFileRequest(authToken, propertyId, target, file);

  let responseJson: any = {};

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} uploadImage: failed to parse JSON: ${err}`);
  }

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} uploadImage: system failure`);
  }

  if (response.status === 403) {
    throw new ErrorForbidden(`${PREFIX} uploadImage: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} uploadImage: record not found`);
  }

  if (response.status === 400) {
    const errorsResponse = responseJson ? responseJson.errors : [];
    const badRequest = new ErrorBadRequest(`${PREFIX} uploadImage: fix errors`);
    badRequest.addErrors(errorsResponse);
    throw badRequest;
  }

  if (response.status === 201) {
    newProperty = {
      id: responseJson.data.id,
      ...property,
      ...responseJson.data.attributes
    } as propertyModel;
  }

  return newProperty;
};

export default { createProperty, updateProperty, uploadImage };
