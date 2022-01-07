import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import deepClone from '../../../__tests__/helpers/deepClone';
import useUpdateTemplate from './useUpdateTemplate';
import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import unpublishedTemplateUpdatesModel from '../../../common/models/inspections/unpublishedTemplateUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';
import storageApi from '../../../common/services/storage';
import inspectionsApi from '../../../common/services/api/inspections';
import errorReports from '../../../common/services/api/errorReports';
import { admin } from '../../../__mocks__/users';
import currentUser from '../../../common/utils/currentUser';
import {
  unselectedCheckmarkItem,
  emptyTextInputItem,
  originalMultiSection,
  addedMultiSecton,
  unpublishedSignatureEntry,
  unpublishedPhotoDataEntry
} from '../../../__mocks__/inspections';

const PROPERTY_ID = '125';
const INSPECTION_ID = '456';
const ITEM_ID = unselectedCheckmarkItem.id;
const SECTION_ID = originalMultiSection.id;
const CURRENT_TEMPLATE = Object.freeze({
  sections: {
    [SECTION_ID]: { ...originalMultiSection } as inspectionTemplateSectionModel
  },
  items: {
    [ITEM_ID]: {
      ...unselectedCheckmarkItem,
      sectionId: SECTION_ID
    } as inspectionTemplateItemModel
  }
}) as inspectionTemplateUpdateModel;
const EMPTY_PREVIOUS_UPDATES = {} as unpublishedTemplateUpdatesModel;

describe('Unit | Features | Property Update Inspection | Hooks | Use Update Template', () => {
  afterEach(() => sinon.restore());

  test('should determine if template has unpublished prior local updates', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const previousUpdates = {
      id: 'afb1',
      property: PROPERTY_ID,
      inspection: INSPECTION_ID,
      template: {
        items: {
          [ITEM_ID]: {
            mainInputSelection: 0,
            mainInputSelected: true
          } as inspectionTemplateItemModel
        }
      } as inspectionTemplateModel
    } as unpublishedTemplateUpdatesModel;

    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        previousUpdates,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    const actual = result.current.hasUpdates;
    expect(actual).toEqual(expected);
  });

  test('should update main input item selection', async () => {
    const expected = {
      hasUpdates: true,
      mainInputSelection: 1
    };

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.updateMainInputSelection(
        ITEM_ID,
        expected.mainInputSelection
      );
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      mainInputSelection: ((updates.items || {})[ITEM_ID] || {})
        .mainInputSelection
    };

    expect(actual).toEqual(expected);
  });

  test('should update text input value', async () => {
    const expected = {
      hasUpdates: true,
      textInputValue: 'hey hey hey'
    };
    const itemId = emptyTextInputItem.id;
    const currentTemplate = {
      items: {
        [itemId]: deepClone(emptyTextInputItem) as inspectionTemplateItemModel
      }
    } as inspectionTemplateUpdateModel;

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        currentTemplate,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.updateTextInputValue(itemId, expected.textInputValue);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      textInputValue: ((updates.items || {})[itemId] || {}).textInputValue
    };

    expect(actual).toEqual(expected);
  });

  test('should update main input note value', async () => {
    const expected = {
      hasUpdates: true,
      mainInputNotes: 'note note note'
    };

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.updateMainInputNotes(ITEM_ID, expected.mainInputNotes);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      mainInputNotes: ((updates.items || {})[ITEM_ID] || {}).mainInputNotes
    };

    expect(actual).toEqual(expected);
  });

  test('should update inspector notes', async () => {
    const expected = {
      hasUpdates: true,
      inspectorNotes: 'inspect this note'
    };

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.updateInspectorNotes(ITEM_ID, expected.inspectorNotes);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      inspectorNotes: ((updates.items || {})[ITEM_ID] || {}).inspectorNotes
    };

    expect(actual).toEqual(expected);
  });

  test('should set an item to not applicable', async () => {
    const expected = {
      hasUpdates: true,
      isItemNA: true
    };

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.setItemIsNA(ITEM_ID, expected.isItemNA);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      isItemNA: ((updates.items || {})[ITEM_ID] || {}).isItemNA
    };

    expect(actual).toEqual(expected);
  });

  test('should add section by cloning another section', async () => {
    const expected = {
      hasUpdates: true,
      sectionTitle: originalMultiSection.title,
      sectionType: originalMultiSection.section_type,
      sectionAdded: true
    };

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.addSection(SECTION_ID);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const sections = updates.sections || {};
    const [newSectionId] = Object.keys(sections).filter(
      (id) => id !== SECTION_ID
    );
    const newSection = sections[newSectionId] || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      sectionTitle: newSection.title,
      sectionType: newSection.section_type,
      sectionAdded: newSection.added_multi_section
    };

    expect(actual).toEqual(expected);
  });

  test('should remove section from the template', async () => {
    const expected = {
      hasUpdates: true,
      addedSection: null,
      hasAddedSectionItem: false
    };
    const addedSectionId = addedMultiSecton.id;
    const addedSectionItem = 'item-abc-123';
    const currentTemplate = Object.freeze({
      sections: {
        [SECTION_ID]: {
          ...originalMultiSection
        } as inspectionTemplateSectionModel,
        [addedSectionId]: {
          ...addedMultiSecton
        } as inspectionTemplateSectionModel
      },
      items: {
        [ITEM_ID]: {
          ...unselectedCheckmarkItem,
          sectionId: SECTION_ID
        } as inspectionTemplateItemModel,
        [addedSectionItem]: {
          ...unselectedCheckmarkItem,
          sectionId: addedSectionId
        } as inspectionTemplateItemModel
      }
    }) as inspectionTemplateUpdateModel;

    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        currentTemplate,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    await act(async () => {
      result.current.removeSection(addedSectionId);
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const sections = updates.sections || {};
    const items = updates.items || {};
    const actual = {
      hasUpdates: result.current.hasUpdates,
      addedSection: sections[addedSectionId],
      hasAddedSectionItem: Boolean(items[addedSectionItem])
    };

    expect(actual).toEqual(expected);
  });

  test('should enable admin edit mode', () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    act(() => {
      result.current.enableAdminEditMode(admin);
    });

    const actual = result.current.isAdminEditModeEnabled;
    expect(actual).toEqual(expected);
  });

  test('should disable admin edit mode', () => {
    const expected = false;
    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );
    act(() => {
      result.current.enableAdminEditMode(admin);
    });
    act(() => {
      result.current.disableAdminEditMode();
    });

    const actual = result.current.isAdminEditModeEnabled;
    expect(actual).toEqual(expected);
  });

  test('should update inspector notes with admin edit if admin edit mode enabled', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const { result } = renderHook(() =>
      useUpdateTemplate(
        PROPERTY_ID,
        INSPECTION_ID,
        EMPTY_PREVIOUS_UPDATES,
        CURRENT_TEMPLATE,
        sendNotification
      )
    );

    // Stub requests
    const upsertRecord = sinon
      .stub(inspectionTemplateUpdates, 'upsertRecord')
      .resolves({});

    act(() => {
      result.current.enableAdminEditMode(admin);
    });

    await act(async () => {
      result.current.updateInspectorNotes(ITEM_ID, 'new note');
      await waitFor(() => upsertRecord.called);
    });

    const updates = result.current.updates || {};
    const actual = Boolean(((updates.items || {})[ITEM_ID] || {}).adminEdits);
    expect(actual).toEqual(expected);
  });

  test('should request to upload signature file and publish inspection', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const signatureUploadData = new Map();
    signatureUploadData.set(unpublishedSignatureEntry.item, [
      unpublishedSignatureEntry
    ]);

    // Creates spy for method in storageApi
    const createBase64UploadTask = sinon.stub(
      storageApi,
      'createBase64UploadTask'
    );
    sinon.stub(errorReports, 'send').resolves(true);

    const updatedInspectionFn = sinon
      .stub(inspectionsApi, 'updateInspectionTemplate')
      .resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateTemplate(
          PROPERTY_ID,
          unpublishedSignatureEntry.inspection,
          EMPTY_PREVIOUS_UPDATES,
          CURRENT_TEMPLATE,
          sendNotification
        )
      );
      await result.current.publish(signatureUploadData, new Map());
    });
    await waitFor(() => createBase64UploadTask.called);

    const actual = createBase64UploadTask.called;
    expect(actual).toEqual(expected);

    // requested file string check
    const uploadResult = createBase64UploadTask.firstCall || { args: [] };
    const requestedFileString = uploadResult.args[1];

    expect(requestedFileString).toEqual(unpublishedSignatureEntry.signature);
    expect(updatedInspectionFn.called).toBeTruthy();
  });

  test('should request to upload photos and publish inspection', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const photoUploadData = new Map();
    photoUploadData.set(unpublishedPhotoDataEntry.item, [
      unpublishedPhotoDataEntry
    ]);

    // Creates spy for method in inspectionsApi
    const uploadPhoto = sinon
      .stub(inspectionsApi, 'uploadPhotoData')
      .resolves(true);

    sinon.stub(errorReports, 'send').resolves(true);

    // Creates spy for method in inspectionsApi to update inspection template
    const updatedInspectionFn = sinon
      .stub(inspectionsApi, 'updateInspectionTemplate')
      .resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useUpdateTemplate(
          PROPERTY_ID,
          unpublishedPhotoDataEntry.inspection,
          EMPTY_PREVIOUS_UPDATES,
          CURRENT_TEMPLATE,
          sendNotification
        )
      );
      await result.current.publish(new Map(), photoUploadData);
    });

    await waitFor(() => uploadPhoto.called);

    const actual = uploadPhoto.called;
    expect(actual).toEqual(expected);
    expect(updatedInspectionFn.called).toBeTruthy();
  });
});
