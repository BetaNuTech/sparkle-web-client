import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import mockTemplateCategories from '../../__mocks__/templateCategories';
import mockTemplates, { templateB, templateE } from '../../__mocks__/templates';
import CategorizedTemplates from '../models/templates/categorizedTemplates';
import templateModel from '../models/template';
import useCategorizedTemplates from './useCategorizedTemplates';

// Compare array map by value as string
const toCompare = (arr: CategorizedTemplates[], attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

const toCompareTemplate = (arr: templateModel[], attr = 'name'): string =>
  arr
    .map((obj) => obj[attr])
    .join(' | ')
    .toLowerCase();

describe('Unit | Features | Create Inspection | Hooks | Use Templates', () => {
  afterEach(() => sinon.restore());

  test('should sort template categories in alphabetical order', () => {
    const expected = 'inspection testers | property testers | uncategorized';
    const { result } = renderHook(() =>
      useCategorizedTemplates(mockTemplateCategories, mockTemplates)
    );
    const { categories } = result.current;
    const actual = toCompare(categories);
    expect(actual).toEqual(expected);
  });

  test('should not have uncategorized category', () => {
    const expected = 'inspection testers';
    const { result } = renderHook(() =>
      useCategorizedTemplates(mockTemplateCategories, [templateB])
    );
    const { categories } = result.current;
    const actual = toCompare(categories);
    expect(actual).toEqual(expected);
  });

  test('should sort templates inside category in alphabetical order', () => {
    const expected = 'living | parking';
    const { result } = renderHook(() =>
      useCategorizedTemplates(mockTemplateCategories, [templateB, templateE])
    );
    const { categories } = result.current;
    const actual = toCompareTemplate(categories[0].templates);
    expect(actual).toEqual(expected);
  });
});
