import { filterCompletedItems } from './filterCompletedItems';
import {
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedCheckedExclaimItem,
  emptyTextInputItem,
  answeredTextInputItem,
  unselectedOneActionNote,
  unselectedSignatureInputItem,
  selectedThumbsItem
} from '../../../__mocks__/inspections';

describe('Unit | Common | Utils | Inspection | Filter Completed Items', () => {
  test('should filter all completed inspection items', () => {
    const expected = 2;
    const filteredItems = filterCompletedItems([
      selectedCheckmarkItem,
      selectedCheckedExclaimItem,
      unselectedThumbsItem
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all non-applicable inspection items', () => {
    const expected = 3;
    const filteredItems = filterCompletedItems([
      { ...selectedCheckmarkItem, isItemNA: true },
      selectedCheckedExclaimItem,
      { ...unselectedThumbsItem, isItemNA: true }
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed text input items', () => {
    const expected = 1;
    const filteredItems = filterCompletedItems([
      emptyTextInputItem,
      answeredTextInputItem
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed main note input items', () => {
    const expected = 2;
    const filteredItems = filterCompletedItems([
      unselectedOneActionNote,
      { ...unselectedOneActionNote, mainInputNotes: 'note 1' },
      { ...unselectedOneActionNote, mainInputNotes: 'note 2' }
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all completed signature input items', () => {
    const signatureDownloadURL = 'https://dummyimage.com/600x400/000/fff';
    const expected = 2;
    const filteredItems = filterCompletedItems([
      unselectedSignatureInputItem,
      { ...unselectedSignatureInputItem, signatureDownloadURL },
      { ...unselectedSignatureInputItem, signatureDownloadURL }
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should not filter duplicate items', () => {
    const expected = 1;
    const filteredItems = filterCompletedItems([
      selectedCheckmarkItem,
      selectedCheckmarkItem
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all empty, "if yes" items, that come after deficient items', () => {
    const expected = 2;
    const filteredItems = filterCompletedItems([
      selectedThumbsItem,
      { ...emptyTextInputItem, title: 'If yes, return' } // empty "if yes" item
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });

  test('should filter all empty, "if no" items, that come after sufficient items', () => {
    const expected = 2;
    const filteredItems = filterCompletedItems([
      selectedThumbsItem,
      { ...emptyTextInputItem, title: 'If no, return' } // empty "if yes" item
    ]);

    const actual = filteredItems.length;
    expect(actual).toEqual(expected);
  });
});
