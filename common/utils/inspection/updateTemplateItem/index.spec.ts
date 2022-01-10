import update from './index';
import userUpdate from './userUpdate';
import deepClone from '../../../../__tests__/helpers/deepClone';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedCheckedExclaimItem,
  selectedCheckedExclaimItem,
  unselectedOneActionNote,
  unselectedSignatureInputItem,
  emptyTextInputItem
} from '../../../../__mocks__/inspections';
import inspectionTemplateItemModel from '../../../models/inspectionTemplateItem';
import inspectionTemplateItemPhotoDataModel from '../../../models/inspectionTemplateItemPhotoData';

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
        item: { ...unselectedOneActionNote },
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: { ...unselectedOneActionNote, mainInputNotes: '' },
        change: { mainInputNotes: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        item: { ...unselectedOneActionNote },
        previous: { mainInputNotes: 'test' },
        change: { isItemNa: true },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        item: { ...unselectedOneActionNote, mainInputNotes: '' },
        change: { mainInputNotes: 'test' },
        msg: 'adds new note value to an empty item'
      },
      {
        expected: 'new',
        item: { ...unselectedOneActionNote },
        previous: { mainInputNotes: 'old', mainInputSelected: true },
        change: { mainInputNotes: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated main note value'
      },
      {
        expected: undefined,
        item: { ...unselectedOneActionNote, mainInputNotes: '' },
        previous: { mainInputNotes: 'update', mainInputSelected: true },
        change: { mainInputNotes: '' },
        msg: 'removes previously updated main note value back to empty original state'
      },
      {
        expected: undefined,
        item: { ...unselectedOneActionNote, mainInputNotes: 'initial' },
        previous: { mainInputNotes: 'update', mainInputSelected: true },
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

  test('it sets an items to applicable and not-applicable', () => {
    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: 1 },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem, isItemNA: false },
        change: { isItemNA: false },
        msg: 'ignores changing an applicable item to applicable'
      },
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem, isItemNA: true },
        change: { isItemNA: true },
        msg: 'ignores changing an inapplicable item to inapplicable'
      },
      {
        expected: true,
        item: unselectedCheckmarkItem,
        previous: { isItemNA: true },
        change: { mainInputSelection: 1 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'sets an applicable item to inapplicable'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: { isItemNA: true },
        change: { isItemNA: false },
        msg: 'updates over previously updated item applicability'
      },
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem, isItemNA: true },
        previous: { isItemNA: false },
        change: { isItemNA: true },
        msg: 'removes previously updated item applicability back to original state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.isItemNA : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it adds and removes signature updates', () => {
    const tests = [
      {
        expected: {
          signatureDownloadURL: undefined,
          signatureTimestampKey: undefined
        },
        item: { ...unselectedSignatureInputItem },
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: {
          signatureDownloadURL: undefined,
          signatureTimestampKey: undefined
        },
        item: {
          ...unselectedSignatureInputItem,
          signatureDownloadURL: 'test.jpg'
        },
        change: { signatureDownloadURL: 'test.jpg' },
        msg: 'ignores updating a signature to its remote state'
      },
      {
        expected: {
          signatureDownloadURL: 'test.jpg',
          signatureTimestampKey: '123'
        },
        item: { ...unselectedSignatureInputItem },
        previous: {
          signatureDownloadURL: 'test.jpg',
          signatureTimestampKey: '123'
        },
        change: { isItemNA: 1 },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: {
          signatureDownloadURL: 'test.jpg',
          signatureTimestampKey: true
        },
        item: { ...unselectedSignatureInputItem },
        change: { signatureDownloadURL: 'test.jpg' },
        msg: 'sets a new signature and timestamp key'
      },
      {
        expected: {
          signatureDownloadURL: 'test-2.jpg',
          signatureTimestampKey: true
        },
        item: {
          ...unselectedSignatureInputItem,
          signatureDownloadURL: 'test.jpg',
          signatureTimestampKey: '123'
        },
        change: { signatureDownloadURL: 'test-2.jpg' },
        msg: 'replaces a remote published signature'
      },
      {
        expected: {
          signatureDownloadURL: 'test-2.jpg',
          signatureTimestampKey: true
        },
        item: { ...unselectedSignatureInputItem },
        previous: {
          signatureDownloadURL: 'test.jpg',
          signatureTimestampKey: '123'
        },
        change: { signatureDownloadURL: 'test-2.jpg' },
        msg: 'replaces a locally added signature'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = {
        signatureDownloadURL: result ? result.signatureDownloadURL : undefined,
        signatureTimestampKey: result ? result.signatureTimestampKey : undefined
      };
      // replace true timestamp with generated value
      if (expected.signatureTimestampKey === true) {
        expected.signatureTimestampKey = `${
          actual.signatureTimestampKey || ''
        }`;
      }
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it adds a photo to an items photo data', () => {
    const imgOnlyAdd = {
      downloadURL: 'url.com/img.jpg'
    } as inspectionTemplateItemPhotoDataModel;
    const imgCaptionAdd = {
      downloadURL: 'app.com/img.jpg',
      caption: 'test'
    } as inspectionTemplateItemPhotoDataModel;

    const tests = [
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem },
        change: { mainInputSelection: 1 },
        msg: 'ignores unrelated update'
      },
      {
        expected: { '1': imgOnlyAdd },
        item: { ...unselectedCheckmarkItem },
        change: { photosData: { 1: imgOnlyAdd } },
        msg: 'add a new photo data image update'
      },
      {
        expected: { '1': imgCaptionAdd },
        item: { ...unselectedCheckmarkItem },
        change: { photosData: { 1: imgCaptionAdd } },
        msg: 'add a new photo data image/caption update'
      },
      {
        expected: { '1': imgOnlyAdd, '2': imgCaptionAdd },
        previous: { photosData: { '1': imgOnlyAdd } },
        item: { ...unselectedCheckmarkItem },
        change: { photosData: { '2': imgCaptionAdd } },
        msg: 'appends new photo updates to existing ones'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result.photosData || undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it removes a photo from an items photo data', () => {
    const photoDataItem = {
      downloadURL: 'url.com/img.jpg'
    } as inspectionTemplateItemPhotoDataModel;
    const photoDataItem2 = {
      downloadURL: 'url.com/img-two.jpg'
    } as inspectionTemplateItemPhotoDataModel;

    const tests = [
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem },
        change: { mainInputSelection: 1 },
        msg: 'ignores unrelated update'
      },
      {
        expected: { '1': null },
        item: {
          ...unselectedCheckmarkItem,
          photosData: { '1': photoDataItem }
        },
        change: { photosData: { '1': null } },
        msg: 'creates a publishable removal of a published photo data image'
      },
      {
        expected: { '1': photoDataItem },
        previous: { photosData: { '1': photoDataItem, '2': photoDataItem2 } },
        item: { ...unselectedCheckmarkItem },
        change: { photosData: { '2': null } },
        msg: 'deletes local only photo data add'
      },
      {
        expected: undefined,
        previous: { photosData: { '2': photoDataItem2 } },
        item: {
          ...unselectedCheckmarkItem,
          photosData: { '1': photoDataItem }
        },
        change: { photosData: { '2': null } },
        msg: 'deletes all local only photo data when none present'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result ? result.photosData : undefined;
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

  test('it updates a local multi-section item without modifying other attributes', () => {
    const imgAdd = {
      downloadURL: 'url.com/img.jpg'
    } as inspectionTemplateItemPhotoDataModel;
    const tests = [
      {
        expected: {
          ...unselectedCheckmarkItem,
          mainInputSelection: 0,
          mainInputSelected: true
        },
        previous: {
          ...unselectedCheckmarkItem
        },
        change: {
          mainInputSelection: 0
        },
        msg: 'update item selection'
      },
      {
        expected: {
          ...emptyTextInputItem,
          textInputValue: 'update'
        },
        previous: {
          ...emptyTextInputItem
        },
        change: {
          textInputValue: 'update'
        },
        msg: 'update text input value'
      },
      {
        expected: {
          ...unselectedOneActionNote,
          mainInputNotes: 'update',
          mainInputSelected: true
        },
        previous: {
          ...unselectedOneActionNote
        },
        change: {
          mainInputNotes: 'update'
        },
        msg: 'update one action note value'
      },
      {
        expected: {
          ...unselectedCheckmarkItem,
          inspectorNotes: 'update'
        },
        previous: {
          ...unselectedCheckmarkItem
        },
        change: {
          inspectorNotes: 'update'
        },
        msg: 'update inspector note'
      },
      {
        expected: {
          ...unselectedCheckmarkItem,
          isItemNA: true
        },
        previous: {
          ...unselectedCheckmarkItem
        },
        change: {
          isItemNA: true
        },
        msg: 'update item applicability'
      },
      {
        expected: {
          ...unselectedSignatureInputItem,
          signatureDownloadURL: 'test.jpg'
        },
        previous: {
          ...unselectedSignatureInputItem
        },
        change: {
          signatureDownloadURL: 'test.jpg'
        },
        msg: 'update signature item'
      },
      {
        expected: {
          ...unselectedCheckmarkItem,
          photosData: { '2': imgAdd }
        },
        previous: {
          ...unselectedCheckmarkItem
        },
        change: { photosData: { '2': imgAdd } },
        msg: 'update add photo item'
      },
      {
        expected: {
          ...unselectedCheckmarkItem
        },
        previous: {
          ...unselectedCheckmarkItem,
          photosData: { '2': imgAdd }
        },
        change: { photosData: { '2': null } },
        msg: 'update remove photo item'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, previous = {}, change, msg } = tests[i];
      const updatedItem = previous as inspectionTemplateItemModel;
      const currentItem = updatedItem;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges);
      const actual = result || null;

      // Update dynamic portion of signature item
      if (actual.signatureTimestampKey) {
        expected.signatureTimestampKey = actual.signatureTimestampKey;
      }

      expect(actual, msg).toEqual(expected);
    }
  });
});
