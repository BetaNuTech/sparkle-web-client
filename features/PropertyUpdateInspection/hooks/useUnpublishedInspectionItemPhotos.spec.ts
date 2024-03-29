import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import inspectionItemPhotosData from '../../../common/services/indexedDB/inspectionItemPhotosData';
import { selectedCheckmarkItem } from '../../../__mocks__/inspections';
import currentUser from '../../../common/utils/currentUser';
import useInspectionItemPhotos from './useUnpublishedInspectionItemPhotos';

describe('Unit | Features | Inspection Edit | Hooks | Use Unpublished Inspection Item Photos', () => {
  afterEach(() => sinon.restore());

  test('should call the method to get photos data by item id', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
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
      await result.current.reloadPhotos();
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to add inspection item photos', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendNotification = sinon.spy();
    const expected = true;

    const files =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    const spyFunc = sinon.spy(inspectionItemPhotosData, 'createRecord');
    const { result } = renderHook(() =>
      useInspectionItemPhotos(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.addUnpublishedInspectionItemPhoto(
        files,
        100,
        'item-1',
        'property-1'
      );
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to remove inspection item photos', async () => {
    const sendNotification = sinon.spy();
    const expected = true;

    const spyFunc = sinon.spy(inspectionItemPhotosData, 'deleteRecord');
    const { result } = renderHook(() =>
      useInspectionItemPhotos(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.removeUnpublishedInspectionItemPhoto('photo-1');
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to update inspection item photos', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const sendNotification = sinon.spy();
    const expected = true;

    const spyFunc = sinon.spy(inspectionItemPhotosData, 'updateRecord');
    const { result } = renderHook(() =>
      useInspectionItemPhotos(
        sendNotification,
        selectedCheckmarkItem,
        'inspection-1'
      )
    );

    await act(async () => {
      await result.current.addUnpublishedInspectionPhotoCaption(
        'photo-1',
        'caption text'
      );
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
