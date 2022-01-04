import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import useUnpublishedTemplateUpdates from './useUnpublishedTemplateUpdates';
import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import unpublishedTemplateUpdatesModel from '../../../common/models/inspections/unpublishedTemplateUpdate';
import { unselectedThumbsItem } from '../../../__mocks__/inspections';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';

const PROPERTY_ID = '123';
const INSPECTION_ID = '456';

describe('Unit | Features | Property Update Inspection | Hooks | Use Unpublished Template Updates', () => {
  afterEach(() => sinon.restore());

  test('should load an existing unpublished inspection template record', async () => {
    const updatedTemplateWithThumbsItem = {
      items: {
        [unselectedThumbsItem.id]: {
          mainInputSelection: 1,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const expected = {
      id: 'abc',
      property: PROPERTY_ID,
      inspection: INSPECTION_ID,
      template: updatedTemplateWithThumbsItem
    } as unpublishedTemplateUpdatesModel;

    // Stub requests
    sinon.stub(inspectionTemplateUpdates, 'queryRecord').resolves(expected);

    const { result } = renderHook(() =>
      useUnpublishedTemplateUpdates(INSPECTION_ID)
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const actual = result.current.data || {};
    expect(actual).toEqual(expected);
  });
});
