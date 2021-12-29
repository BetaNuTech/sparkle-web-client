import update from './index'; // using main update method
import deepClone from '../../../../__tests__/helpers/deepClone';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  emptyTextInputItem,
  unselectedOneActionNote,
  unselectedSignatureInputItem
} from '../../../../__mocks__/inspections';
import userUpdate from './userUpdate';
import adminEditModel from '../../../models/inspectionTemplateItemAdminEdit';
import inspectionTemplateItemModel from '../../../models/inspectionTemplateItem';
import inspectionTemplateItemPhotoDataModel from '../../../models/inspectionTemplateItemPhotoData';

const ADMIN_ID = '123';
const ADMIN_NAME = 'Admin Editor';

describe('Unit | Common | Utils | Inspection | Update Template Item | Admin Edits', () => {
  test('it sets an item inspection note admin edit entry', () => {
    const noteEntry = {
      action: 'updated creator notes',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

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
        msg: 'ignores changes that are not publishable'
      },
      {
        expected: { previous: noteEntry },
        item: unselectedCheckmarkItem,
        previous: {
          inspectorNotes: 'test',
          adminEdits: { previous: noteEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous entry when no user changes apply'
      },
      {
        expected: { new: noteEntry },
        item: unselectedCheckmarkItem,
        change: { inspectorNotes: 'test' },
        msg: 'adds new admin edit entry when changes are publishable'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: {
          inspectorNotes: 'update',
          adminEdits: { previous: noteEntry }
        },
        change: { inspectorNotes: '' },
        msg: 'removes previously added admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets a one action note item admin edit entry', () => {
    const oneActionNoteEntry = {
      action: 'updated main notes',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

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
        msg: 'ignores changes that are not publishable'
      },
      {
        expected: { previous: oneActionNoteEntry },
        item: unselectedOneActionNote,
        previous: {
          mainInputNotes: 'test',
          adminEdits: { previous: oneActionNoteEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous entry when no user changes apply'
      },
      {
        expected: { new: oneActionNoteEntry },
        item: unselectedOneActionNote,
        change: { mainInputNotes: 'test' },
        msg: 'adds new admin edit entry when changes are publishable'
      },
      {
        expected: undefined,
        item: unselectedOneActionNote,
        previous: { mainInputNotes: 'update' },
        change: { mainInputNotes: '' },
        msg: 'removes previously added admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets a signature admin edit entry', () => {
    const signatureEntry = {
      action: 'signature photo added with filename: file.png',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

    const tests = [
      {
        expected: undefined,
        item: unselectedSignatureInputItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: unselectedSignatureInputItem,
        change: { signatureDownloadURL: '' },
        msg: 'ignores changes that are not publishable'
      },
      {
        expected: { previous: signatureEntry },
        item: unselectedSignatureInputItem,
        previous: {
          mainInputNotes: 'test',
          adminEdits: { previous: signatureEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous entry when no user changes apply'
      },
      {
        expected: { new: signatureEntry },
        item: unselectedSignatureInputItem,
        change: { signatureDownloadURL: 'file.png' },
        msg: 'adds new admin edit entry when changes are publishable'
      },
      {
        expected: undefined,
        item: unselectedSignatureInputItem,
        previous: {
          signatureDownloadURL: 'file.png',
          signatureTimestampKey: '1',
          adminEdits: { previous: signatureEntry }
        },
        change: { signatureDownloadURL: '' },
        msg: 'removes previously added admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        newEntry.action = newEntry.action.replace(/\d+\.png$/, 'file.png'); // replace dynamic portion
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets a text input item admin edit entry', () => {
    const textInputEntry = {
      action: 'updated main text',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

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
        msg: 'ignores changes that are not publishable'
      },
      {
        expected: { previous: textInputEntry },
        item: emptyTextInputItem,
        previous: {
          textInputValue: 'test',
          adminEdits: { previous: textInputEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous entry when no user changes apply'
      },
      {
        expected: { new: textInputEntry },
        item: emptyTextInputItem,
        change: { textInputValue: 'test' },
        msg: 'adds new admin edit entry when changes are publishable'
      },
      {
        expected: undefined,
        item: emptyTextInputItem,
        previous: {
          textInputValue: 'update',
          adminEdits: { previous: textInputEntry }
        },
        change: { textInputValue: '' },
        msg: 'removes previously added admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets a main input item selection admin edit entry', () => {
    const selectedEntry = {
      action: 'selected checkmark',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;
    const unselectedEntry = {
      action: 'unselected main input',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

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
        msg: 'ignores changes that are not publishable'
      },
      {
        expected: { previous: selectedEntry },
        item: unselectedCheckmarkItem,
        previous: {
          mainInputSelection: 0,
          mainInputSelected: true,
          adminEdits: { previous: selectedEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous selected entry when no user changes apply'
      },
      {
        expected: { previous: unselectedEntry },
        item: selectedCheckmarkItem,
        previous: {
          mainInputSelection: -1,
          mainInputSelected: false,
          adminEdits: { previous: unselectedEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous unselected entry when no user changes apply'
      },
      {
        expected: { new: selectedEntry },
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: 0 },
        msg: 'adds new selected admin edit entry when selected changes are publishable'
      },
      {
        expected: { new: unselectedEntry },
        item: selectedCheckmarkItem,
        change: { mainInputSelection: -1 },
        msg: 'adds new unselected admin edit entry when unselected changes are publishable'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: {
          mainInputSelection: 0,
          mainInputSelected: true,
          adminEdits: { previous: selectedEntry }
        },
        change: { mainInputSelection: -1 },
        msg: 'removes previously added selected admin edit entry when change reverts back to unpublishable state'
      },
      {
        expected: undefined,
        item: selectedCheckmarkItem,
        previous: {
          mainInputSelection: -1,
          mainInputSelected: false,
          adminEdits: { previous: unselectedEntry }
        },
        change: {
          mainInputSelection: selectedCheckmarkItem.mainInputSelection
        },
        msg: 'removes previously added unselected admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an item applicable/inapplicable admin edit entry', () => {
    const applicableEntry = {
      action: 'added item back from being set NA',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;
    const inapplicableEntry = {
      action: 'set item to NA',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;

    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { mainInputSelection: -1 },
        msg: 'ignores unrelated/unpublishable update'
      },
      {
        expected: { previous: applicableEntry },
        item: { ...unselectedCheckmarkItem, isItemNA: true },
        previous: {
          isItemNA: false,
          adminEdits: { previous: applicableEntry }
        },
        change: { mainInputSelection: -1 },
        msg: 'uses previous applicable entry when no user changes apply'
      },
      {
        expected: { previous: inapplicableEntry },
        item: unselectedCheckmarkItem,
        previous: {
          isItemNA: true,
          adminEdits: { previous: inapplicableEntry }
        },
        change: { mainInputSelection: -1 },
        msg: 'uses previous inapplicable entry when no user changes apply'
      },
      {
        expected: { new: applicableEntry },
        item: { ...unselectedCheckmarkItem, isItemNA: true },
        change: { isItemNA: false },
        msg: 'adds new applicable admin edit entry when changes are publishable'
      },
      {
        expected: { new: inapplicableEntry },
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'adds new inapplicable admin edit entry when changes are publishable'
      },
      {
        expected: undefined,
        item: { ...unselectedCheckmarkItem, isItemNA: true },
        previous: {
          isItemNA: false,
          adminEdits: { previous: applicableEntry }
        },
        change: { isItemNA: true },
        msg: 'removes previously added applicable admin edit entry when change reverts back to unpublishable state'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: {
          isItemNA: true,
          adminEdits: { previous: inapplicableEntry }
        },
        change: { isItemNA: false },
        msg: 'removes previously added inapplicable admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an item photo data add/remove admin edit entry', () => {
    const addEntry = {
      action: 'added photo with filename: file.jpg, and caption: test',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;
    const removeEntry = {
      action: 'deleted photo with filename: file.jpg',
      admin_name: ADMIN_NAME,
      admin_uid: ADMIN_ID,
      edit_date: 1
    } as adminEditModel;
    const photoDataEntry = {
      downloadURL: 'app.com/file.jpg?ok=true',
      caption: 'test'
    } as inspectionTemplateItemPhotoDataModel;

    const tests = [
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        change: { isItemNA: true },
        msg: 'ignores unrelated update'
      },
      {
        expected: { previous: addEntry },
        item: unselectedCheckmarkItem,
        previous: {
          photosData: { new: photoDataEntry },
          adminEdits: { previous: addEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous add entry when no user changes apply'
      },
      {
        expected: { previous: removeEntry },
        item: {
          ...unselectedCheckmarkItem,
          photosData: { removed: photoDataEntry }
        },
        previous: {
          photosData: { removed: null },
          adminEdits: { previous: removeEntry }
        },
        change: { isItemNa: true },
        msg: 'uses previous remove entry when no user changes apply'
      },
      {
        expected: { new: addEntry },
        item: unselectedCheckmarkItem,
        change: { photosData: { file: photoDataEntry } },
        msg: 'adds new add admin edit entry when selected changes are publishable'
      },
      {
        expected: { new: removeEntry },
        item: {
          ...unselectedCheckmarkItem,
          photosData: { removed: photoDataEntry }
        },
        change: { photosData: { removed: null } },
        msg: 'adds new remove admin edit entry when selected changes are publishable'
      },
      {
        expected: undefined,
        item: unselectedCheckmarkItem,
        previous: {
          photosData: { file: photoDataEntry },
          adminEdits: { previous: addEntry }
        },
        change: { photosData: { file: null } },
        msg: 'removes previously added add-type admin edit entry when change reverts back to unpublishable state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = deepClone(item) as inspectionTemplateItemModel;
      const updatedItem = previous as inspectionTemplateItemModel;
      const userChanges = change as userUpdate;
      const result = update(updatedItem, currentItem, userChanges, {
        adminEdit: true,
        adminFullName: ADMIN_NAME,
        adminId: ADMIN_ID
      });
      const adminEdits = result ? result.adminEdits || {} : {};
      const previousEntry = adminEdits.previous || null;
      const [newEntry] = Object.entries(adminEdits)
        .filter(([id]) => id !== 'previous')
        .filter(([, { action }]) => action !== 'set item to NA')
        .map(([, entry]) => entry);

      let actual;
      if (previousEntry) {
        actual = actual || {};
        actual.previous = previousEntry;
      }

      if (newEntry) {
        actual = actual || {};
        newEntry.edit_date = 1;
        // replace dynamic portion
        newEntry.action = newEntry.action.replace(
          /(\d+\.jpg|removed\.jpg)/,
          'file.jpg'
        );
        actual.new = newEntry;
      }

      expect(actual, msg).toEqual(expected);
    }
  });
});
