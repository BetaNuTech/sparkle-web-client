import sinon from 'sinon';
import inspectionsApi from '../../../common/services/api/inspections';
import inspectionService from './inspection';
import errorReports from '../../../common/services/api/errorReports';
import { templateA } from '../../../__mocks__/templates';

describe('Unit | Features | Property Profile | Services | Upload Attachment', () => {
  afterEach(() => sinon.restore());

  test('it sends error notification on failure', async () => {
    const expected = 'error';
    const sendNotification = sinon.spy();

    sinon.stub(inspectionsApi, 'createRecord').rejects();
    const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

    await expect(
      inspectionService.createRecord('property-1', templateA, sendNotification)
    ).rejects.toThrowError(Error);

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.type : 'NA';
    expect(actual).toEqual(expected);

    const actualError = sendError.called;
    expect(actualError).toEqual(true);
  });

  test('it sends success notification on success', async () => {
    const expected = 'success';
    const sendNotification = sinon.spy();

    const resultCreate = {
      status: 201,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      json: () => {}
    };
    sinon.stub(inspectionsApi, 'createRecord').resolves(resultCreate);
    sinon.stub(resultCreate, 'json').resolves({
      data: {
        id: 'inspection-1'
      }
    });

    await inspectionService.createRecord(
      'property-1',
      templateA,
      sendNotification
    );

    const result = sendNotification.firstCall || { args: [] };
    const resultOptions = result.args[1];
    const actual = resultOptions ? resultOptions.type : 'NA';
    expect(actual).toEqual(expected);
  });
});
