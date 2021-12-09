import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useInspectionSections from './useInspectionSections';
import {
  singleSection,
  originalMultiSection,
  addedMultiSecton
} from '../../../__mocks__/inspections';

const SECTIONS = Object.freeze({
  [singleSection.id]: { ...singleSection, index: 1, title: 'two' },
  [originalMultiSection.id]: {
    ...originalMultiSection,
    index: 0,
    title: 'one'
  },
  [addedMultiSecton.id]: { ...addedMultiSecton, index: 2, title: 'three' }
});
const updatedTemplate = {} as inspectionTemplateUpdateModel;

describe('Unit | Features | Property Update Inspection | Hooks | Use Inspection Sections', () => {
  test('should sort sections by index', () => {
    const expected = 'one | two | three';

    const { result } = renderHook(() =>
      useInspectionSections(SECTIONS, updatedTemplate)
    );
    const { sortedTemplateSections } = result.current;

    const actual = sortedTemplateSections.map((s) => s.title).join(' | ');
    expect(actual).toEqual(expected);
  });

  test('should hide sections when collapsed', async () => {
    const expected = `${addedMultiSecton.id} | ${singleSection.id}`;
    const { result } = renderHook(() =>
      useInspectionSections(SECTIONS, updatedTemplate)
    );

    act(() => {
      result.current.onSectionCollapseToggle(SECTIONS[addedMultiSecton.id]);
    });
    act(() => {
      result.current.onSectionCollapseToggle(SECTIONS[singleSection.id]);
    });

    const actual = result.current.collapsedSections.join(' | ');
    expect(actual).toEqual(expected);
  });
});
