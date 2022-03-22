import { renderHook } from '@testing-library/react-hooks';

import {
  selectedCheckmarkItem,
  singleSection
} from '../../../__mocks__/inspections';
import useValidateTemplate from './useValidateTemplate';
import { emptyTemplate, templateA } from '../../../__mocks__/templates';

describe('Unit | Features | Template Edit | Hooks | Use Validate Template', () => {
  test('should validate general step', async () => {
    const tests = [
      {
        expected: false,
        currentTemplate: emptyTemplate,
        updatedTemplate: {},
        message: 'returns invalid if template name is blank'
      },
      {
        expected: true,
        currentTemplate: templateA,
        updatedTemplate: {},
        message: 'returns valid if current template has name'
      },
      {
        expected: false,
        currentTemplate: templateA,
        updatedTemplate: { name: '' },
        message: 'returns invalid if updated template name is blank'
      },
      {
        expected: true,
        currentTemplate: emptyTemplate,
        updatedTemplate: { name: 'name' },
        message: 'returns valid if updated template has name'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentTemplate,
        updatedTemplate = {},
        message
      } = tests[i];
      const { result } = renderHook(() =>
        useValidateTemplate(updatedTemplate, currentTemplate)
      );
      const actual = result.current.stepsStatus.general === 'valid';
      expect(actual, message).toEqual(expected);
    }
  });

  test('should validate sections step', async () => {
    const tests = [
      {
        expected: false,
        currentTemplate: emptyTemplate,
        updatedTemplate: {},
        message: 'returns invalid if template does not have sections'
      },
      {
        expected: true,
        currentTemplate: { ...templateA, sections: { one: singleSection } },
        updatedTemplate: {},
        message: 'returns valid if current template has sections'
      },
      {
        expected: false,
        currentTemplate: { ...templateA, sections: { one: singleSection } },
        updatedTemplate: { sections: { one: null } },
        message: 'returns invalid if updates removing all sections'
      },
      {
        expected: true,
        currentTemplate: emptyTemplate,
        updatedTemplate: { sections: { one: singleSection } },
        message: 'returns valid if updated template has sections'
      },
      {
        expected: true,
        currentTemplate: { ...templateA, sections: { one: singleSection } },
        updatedTemplate: {},
        message: 'returns valid if section has title'
      },
      {
        expected: false,
        currentTemplate: {
          ...templateA,
          sections: { one: { ...singleSection, title: '' } }
        },
        updatedTemplate: {},
        message: 'returns invalid if section does not have title'
      },
      {
        expected: true,
        currentTemplate: {
          ...templateA,
          sections: { one: { ...singleSection, title: '' } }
        },
        updatedTemplate: { sections: { one: { title: 'title' } } },
        message: 'returns valid if updated section has title'
      },
      {
        expected: false,
        currentTemplate: { ...templateA, sections: { one: singleSection } },
        updatedTemplate: { sections: { one: { title: '' } } },
        message: 'returns invalid if updates removing title'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentTemplate,
        updatedTemplate = {},
        message
      } = tests[i];
      const { result } = renderHook(() =>
        useValidateTemplate(updatedTemplate, currentTemplate)
      );
      const actual = result.current.stepsStatus.sections === 'valid';
      expect(actual, message).toEqual(expected);
    }
  });

  test('should validate section items step', async () => {
    const tests = [
      {
        expected: false,
        currentTemplate: emptyTemplate,
        updatedTemplate: {},
        message: 'returns invalid if template does not have items'
      },
      {
        expected: true,
        currentTemplate: {
          ...templateA,
          items: { one: selectedCheckmarkItem }
        },
        updatedTemplate: {},
        message: 'returns valid if current template has items'
      },
      {
        expected: false,
        currentTemplate: {
          ...templateA,
          items: { one: selectedCheckmarkItem }
        },
        updatedTemplate: { items: { one: null } },
        message: 'returns invalid if updates removing all items'
      },
      {
        expected: true,
        currentTemplate: emptyTemplate,
        updatedTemplate: { items: { one: selectedCheckmarkItem } },
        message: 'returns valid if updated template has items'
      },
      {
        expected: true,
        currentTemplate: {
          ...templateA,
          items: { one: selectedCheckmarkItem }
        },
        updatedTemplate: {},
        message: 'returns valid if item has title'
      },
      {
        expected: false,
        currentTemplate: {
          ...templateA,
          items: { one: { ...selectedCheckmarkItem, title: '' } }
        },
        updatedTemplate: {},
        message: 'returns invalid if item does not have title'
      },
      {
        expected: true,
        currentTemplate: {
          ...templateA,
          items: { one: { ...selectedCheckmarkItem, title: '' } }
        },
        updatedTemplate: { items: { one: { title: 'title' } } },
        message: 'returns valid if updated item has title'
      },
      {
        expected: false,
        currentTemplate: {
          ...templateA,
          items: { one: selectedCheckmarkItem }
        },
        updatedTemplate: { items: { one: { title: '' } } },
        message: 'returns invalid if updates removing title'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentTemplate,
        updatedTemplate = {},
        message
      } = tests[i];
      const { result } = renderHook(() =>
        useValidateTemplate(updatedTemplate, currentTemplate)
      );
      const actual = result.current.stepsStatus['section-items'] === 'valid';
      expect(actual, message).toEqual(expected);
    }
  });
});
