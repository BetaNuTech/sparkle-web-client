import update, { userUpdate } from './updateTemplateItem';
import deepClone from '../../../__tests__/helpers/deepClone';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedCheckedExclaimItem,
  selectedCheckedExclaimItem
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
        expected: 0,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: 0 },
        msg: 'adds new selection index'
      },
      {
        expected: selectedCheckmarkItem.mainInputSelection === 0 ? 1 : 0,
        item: selectedCheckmarkItem,
        change: {
          mainInputSelection:
            selectedCheckmarkItem.mainInputSelection === 0 ? 1 : 0
        },
        msg: 'updates currently selected index'
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
      const { expected, item, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = {} as inspectionTemplateItemModel;
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
      const { expected, item, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = {} as inspectionTemplateItemModel;
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
