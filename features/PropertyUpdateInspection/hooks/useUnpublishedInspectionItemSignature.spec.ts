import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { selectedCheckmarkItem } from '../../../__mocks__/inspections';
import inspectionSignature from '../../../common/services/indexedDB/inspectionSignature';
import useUnpublishedInspectionItemSignature from './useUnpublishedInspectionItemSignature';

describe('Unit | Features | Inspection Edit | Hooks | Use Unpublished Inspection Signature', () => {
  afterEach(() => sinon.restore());

  test('should request to get photos from local database for inspection item', async () => {
    const sendNotification = sinon.spy();
    const expected = true;
    const spyFunc = sinon.spy(inspectionSignature, 'queryRecords');
    const { result } = renderHook(() =>
      useUnpublishedInspectionItemSignature(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.reloadSignatures();
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should request to add a signature to the local database', async () => {
    const sendNotification = sinon.spy();
    const expected = true;

    const file =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    const spyFunc = sinon.spy(inspectionSignature, 'createRecord');
    const { result } = renderHook(() =>
      useUnpublishedInspectionItemSignature(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.saveUnpublishedInspectionSignature(file, 'item-1');
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
