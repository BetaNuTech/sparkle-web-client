import sinon from 'sinon';
import inspectionsApi from './inspections';
import currentUser from '../../utils/currentUser';
import deepClone from '../../../__tests__/helpers/deepClone';
import { fullInspection } from '../../../__mocks__/inspections';
import ErrorUnauthorized from '../../models/errors/unauthorized';
import inspectionModel from '../../models/inspection';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';

const inspectionAttrs = deepClone(fullInspection);
delete inspectionAttrs.id;

const API_INSP_TEMPLATE_UPDATE_RESULT = {
  data: {
    id: fullInspection.id,
    type: 'inspection',
    attributes: inspectionAttrs
  }
};

const jsonOK = (body) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 201,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

const jsonErr = (status = 401) => {
  const mockResponse = new Response(JSON.stringify([]), {
    status,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Inspections', () => {
  afterEach(() => sinon.restore());

  test('it rejects with unauthorized error when patch inspection template request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      await inspectionsApi.updateInspectionTemplate(fullInspection.id, {
        items: { one: { isItemNA: true } }
      } as inspectionTemplateUpdateModel);
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves an updated inspection model on sucessful patch inspection template request', async () => {
    const expected = deepClone(fullInspection) as inspectionModel;

    sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_INSP_TEMPLATE_UPDATE_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await inspectionsApi.updateInspectionTemplate(
      fullInspection.id,
      {
        items: { one: { isItemNA: true } }
      } as inspectionTemplateUpdateModel
    );

    expect(actual).toEqual(expected);
  });
});
