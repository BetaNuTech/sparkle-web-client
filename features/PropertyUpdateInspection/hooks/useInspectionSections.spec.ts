import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useInspectionSections from './useInspectionSections';

// Declared this as changing mock should not fail the test cases
const sections = {
  'section-1': {
    id: 'section-1',
    added_multi_section: false,
    index: 1,
    section_type: 'single',
    title: 'A'
  },
  'section-2': {
    id: 'section-2',
    added_multi_section: true,
    index: 0,
    section_type: 'multi',
    title: 'B'
  },
  'section-3': {
    id: 'section-3',
    added_multi_section: false,
    index: 2,
    section_type: 'single',
    title: 'C'
  }
};

describe('Unit | Features | Property Update Inspection | Hooks | Use Inspection Sections', () => {
  test('should return section in sorted fashion', () => {
    const expected = 'B | A | C';

    const { result } = renderHook(() => useInspectionSections(sections));
    const { sortedTemplateSections } = result.current;

    const actual = sortedTemplateSections.map((s) => s.title).join(' | ');
    expect(actual).toEqual(expected);
  });

  test('should hide sections when collapsed', async () => {
    const expected = 'section-3 | section-1';

    const { result } = renderHook(() => useInspectionSections(sections));

    act(() => {
      result.current.onSectionCollapseToggle(sections['section-3']);
    });
    act(() => {
      result.current.onSectionCollapseToggle(sections['section-1']);
    });

    const actual = result.current.collapsedSections.join(' | ');

    expect(actual).toEqual(expected);
  });
});
