import { renderHook } from '@testing-library/react-hooks';

import { act } from 'react-dom/test-utils';

import deepClone from '../../../__tests__/helpers/deepClone';
import useInspectionItems from './useInspectionItems';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedCheckedExclaimItem,
  unselectedAbcItem,
  singleSection,
  originalMultiSection
} from '../../../__mocks__/inspections';

const ITEMS = Object.freeze({
  [unselectedCheckmarkItem.id]: {
    ...unselectedCheckmarkItem,
    index: 1,
    title: 'two'
  },
  [selectedCheckmarkItem.id]: {
    ...selectedCheckmarkItem,
    mainInputSelection: 1,
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
    mainInputSelection: 1,
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
const SECTIONS = Object.freeze({
  [singleSection.id]: {
    ...singleSection
  },
  [originalMultiSection.id]: {
    ...originalMultiSection
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
      useInspectionItems(updatedTemplate, currentTemplate, false)
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
      useInspectionItems(updatedTemplate, currentTemplate, false)
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

  // eslint-disable-next-line
  test('should return identifiers to all deficient inspection items when inspection has required tracking enabled', () => {
    const expected = [selectedCheckmarkItem.id, selectedCheckedExclaimItem.id];

    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const currentTemplate = {
      items: deepClone(ITEMS),
      sections: deepClone(SECTIONS)
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useInspectionItems(updatedTemplate, currentTemplate, true)
    );
    const { inspectionItemDeficientIds } = result.current;
    expect(inspectionItemDeficientIds).toEqual(expected);
  });

  test('should filter section items on search', async () => {
    const expectedSectionOneTitle = 'one | two';
    const expectedSectionTwoTitle = 'one | two';

    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const currentTemplate = {
      items: deepClone(ITEMS),
      sections: deepClone(SECTIONS)
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useInspectionItems(updatedTemplate, currentTemplate, true)
    );
    await act(async () => {
      result.current.onSearchKeyDown({ target: { value: 'o' } });

      // need to wait for 300 ms
      // as we have 300ms debounce in useSearching Hook
      await new Promise((r) => setTimeout(r, 300));
    });
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

  test('should remove section if it doesnt have items after filter', async () => {
    const updatedTemplate = {} as inspectionTemplateUpdateModel;
    const currentTemplate = {
      items: deepClone(ITEMS),
      sections: deepClone(SECTIONS)
    } as inspectionTemplateUpdateModel;
    const { result } = renderHook(() =>
      useInspectionItems(updatedTemplate, currentTemplate, true)
    );
    await act(async () => {
      result.current.onSearchKeyDown({ target: { value: 'three' } });

      // need to wait for 300 ms
      // as we have 300ms debounce in useSearching Hook
      await new Promise((r) => setTimeout(r, 300));
    });
    const { sectionItems } = result.current;

    const sectionTwo = sectionItems.get('section-2');

    expect(sectionTwo).toBeUndefined();
  });
});
