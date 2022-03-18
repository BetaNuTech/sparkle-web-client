import TemplateModel from '../../models/template';
import ItemModel from '../../models/inspectionTemplateItem';
import updateItem from './updateItem';
import { templateA } from '../../../__mocks__/templates';
import {
  unselectedCheckmarkItem,
  unselectedThumbsItem,
  unselectedCheckedExclaimItem,
  singleSection
} from '../../../__mocks__/inspections';
import inspectionConfig from '../../../config/inspections';

const INSPECTION_SCORES = inspectionConfig.inspectionScores;

describe('Unit | Common | Utils | Template | Update Item', () => {
  test('it adds new item with provided item type', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: { [itemId]: { ...unselectedCheckmarkItem, title: '' } }
    };
    const tests = [
      {
        expected: 'text_input',
        currentItem: templateWithItems,
        userChanges: { sectionId: '123abc', itemType: 'text_input' },
        targetId: 'new',
        msg: 'add a text input item '
      },
      {
        expected: 'main',
        currentItem: templateWithItems,
        userChanges: { sectionId: '123abc', itemType: 'main' },
        targetId: 'new',
        msg: 'add a main input item '
      },
      {
        expected: 'signature',
        currentItem: templateWithItems,
        userChanges: { sectionId: '123abc', itemType: 'signature' },
        targetId: 'new',
        msg: 'add a signature input item '
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, currentItem, userChanges, targetId, msg } = tests[i];
      const result = updateItem(
        {} as TemplateModel,
        currentItem,
        userChanges,
        targetId
      );

      const items = result.items || {};
      const item = items[Object.keys(items)[0]] || {};
      const actual = item;
      expect(actual.itemType, `${msg}: item type`).toEqual(expected);

      expect(actual.mainInputType, `${msg}: main input type`).toEqual(
        actual.itemType === 'main' ? 'twoactions_checkmarkx' : undefined
      );

      expect(actual.photos, `${msg}: photos value`).toEqual(
        actual.itemType === 'main' ? true : undefined
      );
      expect(actual.notes, `${msg}: notes value`).toEqual(
        actual.itemType === 'main' ? true : undefined
      );
      if (userChanges.itemType === 'main') {
        expect(
          typeof actual.mainInputZeroValue === 'number',
          `${msg}: set 0 value`
        ).toBeTruthy();
        expect(
          typeof actual.mainInputOneValue === 'number',
          `${msg}: set 1 value`
        ).toBeTruthy();
        expect(
          typeof actual.mainInputTwoValue === 'number',
          `${msg}: set 2 value`
        ).toBeTruthy();
        expect(
          typeof actual.mainInputThreeValue === 'number',
          `${msg}: set 3 value`
        ).toBeTruthy();
        expect(
          typeof actual.mainInputFourValue === 'number',
          `${msg}: set 4 value`
        ).toBeTruthy();
      }
    }
  });

  test('it adds first item within a section group at the first position', () => {
    const expected = 0;
    const sectionId = 'section-123';
    const currentTemplate = {
      ...templateA,
      sections: { [sectionId]: { ...singleSection } }
    };
    const result = updateItem(
      {} as TemplateModel,
      currentTemplate,
      { sectionId, itemType: 'main' },
      'new'
    );

    const [resultItem] = Object.entries(result.items || {})
      .filter(([id]) => id !== 'first')
      .map(([, item]) => item as ItemModel);
    const actual = resultItem.index;
    expect(actual).toEqual(expected);
  });

  test('it adds another new item at the last position of a section group', () => {
    const expected = 1; // Insert at 2nd position in section
    const sectionId = 'section-123';
    const currentTemplate = {
      ...templateA,
      sections: { [sectionId]: { ...singleSection } },
      items: { first: { ...unselectedCheckmarkItem, sectionId, index: 0 } }
    };
    const result = updateItem(
      {} as TemplateModel,
      currentTemplate,
      { sectionId, itemType: 'main' },
      'new'
    );

    const [resultItem] = Object.entries(result.items || {})
      .filter(([id]) => id !== 'first')
      .map(([, item]) => item as ItemModel);
    const actual = resultItem.index;
    expect(actual).toEqual(expected);
  });

  test('it sets an template item title', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: { [itemId]: { ...unselectedCheckmarkItem, title: '' } }
    };
    const tests = [
      {
        expected: undefined,
        currentItem: templateWithItems,
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: templateWithItems,
        userChanges: { title: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'new title',
        currentItem: templateWithItems,
        updatedItem: { items: { [itemId]: { title: 'new title' } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'new title',
        currentItem: templateWithItems,
        userChanges: { title: 'new title' },
        msg: 'adds item title to updates'
      },
      {
        expected: 'new title',
        currentItem: templateWithItems,
        updatedItem: { title: 'old name' },
        userChanges: { title: 'new title' }, // check whitespace padding removed
        msg: 'updates over previously updated title'
      },
      {
        expected: undefined,
        currentItem: templateWithItems,
        updatedItem: { title: 'old name' },
        userChanges: { title: '' },
        msg: 'removes previously updated title back to empty original state'
      },
      {
        expected: undefined,
        currentItem: {
          ...templateWithItems,
          ...{
            items: {
              ...templateWithItems.items,
              [itemId]: { title: 'initial' }
            }
          }
        },
        updatedItem: { items: { [itemId]: { title: 'update' } } },
        userChanges: { title: 'initial' },
        msg: 'removes previously updated title back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateItem(
        updatedItem as TemplateModel,
        currentItem,
        userChanges,
        itemId
      );
      const actual = result
        ? ((result.items || {})[itemId] || {}).title
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an template item score', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: { [itemId]: { ...unselectedCheckmarkItem, mainInputZeroValue: 0 } }
    };
    const tests = [
      {
        expected: undefined,
        valueKey: 'mainInputZeroValue',
        currentItem: templateWithItems,
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },

      {
        expected: 2,
        valueKey: 'mainInputZeroValue',
        currentItem: templateWithItems,
        updatedItem: { items: { [itemId]: { mainInputZeroValue: 2 } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 1,
        valueKey: 'mainInputZeroValue',
        currentItem: templateWithItems,
        userChanges: { mainInputZeroValue: 1 },
        msg: 'adds item mainInputZeroValue to updates'
      },
      {
        expected: 2,
        valueKey: 'mainInputOneValue',
        currentItem: templateWithItems,
        userChanges: { mainInputOneValue: 2 },
        msg: 'adds item mainInputOneValue to updates'
      },
      {
        expected: 3,
        valueKey: 'mainInputTwoValue',
        currentItem: templateWithItems,
        userChanges: { mainInputTwoValue: 3 },
        msg: 'adds item mainInputTwoValue to updates'
      },
      {
        expected: 4,
        valueKey: 'mainInputThreeValue',
        currentItem: templateWithItems,
        userChanges: { mainInputThreeValue: 4 },
        msg: 'adds item mainInputThreeValue to updates'
      },
      {
        expected: 5,
        valueKey: 'mainInputFourValue',
        currentItem: templateWithItems,
        userChanges: { mainInputFourValue: 5 },
        msg: 'adds item mainInputFourValue to updates'
      },
      {
        expected: 3,
        valueKey: 'mainInputOneValue',
        currentItem: templateWithItems,
        updatedItem: { mainInputOneValue: 2 },
        userChanges: { mainInputOneValue: 3 }, // check whitespace padding removed
        msg: 'updates over previously updated title'
      },
      {
        expected: undefined,
        valueKey: 'mainInputZeroValue',
        currentItem: templateWithItems,
        updatedItem: { mainInputZeroValue: 1 },
        userChanges: { mainInputZeroValue: 0 },
        msg: 'removes previously updated title back to empty original state'
      },
      {
        expected: undefined,
        currentItem: {
          ...templateWithItems,
          ...{
            items: {
              ...templateWithItems.items,
              [itemId]: { mainInputZeroValue: 1 }
            }
          }
        },
        updatedItem: { items: { [itemId]: { mainInputZeroValue: 2 } } },
        userChanges: { mainInputZeroValue: 1 },
        msg: 'removes previously updated title back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        valueKey,
        userChanges,
        msg
      } = tests[i];
      const result = updateItem(
        updatedItem as TemplateModel,
        currentItem,
        userChanges,
        itemId
      );
      const actual = result
        ? ((result.items || {})[itemId] || {})[valueKey]
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an template item photos value', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: { [itemId]: { ...unselectedCheckmarkItem, photos: false } }
    };
    const tests = [
      {
        expected: undefined,
        currentItem: templateWithItems,
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        updatedItem: { items: { [itemId]: { photos: true } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        userChanges: { photos: true },
        msg: 'adds item photos to updates'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        updatedItem: { photos: false },
        userChanges: { photos: true }, // check whitespace padding removed
        msg: 'updates over previously updated photos'
      },
      {
        expected: undefined,
        currentItem: templateWithItems,
        updatedItem: { photos: true },
        userChanges: { photos: false },
        msg: 'removes previously updated photos back to empty original state'
      },
      {
        expected: undefined,
        currentItem: {
          ...templateWithItems,
          ...{
            items: {
              ...templateWithItems.items,
              [itemId]: { photos: true }
            }
          }
        },
        updatedItem: { items: { [itemId]: { photos: false } } },
        userChanges: { photos: true },
        msg: 'removes previously updated photos back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateItem(
        updatedItem as TemplateModel,
        currentItem,
        userChanges,
        itemId
      );
      const actual = result
        ? ((result.items || {})[itemId] || {}).photos
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an template item notes value', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: { [itemId]: { ...unselectedCheckmarkItem, notes: false } }
    };
    const tests = [
      {
        expected: undefined,
        currentItem: templateWithItems,
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        updatedItem: { items: { [itemId]: { notes: true } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        userChanges: { notes: true },
        msg: 'adds item notes to updates'
      },
      {
        expected: true,
        currentItem: templateWithItems,
        updatedItem: { notes: false },
        userChanges: { notes: true }, // check whitespace padding removed
        msg: 'updates over previously updated notes'
      },
      {
        expected: undefined,
        currentItem: templateWithItems,
        updatedItem: { notes: true },
        userChanges: { notes: false },
        msg: 'removes previously updated notes back to empty original state'
      },
      {
        expected: undefined,
        currentItem: {
          ...templateWithItems,
          ...{
            items: {
              ...templateWithItems.items,
              [itemId]: { notes: true }
            }
          }
        },
        updatedItem: { items: { [itemId]: { notes: false } } },
        userChanges: { notes: true },
        msg: 'removes previously updated notes back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateItem(
        updatedItem as TemplateModel,
        currentItem,
        userChanges,
        itemId
      );
      const actual = result
        ? ((result.items || {})[itemId] || {}).notes
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it toggles an item primary type from main to text to signature', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: {
        [itemId]: { ...unselectedCheckmarkItem, title: '' }
      }
    };
    const tests = [
      {
        expected: undefined,
        currentItem: templateWithItems,
        userChanges: { index: 3 },
        msg: 'ignores unrelated update'
      },

      {
        expected: 'text_input',
        currentItem: templateWithItems,
        updatedItem: { items: { [itemId]: { itemType: 'text_input' } } },
        userChanges: { index: 3 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'signature',
        currentItem: templateWithItems,
        userChanges: { itemType: 'signature' },
        msg: 'adds item type to updates'
      },
      {
        expected: 'text_input',
        currentItem: templateWithItems,
        updatedItem: { itemType: 'signature' },
        userChanges: { itemType: 'text_input' }, // check whitespace padding removed
        msg: 'updates over previously updated item type'
      },

      {
        expected: undefined,
        currentItem: {
          ...templateWithItems,
          ...{
            items: {
              ...templateWithItems.items,
              [itemId]: { itemType: 'text_input' }
            }
          }
        },
        updatedItem: { items: { [itemId]: { title: 'signature' } } },
        userChanges: { itemType: 'text_input' },
        msg: 'removes previously updated item type back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateItem(
        updatedItem as TemplateModel,
        currentItem,
        userChanges,
        itemId
      );
      const actual = result
        ? ((result.items || {})[itemId] || {}).itemType
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it change main input type and update scores', () => {
    const itemId = unselectedCheckmarkItem.id;
    const templateWithItems = {
      ...templateA,
      items: {
        [itemId]: { ...unselectedCheckmarkItem, title: '' }
      }
    };
    const tests = [
      'twoactions_checkmarkx',
      'twoactions_thumbs',
      'threeactions_checkmarkexclamationx',
      'threeactions_abc',
      'fiveactions_onetofive',
      'oneaction_notes'
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const mainInputType = tests[i];
      const result = updateItem(
        {} as TemplateModel,
        templateWithItems,
        { mainInputType },
        itemId
      );
      const actual = result ? (result.items || {})[itemId] || {} : undefined;
      const scores = INSPECTION_SCORES[mainInputType];
      const expected = {
        mainInputZeroValue: scores[0],
        mainInputOneValue: scores[1],
        mainInputTwoValue: scores[2],
        mainInputThreeValue: scores[3],
        mainInputFourValue: scores[4]
      };

      expect(actual).toMatchObject(expected);
    }
  });

  test('it updates a item index', () => {
    const itemOneId = unselectedCheckmarkItem.id;
    const itemTwoId = unselectedThumbsItem.id;
    const itemThreeId = unselectedCheckedExclaimItem.id;
    const templateWithItems = {
      ...templateA,
      items: {
        [itemOneId]: { ...unselectedCheckmarkItem, index: 0 },
        [itemTwoId]: { ...unselectedThumbsItem, index: 1 },
        [itemThreeId]: { ...unselectedCheckedExclaimItem, index: 2 }
      }
    };

    const tests = [
      {
        expected: [undefined, undefined, undefined],
        current: templateWithItems,
        userChanges: { title: 'title' },
        msg: 'ignores unrelated update'
      },
      {
        expected: [undefined, 1, undefined],
        current: templateWithItems,
        updated: { items: { [itemTwoId]: { index: 1 } } },
        userChanges: { title: 'title' },
        msg: 'uses previous update when no user changes apply'
      },

      {
        expected: [1, 0, undefined],
        current: templateWithItems,
        userChanges: { index: 0 }, // Move to 1st
        msg: 'adds item index updates sorting down index'
      },
      {
        expected: [undefined, 2, 1],
        current: templateWithItems,
        userChanges: { index: 2 }, // Move to 3rd
        msg: 'adds item index updates sorting down index'
      },
      {
        expected: [undefined, undefined, undefined],
        current: templateWithItems,
        updated: {
          items: {
            [itemOneId]: { index: 1 },
            [itemTwoId]: { index: 0 } // Previous move to 1st
          }
        },
        userChanges: { index: 1 }, // Move back to 2nd
        msg: 'updates over previously updated index'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, current, updated = {}, userChanges, msg } = tests[i];
      const result = updateItem(
        updated as TemplateModel,
        current,
        userChanges,
        itemTwoId
      );

      // check current and other items indexes are updated as expected
      const expectedIndexOne = ((result.items || {})[itemOneId] || {}).index;
      const expectedIndexTwo = ((result.items || {})[itemTwoId] || {}).index;
      const expectedIndexThree = ((result.items || {})[itemThreeId] || {})
        .index;

      const actual = [expectedIndexOne, expectedIndexTwo, expectedIndexThree];
      expect(actual, msg).toEqual(expected);
    }
  });
});
