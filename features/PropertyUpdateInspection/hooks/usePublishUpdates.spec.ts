import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import inspectionsApi from '../../../common/services/api/inspections';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import currentUser from '../../../common/utils/currentUser';
import usePublishUpdates from './usePublishUpdates';

describe('Unit | Features | Inspection Edit | Hooks | Use Publish Updates', () => {
  afterEach(() => sinon.restore());

  test('should call the update inspection template method of inspection service', async () => {
    const expected = true;
    const sendNotification = sinon.spy();

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for method in inspectionsApi
    const spyFunc = sinon.spy(inspectionsApi, 'updateInspectionTemplate');

    await act(async () => {
      const { result } = renderHook(() => usePublishUpdates(sendNotification));
      result.current.updateInspectionTemplate('inspection-1', {
        items: {}
      } as inspectionTemplateUpdateModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
