import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import inspectionItemPhotosData from '../../../common/services/indexedDB/inspectionItemPhotosData';
import { selectedCheckmarkItem } from '../../../__mocks__/inspections';
import useInspectionItemPhotos from './useUnpublishedInspectionItemPhotos';

describe('Unit | Features | Inspection Edit | Hooks | Use Unpublished Inspection Item Photos', () => {
  afterEach(() => sinon.restore());

  test('should call the method to get photos data by item id', async () => {
    const sendNotification = sinon.spy();
    const expected = true;
    const spyFunc = sinon.spy(
      inspectionItemPhotosData,
      'queryInspectionRecords'
    );
    const { result } = renderHook(() =>
      useInspectionItemPhotos(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.getUnpublishedInspectionPhotos();
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to add inspection item photos', async () => {
    const sendNotification = sinon.spy();
    const expected = true;

    const files = [
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    ];

    const spyFunc = sinon.spy(
      inspectionItemPhotosData,
      'createMultipleRecords'
    );
    const { result } = renderHook(() =>
      useInspectionItemPhotos(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.addUnpublishedInspectionItemPhotos(files, 'item-1');
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
