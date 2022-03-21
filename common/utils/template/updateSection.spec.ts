import TemplateModel from '../../models/template';
import updateSection from './updateSection';
import { templateA } from '../../../__mocks__/templates';
import {
  singleSection,
  originalMultiSection,
  addedMultiSection,
  unselectedCheckmarkItem
} from '../../../__mocks__/inspections';
import deepClone from '../deepClone';

describe('Unit | Common | Utils | Template | Update Section', () => {
  test('it sets a section title', () => {
    const sectionId = singleSection.id;
    const templateWithSection = {
      ...templateA,
      sections: { [sectionId]: { ...singleSection, title: '' } }
    };
    const tests = [
      {
        expected: undefined,
        current: deepClone(templateWithSection),
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        current: deepClone(templateWithSection),
        userChanges: { title: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'new title',
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionId]: { title: 'new title' } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'new title',
        current: deepClone(templateWithSection),
        userChanges: { title: 'new title' },
        msg: 'adds section title to updates'
      },
      {
        expected: 'new title',
        current: deepClone(templateWithSection),
        updated: { title: 'old name' },
        userChanges: { title: 'new title' }, // check whitespace padding removed
        msg: 'updates over previously updated title'
      },
      {
        expected: undefined,
        current: deepClone(templateWithSection),
        updated: { title: 'old name' },
        userChanges: { title: '' },
        msg: 'removes previously updated title back to empty original state'
      },
      {
        expected: undefined,
        current: {
          ...deepClone(templateWithSection),
          ...{
            sections: {
              ...deepClone(templateWithSection.sections),
              [sectionId]: { title: 'initial' }
            }
          }
        },
        updated: { sections: { [sectionId]: { title: 'update' } } },
        userChanges: { title: 'initial' },
        msg: 'removes previously updated title back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, current, updated = {}, userChanges, msg } = tests[i];
      const result = updateSection(
        updated as TemplateModel,
        current,
        userChanges,
        sectionId
      );
      const actual = result
        ? ((result.sections || {})[sectionId] || {}).title
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets the section type', () => {
    const sectionId = singleSection.id;
    const templateWithSection = {
      ...deepClone(templateA),
      sections: { [sectionId]: { ...singleSection } }
    };
    const tests = [
      {
        expected: undefined,
        current: deepClone(templateWithSection),
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: 'multi',
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionId]: { section_type: 'multi' } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'multi',
        current: deepClone(templateWithSection),
        userChanges: { section_type: 'multi' },
        msg: 'adds section type to updates'
      },
      {
        expected: 'multi',
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionId]: { section_type: 'single' } } },
        userChanges: { section_type: 'multi' }, // check whitespace padding removed
        msg: 'updates over previously updated type'
      },
      {
        expected: undefined,
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionId]: { section_type: 'multi' } } },
        userChanges: { section_type: 'single' },
        msg: 'removes previously updated type back to empty original state'
      },
      {
        expected: undefined,
        current: {
          ...deepClone(templateWithSection),
          ...{
            sections: {
              ...deepClone(templateWithSection.sections),
              [sectionId]: { section_type: 'single' }
            }
          }
        },
        updated: { sections: { [sectionId]: { section_type: 'multi' } } },
        userChanges: { section_type: 'single' },
        msg: 'removes previously updated type back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, current, updated = {}, userChanges, msg } = tests[i];
      const result = updateSection(
        updated as TemplateModel,
        current,
        userChanges,
        sectionId
      );
      const actual = result
        ? ((result.sections || {})[sectionId] || {}).section_type
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it updates a section index', () => {
    const sectionOneId = singleSection.id;
    const sectionTwoId = originalMultiSection.id; // Section updating
    const sectionThreeId = addedMultiSection.id;
    const sections = {
      [sectionOneId]: { ...singleSection, index: 0 },
      [sectionTwoId]: { ...originalMultiSection, index: 1 },
      [sectionThreeId]: { ...addedMultiSection, index: 2 }
    };

    const templateWithSection = {
      ...templateA,
      sections
    };
    const tests = [
      {
        expected: [undefined, undefined, undefined],
        current: deepClone(templateWithSection),
        userChanges: { title: 'title' },
        msg: 'ignores unrelated update'
      },
      {
        expected: [undefined, 1, undefined],
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionTwoId]: { index: 1 } } },
        userChanges: { title: 'title' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: [1, 0, undefined],
        current: deepClone(templateWithSection),
        userChanges: { index: 0 }, // Move to 1st position
        msg: 'updates section index sorting up'
      },
      {
        expected: [undefined, 2, 1],
        current: deepClone(templateWithSection),
        userChanges: { index: 2 }, // Move to 3rd position
        msg: 'updates section index sorting down'
      },
      {
        expected: [undefined, undefined, undefined],
        current: deepClone(templateWithSection),
        updated: {
          sections: {
            [sectionOneId]: { index: 1 },
            [sectionTwoId]: { index: 0 } // Previous move to 1st
          }
        },
        userChanges: { index: 1 }, // Move back to 2nd
        msg: 'updates over previously updated index'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, current, updated = {}, userChanges, msg } = tests[i];
      const result = updateSection(
        updated as TemplateModel,
        current,
        userChanges,
        sectionTwoId
      );

      // check current and other sections indexes are updated as expected
      const expectedIdOne = ((result.sections || {})[sectionOneId] || {}).index;
      const expectedIdTwo = ((result.sections || {})[sectionTwoId] || {}).index;
      const expectedIdThree = ((result.sections || {})[sectionThreeId] || {})
        .index;

      const actual = [expectedIdOne, expectedIdTwo, expectedIdThree];
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it adds new section', () => {
    const sectionId = singleSection.id;
    const templateWithSection = {
      ...templateA,
      sections: { [sectionId]: { ...singleSection } }
    };
    const tests = [
      {
        expected: 1,
        current: deepClone(templateWithSection),
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: 1,
        current: deepClone(templateWithSection),
        userChanges: { new: true },
        msg: 'adds new section'
      },
      {
        expected: 2,
        current: deepClone(templateWithSection),
        updated: { sections: { [sectionId]: { title: 'new title' } } },
        userChanges: { new: true },
        msg: 'add new Section and keep updated sections updates '
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, current, updated = {}, userChanges, msg } = tests[i];
      const result = updateSection(
        updated as TemplateModel,
        current,
        userChanges,
        sectionId
      );
      const actual = result ? Object.keys(result.sections || {}).length : 0;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should remove a previously published section', () => {
    const expected = [0, 1];
    const sectionOneId = singleSection.id;
    const sectionTwoId = originalMultiSection.id;
    const sectionThreeId = addedMultiSection.id;
    const current = {
      ...deepClone(templateA),
      sections: {
        [sectionOneId]: { ...singleSection, index: 0 },
        [sectionTwoId]: { ...originalMultiSection, index: 1 },
        [sectionThreeId]: { ...addedMultiSection, index: 2 }
      }
    };

    const updates = { sections: { [sectionTwoId]: { index: 0 } } };
    const result = updateSection(
      updates as TemplateModel,
      current,
      null,
      sectionTwoId
    );

    // check current and other sections indexes are updated as expected
    const expectedIndexOne =
      ((result.sections || {})[sectionOneId] || {}).index || 0;

    const expectedIndexThree =
      ((result.sections || {})[sectionThreeId] || {}).index || 0;
    const actual = [expectedIndexOne, expectedIndexThree];

    expect(actual).toEqual(expected);

    // check if removed section has been set to null
    const removedSectionValue = (result.sections || {})[sectionTwoId];
    expect(removedSectionValue).toBeNull();
  });

  test('it should request to delete a removed published section items', () => {
    const expected = [null, null];
    const sectionOneId = 'section-123';
    const sectionTwoId = 'section-456';
    const current = {
      ...deepClone(templateA),
      sections: {
        [sectionOneId]: { ...singleSection, index: 0 },
        [sectionTwoId]: { ...singleSection, index: 1 }
      },
      items: {
        one: { ...unselectedCheckmarkItem, index: 0, sectionId: sectionTwoId },
        two: { ...unselectedCheckmarkItem, index: 1, sectionId: sectionTwoId }
      }
    };

    const result = updateSection(
      {} as TemplateModel,
      current,
      null,
      sectionTwoId
    );
    const resultItems = result.items || {};

    const actual = [resultItems.one, resultItems.two];
    expect(actual).toEqual(expected);
  });

  test('it should delete a removed unpublished section items', () => {
    const expected = [undefined, undefined];
    const sectionOneId = 'section-123';
    const sectionTwoId = 'section-456';
    const current = {
      ...deepClone(templateA),
      sections: {
        [sectionOneId]: { ...singleSection, index: 0 }
      }
    } as TemplateModel;
    const updates = {
      sections: {
        [sectionTwoId]: { ...singleSection, index: 1 }
      },
      items: {
        one: { ...unselectedCheckmarkItem, index: 0, sectionId: sectionTwoId },
        two: { ...unselectedCheckmarkItem, index: 1, sectionId: sectionTwoId }
      }
    } as TemplateModel;

    const result = updateSection(updates, current, null, sectionTwoId);
    const resultItems = result.items || {};

    const actual = [resultItems.one, resultItems.two];
    expect(actual).toEqual(expected);
  });

  test('it should remove a locally added section', () => {
    const sectionOneId = singleSection.id;
    const sectionTwoId = originalMultiSection.id;
    const sectionThreeId = addedMultiSection.id;
    const sections = {
      [sectionOneId]: { ...singleSection, index: 0 },
      [sectionThreeId]: { ...addedMultiSection, index: 1 }
    };

    const templateWithSection = {
      ...deepClone(templateA),
      sections
    };

    const current = templateWithSection;
    const updated = { sections: { [sectionTwoId]: originalMultiSection } };
    const result = updateSection(
      updated as TemplateModel,
      current,
      null,
      sectionTwoId
    );

    // check if removed section has been set to null
    const removedSectionValue = (result.sections || {})[sectionTwoId];
    expect(removedSectionValue).toBeUndefined();
  });
});
