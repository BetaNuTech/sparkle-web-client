import copy from './copySectionsItems';
import deepClone from '../../../__tests__/helpers/deepClone';
import {
  selectedCheckmarkItem,
  unselectedCheckmarkItem,
  emptyTextInputItem,
  answeredTextInputItem,
  unselectedOneActionNote,
  unselectedSignatureInputItem
} from '../../../__mocks__/inspections';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateItemPhotoDataModel from '../../models/inspectionTemplateItemPhotoData';

describe('Unit | Common | Utils | Inspection | Copy Section Item', () => {
  test('it should create a new items instance, not modifying arguments', () => {
    const original = { a: unselectedCheckmarkItem };
    const originalCopy = deepClone(original);
    const items = copy(original, {}, '1', '2');

    expect(items !== original, 'returned new object').toEqual(true);
    expect(original, 'did not modifiy arguments').toEqual(originalCopy);
  });

  test('it should only clone items from source section', () => {
    const expected = 1;
    const sourceSectionId = 'test-2-source';
    const clonedItem = deepClone(selectedCheckmarkItem);
    const itemOne = { ...clonedItem, sectionId: sourceSectionId };
    const itemTwo = { ...clonedItem, sectionId: 'not-source' };
    const items = {
      one: itemOne as inspectionTemplateItemModel,
      two: itemTwo as inspectionTemplateItemModel
    };

    const actual = getHashEntities(
      copy(items, {}, sourceSectionId, 'test-2-target')
    ).length;

    expect(actual).toEqual(expected);
  });

  test('it should point all items to target section', () => {
    const expected = 'test-3-target';
    const sourceSectionId = 'test-3-source';
    const clonedItem = deepClone(selectedCheckmarkItem);
    const itemOne = { ...clonedItem, sectionId: sourceSectionId };
    const items = { one: itemOne as inspectionTemplateItemModel };

    const actual = copy(items, {}, sourceSectionId, expected).one.sectionId;
    expect(actual).toEqual(expected);
  });

  test('it clones items from unpublished updates when items do not exist in current template', () => {
    const expected = 'test-3-target';
    const sourceSectionId = 'test-3-source';
    const clonedItem = deepClone(selectedCheckmarkItem);
    const itemOne = { ...clonedItem, sectionId: sourceSectionId };
    const items = { one: itemOne as inspectionTemplateItemModel };

    const actual = copy({}, items, sourceSectionId, expected).one.sectionId;
    expect(actual).toEqual(expected);
  });

  test('it should reset all items from source to their default', () => {
    const sourceSectionId = 'test-4-source';
    const clonedComplete = JSON.parse(
      JSON.stringify(selectedCheckmarkItem)
    ) as inspectionTemplateItemModel;
    const clonedIncomplete = JSON.parse(
      JSON.stringify(unselectedCheckmarkItem)
    ) as inspectionTemplateItemModel;
    const cloneEmptyText = JSON.parse(
      JSON.stringify(emptyTextInputItem)
    ) as inspectionTemplateItemModel;
    const cloneAnsweredText = JSON.parse(
      JSON.stringify(answeredTextInputItem)
    ) as inspectionTemplateItemModel;
    const cloneOneAnswerNote = JSON.parse(
      JSON.stringify(unselectedOneActionNote)
    ) as inspectionTemplateItemModel;
    const cloneSignature = JSON.parse(
      JSON.stringify(unselectedSignatureInputItem)
    ) as inspectionTemplateItemModel;

    const mainDeficientIncompleteItemPhoto = {
      ...clonedComplete,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true,
      inspectorNotes: 'notes',
      photosData: { a: {} as inspectionTemplateItemPhotoDataModel }
    } as inspectionTemplateItemModel;
    const mainDeficientIncompleteNotedPhotoItem = {
      ...clonedIncomplete,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true,
      inspectorNotes: 'notes',
      photosData: { a: {} as inspectionTemplateItemPhotoDataModel }
    } as inspectionTemplateItemModel;
    const textInputIncompleteDeficientNa = {
      ...cloneEmptyText,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true
    } as inspectionTemplateItemModel;
    const textInputCompleteDeficientNa = {
      ...cloneAnsweredText,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true
    } as inspectionTemplateItemModel;
    const unansweredOneActionNote = {
      ...cloneOneAnswerNote,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true,
      inspectorNotes: 'notes',
      photosData: { a: {} as inspectionTemplateItemPhotoDataModel }
    } as inspectionTemplateItemModel;
    const answeredOneActionNote = {
      ...cloneOneAnswerNote,
      mainInputNotes: 'note',
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true,
      inspectorNotes: 'notes',
      photosData: { a: {} as inspectionTemplateItemPhotoDataModel }
    } as inspectionTemplateItemModel;
    const answeredSignatureItem = {
      ...cloneSignature,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true,
      signatureDownloadURL: '/url',
      signatureTimestampKey: '1536244137184'
    } as inspectionTemplateItemModel;
    const unansweredSignatureItem = {
      ...cloneSignature,
      sectionId: sourceSectionId,
      adminEdits: {},
      deficient: true,
      isItemNA: true
    } as inspectionTemplateItemModel;

    const tests = [
      // MamainDeficientItemin input items
      mainDeficientIncompleteItemPhoto,
      mainDeficientIncompleteNotedPhotoItem,

      // Text input items
      textInputIncompleteDeficientNa,
      textInputCompleteDeficientNa,

      // Note input items
      answeredOneActionNote,
      unansweredOneActionNote,

      // Signature input items
      answeredSignatureItem,
      unansweredSignatureItem
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const actual = copy(
        { one: tests[i] },
        {},
        sourceSectionId,
        'test-4-target'
      ).one;
      expect(
        actual.adminEdits,
        `reset admin edits at test ${i}, got: ${actual.adminEdits}`
      ).toEqual(undefined);
      expect(
        actual.deficient,
        `reset deficient at test ${i}, got: ${actual.deficient}`
      ).toEqual(false);
      expect(
        actual.isItemNA,
        `reset is item NA at test ${i}, got: ${actual.isItemNA}`
      ).toEqual(false);

      if (actual.notes) {
        expect(
          actual.inspectorNotes,
          `reset is inspector notes at test ${i}, got: ${actual.inspectorNotes}`
        ).toEqual('');
      }

      if (actual.photos) {
        expect(
          actual.photosData,
          `reset photos data at test ${i}, got: ${actual.photosData}`
        ).toEqual(undefined);
      }

      // Main Inputs test
      if (
        actual.itemType === 'main' &&
        `${actual.mainInputType}`.toLowerCase() !== 'oneaction_notes'
      ) {
        expect(
          actual.mainInputSelection,
          `removed main input selection at test ${i}, got: ${actual.mainInputSelection}`
        ).toEqual(-1);
        expect(
          actual.mainInputSelected,
          `reset main input selected at test ${i}, got: ${actual.mainInputSelected}`
        ).toEqual(false);
      }

      // Text Inputs test
      if (actual.itemType === 'text_input') {
        expect(
          actual.textInputValue,
          `reset text input value at test ${i}, got: ${actual.textInputValue}`
        ).toEqual('');
      }

      // Note Item test
      if (
        actual.itemType === 'main' &&
        `${actual.mainInputType}`.toLowerCase() === 'oneaction_notes'
      ) {
        expect(
          actual.mainInputNotes,
          `removed note input value at test ${i}, got: ${actual.mainInputNotes}`
        ).toEqual('');
      }

      // Signature Inputs test
      if (actual.itemType === 'signature') {
        expect(
          actual.signatureDownloadURL,
          `reset signature input download url at test ${i}, got: ${actual.signatureDownloadURL}`
        ).toEqual('');
        expect(
          actual.signatureTimestampKey,
          `reset signature input timestamp at test ${i}, got: ${actual.signatureTimestampKey}`
        ).toEqual('');
      }
    }
  });
});

function getHashEntities(hash) {
  return Object.keys(hash).map((id) => hash[id]);
}
