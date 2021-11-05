import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useUnpublishedTemplateUpdates from './useUnpublishedTemplateUpdates';
import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import { unselectedCheckmarkItem } from '../../../__mocks__/inspections';

describe('Unit | Features | Property Update Inspection | Hooks | Use Unpublished Template Updates', () => {
  test('should set when inspection template has unpublished updates', () => {
    const expected = true;
    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    const { result } = renderHook(() => useUnpublishedTemplateUpdates());

    act(() => {
      result.current.setLatestTemplateUpdates(updatedTemplate);
    });

    const actual = result.current.hasUpdates;
    expect(actual).toEqual(expected);
  });
});
