import { renderHook } from '@testing-library/react-hooks';
import useInspectionItems from './useInspectionItems';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';

// Declared this as changing mock should not fail the test cases
const items: Record<string, inspectionTemplateItemModel> = {
  'item-1': {
    deficient: false,
    index: 1,
    itemType: 'main',
    title: 'B',
    mainInputType: 'threeactions_abc',
    sectionId: 'section-1',
    version: 0
  },
  'item-2': {
    deficient: false,
    index: 2,
    itemType: 'main',
    title: 'C',
    mainInputType: 'threeactions_abc',
    sectionId: 'section-1',
    version: 0
  },
  'item-3': {
    deficient: false,
    index: 0,
    itemType: 'main',
    title: 'A',
    mainInputType: 'threeactions_abc',
    sectionId: 'section-1',
    version: 0
  },
  'item-4': {
    deficient: false,
    index: 1,
    itemType: 'main',
    title: 'B',
    mainInputType: 'threeactions_abc',
    sectionId: 'section-2',
    version: 0
  },
  'item-5': {
    deficient: false,
    index: 0,
    itemType: 'main',
    title: 'A',
    mainInputType: 'threeactions_abc',
    sectionId: 'section-2',
    version: 0
  }
};

describe('Unit | Features | Property Update Inspection | Hooks | Use Inspection Sections', () => {
  test('should return items in each sections', () => {
    const expectedCount = 2;
    const expectedSectionOneCount = 3;
    const expectedSectionTwoCount = 2;

    const { result } = renderHook(() => useInspectionItems(items));
    const { sectionItems } = result.current;

    const actualCount = sectionItems.size;
    const actualSectionOneCount = sectionItems.get('section-1').length;
    const actualSectionTwoCount = sectionItems.get('section-2').length;

    expect(actualCount).toEqual(expectedCount);
    expect(actualSectionOneCount).toEqual(expectedSectionOneCount);
    expect(actualSectionTwoCount).toEqual(expectedSectionTwoCount);
  });

  test('should return items in each sections in sorted order', () => {
    const expectedSectionOneTitle = 'A | B | C';
    const expectedSectionTwoTitle = 'A | B';

    const { result } = renderHook(() => useInspectionItems(items));
    const { sectionItems } = result.current;

    const actualSectionOneTitle = sectionItems.get('section-1').map(item => item.title).join(' | ');
    const actualSectionTwoTitle = sectionItems.get('section-2').map(item => item.title).join(' | ');

    expect(actualSectionOneTitle).toEqual(expectedSectionOneTitle);
    expect(actualSectionTwoTitle).toEqual(expectedSectionTwoTitle);
  });
});
