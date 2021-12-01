import { renderHook } from '@testing-library/react-hooks';
import deepClone from '../../../__tests__/helpers/deepClone';
import useUpdateTemplate from './useUpdateTemplate';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import {
  unselectedCheckmarkItem,
  emptyTextInputItem
} from '../../../__mocks__/inspections';

describe('Unit | Features | Property Update Inspection | Hooks | Use Update Template', () => {
  test('should update main input item selection', () => {
    const expected = 1;
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const itemId = unselectedCheckmarkItem.id;
    const currentTemplate = {
      items: {
        [itemId]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useUpdateTemplate(updatedTemplate, currentTemplate)
    );
    const selectionResult = result.current.updateMainInputSelection(
      itemId,
      expected
    );
    const actual = ((selectionResult.items || {})[itemId] || {})
      .mainInputSelection;
    expect(actual).toEqual(expected);
  });

  test('should update main input note value', () => {
    const expected = 'this is the note';
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const itemId = unselectedCheckmarkItem.id;
    const currentTemplate = {
      items: {
        [itemId]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useUpdateTemplate(updatedTemplate, currentTemplate)
    );
    const selectionResult = result.current.updateMainInputNotes(
      itemId,
      expected
    );
    const actual = ((selectionResult.items || {})[itemId] || {}).mainInputNotes;
    expect(actual).toEqual(expected);
  });

  test('should update text input value', () => {
    const expected = 'this is text input value';
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const itemId = emptyTextInputItem.id;
    const currentTemplate = {
      items: {
        [itemId]: deepClone(emptyTextInputItem) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useUpdateTemplate(updatedTemplate, currentTemplate)
    );
    const selectionResult = result.current.updateTextInputValue(
      itemId,
      expected
    );
    const actual = ((selectionResult.items || {})[itemId] || {}).textInputValue;
    expect(actual).toEqual(expected);
  });
});
