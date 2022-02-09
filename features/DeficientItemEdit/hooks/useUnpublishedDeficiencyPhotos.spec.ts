import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import deficientItemPhotos from '../../../common/services/indexedDB/deficientItemPhotos';
import currentUser from '../../../common/utils/currentUser';
import useUnpublishedDeficiencyPhotos from './useUnpublishedDeficiencyPhotos';

describe('Unit | Features | Deficient Item Edit | Hooks | Use Unpublished Deficiency Photos', () => {
  afterEach(() => sinon.restore());

  test('should call the method to get photos data by deficiency id', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendNotification = sinon.spy();
    const expected = true;
    const spyFunc = sinon.spy(deficientItemPhotos, 'query');
    const { result } = renderHook(() =>
      useUnpublishedDeficiencyPhotos(sendNotification, 'deficiency-1')
    );

    await act(async () => {
      await result.current.reloadPhotos();
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to add deficiency photos', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const sendNotification = sinon.spy();
    const expected = true;

    const file =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    const spyFunc = sinon.spy(deficientItemPhotos, 'createRecord');
    const { result } = renderHook(() =>
      useUnpublishedDeficiencyPhotos(sendNotification, 'deficiency-1')
    );

    await act(async () => {
      await result.current.addUnpublishedDeficiencyPhoto(
        file,
        100,
        'item-1',
        'inspection-1',
        'property-1',
        moment().unix()
      );
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to remove deficiency photos', async () => {
    const sendNotification = sinon.spy();
    const expected = true;

    const spyFunc = sinon.spy(deficientItemPhotos, 'deleteRecord');
    const { result } = renderHook(() =>
      useUnpublishedDeficiencyPhotos(sendNotification, 'deficiency-1')
    );

    await act(async () => {
      await result.current.removedUnpubilshedDeficiencyPhoto('photo-1');
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the method to update deficiency photos', async () => {
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const sendNotification = sinon.spy();
    const expected = true;

    const spyFunc = sinon.spy(deficientItemPhotos, 'updateRecord');
    const { result } = renderHook(() =>
      useUnpublishedDeficiencyPhotos(sendNotification, 'deficiency-1')
    );

    await act(async () => {
      await result.current.addUnpublishedDeficiencyPhotoCaption(
        'photo-1',
        'caption text'
      );
    });
    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
