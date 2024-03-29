import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useInspectionSections from './useInspectionSections';
import {
  singleSection,
  originalMultiSection,
  addedMultiSection
} from '../../../__mocks__/inspections';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';

const SECTIONS = Object.freeze({
  [singleSection.id]: { ...singleSection, index: 1, title: 'two' },
  [originalMultiSection.id]: {
    ...originalMultiSection,
    index: 0,
    title: 'one'
  },
  [addedMultiSection.id]: { ...addedMultiSection, index: 2, title: 'three' }
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
    const expected = `${addedMultiSection.id} | ${singleSection.id}`;
    const { result } = renderHook(() =>
      useInspectionSections(SECTIONS, updatedTemplate)
    );

    act(() => {
      result.current.onSectionCollapseToggle(SECTIONS[addedMultiSection.id]);
    });
    act(() => {
      result.current.onSectionCollapseToggle(SECTIONS[singleSection.id]);
    });

    const actual = result.current.collapsedSections.join(' | ');
    expect(actual).toEqual(expected);
  });
});
