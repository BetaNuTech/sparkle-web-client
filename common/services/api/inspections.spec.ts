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

const API_INSP_UPLOAD_PHOTO_RESULT = {
  data: {
    id: '123-abc',
    type: 'inspection-item-photo-data',
    attributes: {
      downloadURL: 'https://dummyimage.com/600x400/000/fff'
    }
  }
};

const API_INSP_PDF_REPORT_RESULT = {
  data: {
    id: fullInspection.id,
    type: 'inspection',
    attributes: {
      inspectionReportURL: 'pdf.com/report.pdf',
      inspectionReportStatus: 'completed_success',
      inspectionReportUpdateLastDate: 123
    }
  }
};

const FILE = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

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

  test('it rejects with unauthorized error when create inspection request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      await inspectionsApi.createRecord(fullInspection.property, {
        template: '123'
      });
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves an updated inspection model on successful create inspection request', async () => {
    const expected = deepClone(fullInspection) as inspectionModel;

    sinon
      .stub(window, 'fetch')
      .resolves(jsonOK(API_INSP_TEMPLATE_UPDATE_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    const actual = await inspectionsApi.createRecord(fullInspection.id, {
      template: '123'
    });

    expect(actual).toEqual(expected);
  });

  test('it rejects with unauthorized error when update inspection request not allowed', async () => {
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

  test('it resolves an updated inspection model on successful update inspection request', async () => {
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

  test('it rejects with unauthorized error when upload inspection photo data request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionsApi.uploadPhotoData(fullInspection.id, 'item-1', FILE);
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves upload inspection photo data request', async () => {
    const expected = {
      id: '123-abc',
      downloadURL: 'https://dummyimage.com/600x400/000/fff'
    };

    sinon.stub(window, 'fetch').resolves(jsonOK(API_INSP_UPLOAD_PHOTO_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await inspectionsApi.uploadPhotoData(
      fullInspection.id,
      'item-1',
      FILE
    );
    expect(actual).toEqual(expected);
  });

  test('it rejects with unauthorized error when generate PDF report request not allowed', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonErr());
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionsApi.generatePdfReport(fullInspection.id);
    } catch (err) {
      result = err;
    }

    const actual = result instanceof ErrorUnauthorized;
    expect(actual).toEqual(expected);
  });

  test('it resolves successful generate PDF report request', async () => {
    const expected = true;

    sinon.stub(window, 'fetch').resolves(jsonOK(API_INSP_PDF_REPORT_RESULT));
    sinon.stub(currentUser, 'getIdToken').resolves('token');

    // eslint-disable-next-line import/no-named-as-default-member
    const actual = await inspectionsApi.generatePdfReport(fullInspection.id);
    expect(actual).toEqual(expected);
  });
});
