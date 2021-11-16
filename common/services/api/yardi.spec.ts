import sinon from 'sinon';
import yardiApi from './yardi';
import currentUser from '../../utils/currentUser';
import { yardiWorkOrderOne } from '../../../__mocks__/yardi/workOrders';
import residentsJson from '../../../__mocks__/yardi/residents';
import occupantsJson from '../../../__mocks__/yardi/occupants';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';

const workOrderAttrs = { ...yardiWorkOrderOne };
delete workOrderAttrs.id;
delete workOrderAttrs.resident;

const residentAttrs = residentsJson.map((r) => {
  const resident = { ...r };
  delete resident.id;
  delete resident.occupants;
  return resident;
});

const occupanttAttrs = residentsJson.map((o: any) => {
  const occupant = { ...o };
  delete occupant.id;
  delete occupant.resident;
  return occupant;
});

const API_WORK_ORDERS_RESULT = {
  data: [
    {
      id: yardiWorkOrderOne.id,
      type: 'work-order',
      attributes: workOrderAttrs,
      relationships: {
        resident: {
          data: { id: yardiWorkOrderOne.resident, type: 'resident' }
        }
      }
    }
  ]
};

const API_RESIDENTS_RESULT = {
  data: residentsJson.map((r, i) => ({
    id: r.id,
    type: 'resident',
    attributes: residentAttrs[i],
    relationships: {
      occupants: {
        data: (r.occupants || []).map((occId) => ({
          id: occId,
          type: 'occupant'
        }))
      }
    }
  })),
  included: occupantsJson.map((o, i) => ({
    id: o.id,
    type: 'occupant',
    attributes: occupanttAttrs[i],
    relationships: {
      resident: {
        id: o.resident,
        type: 'resident'
      }
    }
  }))
};

const jsonOK = (body) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

const jsonErr = (status = 403) => {
  const mockResponse = new Response(JSON.stringify([]), {
    status,
    headers: { 'Content-type': 'application/json' }
  });

  return Promise.resolve(mockResponse);
};

describe('Unit | Services | API | Yardi', () => {
  afterEach(() => sinon.restore());

  test('it rejects with forbidden error when work order request forbidden', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getWorkOrdersRequest('test-property');
    } catch (err) {
      actual = err instanceof ErrorForbidden;
    }

    expect(actual).toEqual(expected);
  });

  test('it rejects with not found error when resident request non found', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr(404));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let actual = false;
    try {
      await yardiApi.getResidentsRequest('test-property');
    } catch (err) {
      actual = err instanceof ErrorNotFound;
    }

    expect(actual).toEqual(expected);
  });

  test('it resolves all work orders for a property', async () => {
    const expected = [yardiWorkOrderOne];

    sinon.stub(window, 'fetch').resolves(jsonOK(API_WORK_ORDERS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await yardiApi.getWorkOrdersRequest('test-property');

    expect(actual).toEqual(expected);
  });

  test('it resolves all residents and occupants for a property', async () => {
    const residentIds = residentsJson.map((r) => r.id);
    const occupantIds = occupantsJson.map((o) => o.id);
    const expected = `residents: ${residentIds.join(
      ','
    )} | occupants: ${occupantIds.join(',')}`;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_RESIDENTS_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const result = await yardiApi.getResidentsRequest('test-property');
    const resultResidentIds = result.residents.map((r) => r.id);
    const resultOccupantIds = result.occupants.map((o) => o.id);
    const actual = `residents: ${resultResidentIds.join(
      ','
    )} | occupants: ${resultOccupantIds.join(',')}`;

    expect(actual).toEqual(expected);
  });
});
