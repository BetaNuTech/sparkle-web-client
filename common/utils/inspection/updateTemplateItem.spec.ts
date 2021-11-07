import update, { userUpdate } from './updateTemplateItem';
import deepClone from '../../../__tests__/helpers/deepClone';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedCheckedExclaimItem,
  selectedCheckedExclaimItem,
  unselectedOneActionNote,
  emptyTextInputItem
} from '../../../__mocks__/inspections';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

describe('Unit | Common | Utils | Inspection | Update Template Item', () => {
  test('it does not modify arguments', () => {
    const actual = {} as inspectionTemplateItemModel;
    const expected = deepClone(actual);
    const currentItem = deepClone(
      selectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    const updatedSelection =
      selectedCheckmarkItem.mainInputSelection === 0 ? 1 : 0;
    const userChanges = { mainInputSelection: updatedSelection } as userUpdate;
    update(actual, currentItem, userChanges);
    expect(actual).toEqual(expected);
  });

  test('it toggles setting a main inspection item selection when changed', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: -1 },
        msg: 'ignores changing unset item to unselected'
      },
      {
        expected: 1,
        item: unselectedCheckmarkItem,
        previous: { mainInputSelection: 1 },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 0,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: 0 },
        msg: 'adds new selection index'
      },
      {
        expected: 1,
        item: { ...selectedCheckmarkItem, mainInputSelection: 0 },
        change: { mainInputSelection: 1 },
        msg: 'updates currently selected index'
      },
      {
        expected: 2,
        item: { ...selectedCheckedExclaimItem, mainInputSelection: 0 },
        previous: { mainInputSelection: 1 },
        change: { mainInputSelection: 2 },
        msg: 'updates over previously selected index'
      },
      {
        expected: -1,
        item: selectedCheckmarkItem,
        change: {
          mainInputSelection: selectedCheckmarkItem.mainInputSelection
        },
        msg: 'unselects item when changing item to current selection index'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.mainInputSelection : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an unselected selection when it is currently "undefined"', () => {
    const expected = -1;
    const currentItem = deepClone(
      unselectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    delete currentItem.mainInputSelection;
    const updatedItem = {} as inspectionTemplateItemModel;
    const userChanges = { isItemNA: true } as userUpdate;
    const result = update(updatedItem, currentItem, userChanges);
    const actual = result ? result.mainInputSelection : NaN;
    expect(actual).toEqual(expected);
  });

  test('it sets a text input items value', () => {
    const tests = [
      {
        expected: undefined,
        item: emptyTextInputItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: emptyTextInputItem,
        change: { textInputValue: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        item: emptyTextInputItem,
        previous: { textInputValue: 'test' },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        item: emptyTextInputItem,
        change: { textInputValue: 'test' },
        msg: 'adds new text input value to an empty item'
      },
      {
        expected: 'new',
        item: emptyTextInputItem,
        previous: { textInputValue: 'old' },
        change: { textInputValue: 'new' },
        msg: 'updates over previously updated text input value'
      },
      {
        expected: undefined,
        item: emptyTextInputItem,
        previous: { textInputValue: 'update' },
        change: { textInputValue: '' },
        msg: 'removes previously updated text input value back to empty original state'
      },
      {
        expected: undefined,
        item: { ...emptyTextInputItem, textInputValue: 'initial' },
        previous: { textInputValue: 'update' },
        change: { textInputValue: 'initial' },
        msg: 'removes previously updated text input value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.textInputValue : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets a one action note value', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedOneActionNote,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedOneActionNote,
        change: { mainInputNotes: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        item: unselectedOneActionNote,
        previous: { mainInputNotes: 'test' },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        item: unselectedOneActionNote,
        change: { mainInputNotes: 'test' },
        msg: 'adds new note value to an empty item'
      },
      {
        expected: 'new',
        item: unselectedOneActionNote,
        previous: { mainInputNotes: 'old' },
        change: { mainInputNotes: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated main note value'
      },
      {
        expected: undefined,
        item: unselectedOneActionNote,
        previous: { mainInputNotes: 'update' },
        change: { mainInputNotes: '' },
        msg: 'removes previously updated main note value back to empty original state'
      },
      {
        expected: undefined,
        item: { ...unselectedOneActionNote, mainInputNotes: 'initial' },
        previous: { mainInputNotes: 'update' },
        change: { mainInputNotes: 'initial' },
        msg: 'removes previously updated main note value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.mainInputNotes : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items inspection note value', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { inspectorNotes: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        item: unselectedCheckmarkItem,
        previous: { inspectorNotes: 'test' },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        item: unselectedCheckmarkItem,
        change: { inspectorNotes: 'test' },
        msg: 'adds new note value to an empty item'
      },
      {
        expected: 'new',
        item: unselectedCheckmarkItem,
        previous: { inspectorNotes: 'old' },
        change: { inspectorNotes: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated note value'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: { inspectorNotes: 'update' },
        change: { inspectorNotes: '' },
        msg: 'removes previously updated note value back to empty original state'
      },
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem, inspectorNotes: 'initial' },
        previous: { inspectorNotes: 'update' },
        change: { inspectorNotes: 'initial' },
        msg: 'removes previously updated note value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.inspectorNotes : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it toggles setting a main inspection item as selected when changed', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: -1 },
        msg: 'ignores changing unset item to unselected'
      },
      {
        expected: true,
        item: emptyTextInputItem,
        previous: { mainInputSelection: 1, mainInputSelected: true },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: undefined,
        item: selectedCheckmarkItem,
        change: {
          mainInputSelection:
            selectedCheckmarkItem.mainInputSelection === 0 ? 1 : 0
        },
        msg: 'ignores when changing previously selected item to new selection'
      },
      {
        expected: true,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: 0 },
        msg: 'set unselected item to selected'
      },
      {
        expected: false,
        item: selectedCheckmarkItem,
        change: { mainInputSelection: -1 },
        msg: 'set selected item to unselected'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, change, previous = {}, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.mainInputSelected : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it toggles setting a one action note as selected when changed', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedOneActionNote,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedOneActionNote,
        change: { mainInputNotes: '' },
        msg: 'ignores changing unset item to unselected'
      },
      {
        expected: true,
        item: unselectedOneActionNote,
        previous: { mainInputNotes: 'set', mainInputSelected: true },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: undefined,
        item: {
          ...unselectedOneActionNote,
          mainInputNotes: 'set',
          mainInputSelected: true
        },
        change: { mainInputNotes: 'reset' },
        msg: 'ignores when changing previously selected item to a new note value'
      },
      {
        expected: true,
        item: unselectedOneActionNote,
        change: { mainInputNotes: 'set' },
        msg: 'set unselected item to selected'
      },
      {
        expected: false,
        item: {
          ...unselectedOneActionNote,
          mainInputNotes: 'set',
          mainInputSelected: true
        },
        change: { mainInputNotes: '' },
        msg: 'set selected item to unselected'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, change, previous = {}, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.mainInputSelected : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it removes new item updates once they no longer differ from the current state', () => {
    const tests = [
      {
        expected: 2,
        change: { mainInputSelection: 0 },
        msg: 'keeps selection update from pristine state'
      },
      {
        expected: 2,
        change: { mainInputSelection: 1 },
        msg: 'keeps 2nd selection update from pristine state'
      },
      {
        expected: 2,
        change: { mainInputSelection: 2 },
        msg: 'keeps 3rd selection update from pristine state'
      },
      {
        expected: 0,
        change: { mainInputSelection: 2 }, // Toggle current selection = unselected
        msg: 'reverts a item to the pristine state when matching original/current state'
      }
    ];
    const currentItem = deepClone(
      unselectedCheckedExclaimItem
    ) as inspectionTemplateItemModel;
    let updatedItem = {} as inspectionTemplateItemModel;

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, change, msg } = tests[i];
      const userChanges = change as userUpdate;
      updatedItem = update(updatedItem, currentItem, userChanges);
      const actual = Object.keys(updatedItem || {}).length;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it removes previously updated item updates once they no longer differ from the current state', () => {
    const tests = [
      {
        expected: 1,
        change: { mainInputSelection: 1 },
        msg: 'keeps single selection update from pristine state'
      },
      {
        expected: 1,
        change: { mainInputSelection: 2 },
        msg: 'keeps new selection update from pristine state'
      },
      {
        expected: 0,
        change: { mainInputSelection: 0 },
        msg: 'reverts a item to the pristine state when matching original/current state'
      }
    ];
    const currentItem = deepClone(
      selectedCheckedExclaimItem
    ) as inspectionTemplateItemModel;
    currentItem.mainInputSelection = 0;
    let updatedItem = {} as inspectionTemplateItemModel;

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, change, msg } = tests[i];
      const userChanges = change as userUpdate;
      updatedItem = update(updatedItem, currentItem, userChanges);
      const actual = Object.keys(updatedItem || {}).length;
      expect(actual, msg).toEqual(expected);
    }
  });
});
