import { renderHook, act } from '@testing-library/react-hooks';
import deepClone from '../../../__tests__/helpers/deepClone';
import useUpdateTemplate from './useUpdateTemplate';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import { admin } from '../../../__mocks__/users';
import {
  unselectedCheckmarkItem,
  emptyTextInputItem,
  originalMultiSection
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

  test('should clone section of the template', () => {
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const sectionId = originalMultiSection.id;
    const currentTemplate = {
      sections: {
        [sectionId]: deepClone(
          originalMultiSection
        ) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useUpdateTemplate(updatedTemplate, currentTemplate)
    );
    const selectionResult = result.current.addSection(sectionId);
    const clonedSection =
      selectionResult.sections[Object.keys(selectionResult.sections)[0]];

    expect(clonedSection.title).toEqual(originalMultiSection.title);
    expect(clonedSection.section_type).toEqual(
      originalMultiSection.section_type
    );
    expect(clonedSection.added_multi_section).toBeTruthy();
  });

  test('should remove section from the template', () => {
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const sectionId = originalMultiSection.id;
    const currentTemplate = {
      sections: {
        [sectionId]: deepClone(
          originalMultiSection
        ) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useUpdateTemplate(updatedTemplate, currentTemplate)
    );
    const selectionResult = result.current.removeSection(sectionId);
    const removedSections =
      selectionResult.sections[Object.keys(selectionResult.sections)[0]];
    expect(removedSections).toBeNull();
  });

  test('should update inspector notes', () => {
    const expected = 'this is inspector notes';
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
    const selectionResult = result.current.updateInspectorNotes(
      itemId,
      expected
    );
    const actual = ((selectionResult.items || {})[itemId] || {}).inspectorNotes;
    expect(actual).toEqual(expected);
  });

  test('should enable admin edit mode', () => {
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
    act(() => {
      result.current.enableAdminEditMode(admin);
    });

    expect(result.current.isAdminEditModeEnabled).toBeTruthy();
  });

  test('should disable admin edit mode', () => {
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
    act(() => {
      result.current.disableAdminEditMode();
    });

    expect(result.current.isAdminEditModeEnabled).toBeFalsy();
  });

  test('should update inspector notes with admin edit if admin edit mode enabled', () => {
    const expected = 'this is inspector notes';
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
    act(() => {
      result.current.enableAdminEditMode(admin);
    });

    const selectionResult = result.current.updateInspectorNotes(
      itemId,
      expected
    );

    const actual = ((selectionResult.items || {})[itemId] || {}).inspectorNotes;
    const adminEditsResult = ((selectionResult.items || {})[itemId] || {}).adminEdits;
    expect(actual).toEqual(expected);
    expect(adminEditsResult).toBeTruthy();
  });
});
