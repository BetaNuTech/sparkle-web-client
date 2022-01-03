import { filterCompletedItems } from './filterCompletedItems';
import {
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedCheckedExclaimItem,
  emptyTextInputItem,
  answeredTextInputItem,
  unselectedOneActionNote,
  unselectedSignatureInputItem,
  selectedThumbsItem,
  unpublishedSignatureEntry,
  unpublishedPhotoDataEntry
} from '../../../__mocks__/inspections';

describe('Unit | Common | Utils | Inspection | Filter Completed Items', () => {
  test('should filter all completed inspection items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [selectedCheckmarkItem, selectedCheckedExclaimItem, unselectedThumbsItem],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all non-applicable inspection items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 3;
    const filteredItems = filterCompletedItems(
      [
        { ...selectedCheckmarkItem, isItemNA: true },
        selectedCheckedExclaimItem,
        { ...unselectedThumbsItem, isItemNA: true }
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed text input items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 1;
    const filteredItems = filterCompletedItems(
      [emptyTextInputItem, answeredTextInputItem],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed main note input items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [
        unselectedOneActionNote,
        { ...unselectedOneActionNote, mainInputNotes: 'note 1' },
        { ...unselectedOneActionNote, mainInputNotes: 'note 2' }
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed signature input items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const signatureDownloadURL = 'https://dummyimage.com/600x400/000/fff';
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [
        unselectedSignatureInputItem,
        { ...unselectedSignatureInputItem, signatureDownloadURL },
        { ...unselectedSignatureInputItem, signatureDownloadURL }
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter and return all completed signature input items and it has unpublished signature', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    unpublishedInspectionItemsSignature.set(unselectedSignatureInputItem.id, [
      unpublishedSignatureEntry
    ]);
    const expected = 1;
    const filteredItems = filterCompletedItems(
      [unselectedSignatureInputItem],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should check for unpublished item photos and filter completed main input item', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    unpublishedInspectionItemsPhotos.set(selectedCheckedExclaimItem.id, [
      { ...unpublishedPhotoDataEntry, item: selectedCheckedExclaimItem.id }
    ]);
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [
        selectedCheckmarkItem,
        { ...selectedCheckedExclaimItem, inspectorNotes: 'Inspector notes' },
        unselectedThumbsItem
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos,
      true
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should not filter duplicate items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 1;
    const filteredItems = filterCompletedItems(
      [selectedCheckmarkItem, selectedCheckmarkItem],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all empty, "if yes" items, that come after deficient items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [
        selectedThumbsItem,
        { ...emptyTextInputItem, title: 'If yes, return' } // empty "if yes" item
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all empty, "if no" items, that come after sufficient items', () => {
    const unpublishedInspectionItemsSignature = new Map();
    const unpublishedInspectionItemsPhotos = new Map();
    const expected = 2;
    const filteredItems = filterCompletedItems(
      [
        selectedThumbsItem,
        { ...emptyTextInputItem, title: 'If no, return' } // empty "if yes" item
      ],
      unpublishedInspectionItemsSignature,
      unpublishedInspectionItemsPhotos
    );

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });
});
