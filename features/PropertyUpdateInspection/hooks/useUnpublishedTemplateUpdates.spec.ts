import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import { act, waitFor } from '@testing-library/react';
import useUnpublishedTemplateUpdates from './useUnpublishedTemplateUpdates';
import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import {
  unselectedCheckmarkItem,
  unselectedThumbsItem
} from '../../../__mocks__/inspections';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';

describe('Unit | Features | Property Update Inspection | Hooks | Use Unpublished Template Updates', () => {
  test('should set when inspection template has unpublished updates', async () => {
    const sendNotification = sinon.spy();
    const expected = true;

    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const { result } = renderHook(() =>
      useUnpublishedTemplateUpdates(
        'inspection-1',
        'property-1',
        sendNotification
      )
    );

    await act(async () => {
      await result.current.setLatestTemplateUpdates(updatedTemplate);
    });

    const actual = result.current.hasUpdates;
    expect(actual).toEqual(expected);
  });

  test('should request to add template update in local indexed db for unpublished updates', async () => {
    const sendNotification = sinon.spy();
    const expected = true;
    const createRecord = sinon.spy(inspectionTemplateUpdates, 'createRecord');

    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const { result } = renderHook(() =>
      useUnpublishedTemplateUpdates(
        'inspection-1',
        'property-1',
        sendNotification
      )
    );

    await act(async () => {
      await result.current.setLatestTemplateUpdates(updatedTemplate);
    });
    await waitFor(() => createRecord.called);

    const actual = createRecord.called;
    expect(actual).toEqual(expected);
  });

  test('should request to update inspection template update in local indexed db', async () => {
    const sendNotification = sinon.spy();
    const expected = true;
    const updateRecord = sinon.spy(inspectionTemplateUpdates, 'updateRecord');

    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;

    const updatedTemplateWithThumbsItem = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel,
        [unselectedThumbsItem.id]: {
          mainInputSelection: 1,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const { result } = renderHook(() =>
      useUnpublishedTemplateUpdates(
        'inspection-1',
        'property-1',
        sendNotification
      )
    );

    await act(async () => {
      await result.current.setLatestTemplateUpdates(updatedTemplate);
    });

    await act(async () => {
      result.current.setLatestTemplateUpdates(updatedTemplateWithThumbsItem);
    });

    await waitFor(() => updateRecord.called);

    const actual = updateRecord.called;
    expect(actual).toEqual(expected);
  });

  test('should request to remove inspection template update from local indexed db', async () => {
    const sendNotification = sinon.spy();
    const expected = true;
    const deleteRecord = sinon.spy(inspectionTemplateUpdates, 'deleteRecord');

    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const { result } = renderHook(() =>
      useUnpublishedTemplateUpdates(
        'inspection-1',
        'property-1',
        sendNotification
      )
    );

    await act(async () => {
      await result.current.setLatestTemplateUpdates(updatedTemplate);
    });

    await act(async () => {
      result.current.setLatestTemplateUpdates({});
    });

    await waitFor(() => deleteRecord.called);

    const actual = deleteRecord.called;
    expect(actual).toEqual(expected);
  });
});
