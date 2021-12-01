import { renderHook } from '@testing-library/react-hooks';
import deepClone from '../../../__tests__/helpers/deepClone';
import useInspectionItems from './useInspectionItems';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedCheckedExclaimItem,
  unselectedAbcItem
} from '../../../__mocks__/inspections';

const ITEMS = Object.freeze({
  [unselectedCheckmarkItem.id]: {
    ...unselectedCheckmarkItem,
    index: 1,
    title: 'two'
  },
  [selectedCheckmarkItem.id]: {
    ...selectedCheckmarkItem,
    index: 2,
    title: 'three'
  },
  [unselectedThumbsItem.id]: {
    ...unselectedThumbsItem,
    index: 0,
    title: 'one'
  },
  [selectedCheckedExclaimItem.id]: {
    ...selectedCheckedExclaimItem,
    sectionId: 'section-2',
    index: 1,
    title: 'two'
  },
  [unselectedAbcItem.id]: {
    ...unselectedAbcItem,
    sectionId: 'section-2',
    index: 0,
    title: 'one'
  }
});

describe('Unit | Features | Property Update Inspection | Hooks | Use Inspection Items', () => {
  test('should return items in each sections', () => {
    const expectedCount = 2;
    const expectedSectionOneCount = 3;
    const expectedSectionTwoCount = 2;

    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const currentTemplate = {
      items: deepClone(ITEMS)
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useInspectionItems(updatedTemplate, currentTemplate)
    );
    const { sectionItems } = result.current;

    const actualCount = sectionItems.size;
    const actualSectionOneCount = sectionItems.get('section-1').length;
    const actualSectionTwoCount = sectionItems.get('section-2').length;

    expect(actualCount).toEqual(expectedCount);
    expect(actualSectionOneCount).toEqual(expectedSectionOneCount);
    expect(actualSectionTwoCount).toEqual(expectedSectionTwoCount);
  });

  test('should return items in each sections in sorted order', () => {
    const expectedSectionOneTitle = 'one | two | three';
    const expectedSectionTwoTitle = 'one | two';

    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const currentTemplate = {
      items: deepClone(ITEMS)
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useInspectionItems(updatedTemplate, currentTemplate)
    );
    const { sectionItems } = result.current;

    const actualSectionOneTitle = sectionItems
      .get('section-1')
      .map((item) => item.title)
      .join(' | ');
    const actualSectionTwoTitle = sectionItems
      .get('section-2')
      .map((item) => item.title)
      .join(' | ');

    expect(actualSectionOneTitle).toEqual(expectedSectionOneTitle);
    expect(actualSectionTwoTitle).toEqual(expectedSectionTwoTitle);
  });
});
