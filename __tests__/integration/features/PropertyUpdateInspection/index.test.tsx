import sinon from 'sinon';
import {
  render as rtlRender,
  screen,
  waitFor,
  fireEvent,
  act
} from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import {
  fullInspection,
  unselectedCheckmarkItem,
  singleSection,
  unpublishedPhotoDataEntry,
  unselectedThumbsItem,
  inspectionB,
  originalMultiSection,
  emptyTextInputItem,
  unpublishedSignatureEntry,
  unselectedSignatureInputItem,
  unselectedCheckedExclaimItem,
  unselectedAbcItem,
  unselectedOneToFiveItem,
  unselectedOneActionNote
} from '../../../../__mocks__/inspections';
import stubIntersectionObserver from '../../../helpers/stubIntersectionObserver';
import PropertyUpdateInspection from '../../../../features/PropertyUpdateInspection';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import inspectionsApi from '../../../../common/services/api/inspections';
import propertyModel from '../../../../common/models/property';
import inspectionModel from '../../../../common/models/inspection';
import inspectionTemplateModel from '../../../../common/models/inspectionTemplate';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateUpdateModel from '../../../../common/models/inspections/templateUpdate';
import inspectionItemPhotosData from '../../../../common/services/indexedDB/inspectionItemPhotosData';
import inspectionTemplateUpdates from '../../../../common/services/indexedDB/inspectionTemplateUpdates';
import deepClone from '../../../helpers/deepClone';
import inspectionSignature from '../../../../common/services/indexedDB/inspectionSignature';

const FORCE_VISIBLE = true;

function render(ui: any, options: any = {}) {
  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

const incompleteInspection = deepClone(fullInspection) as inspectionModel;
incompleteInspection.template = {
  items: {
    [unselectedCheckmarkItem.id]: deepClone(
      unselectedCheckmarkItem
    ) as inspectionTemplateItemModel
  },
  sections: {
    [singleSection.id]: deepClone(
      singleSection
    ) as inspectionTemplateSectionModel
  }
} as inspectionTemplateModel;

describe('Integration | Features | Property Update Inspection', () => {
  beforeEach(() => stubIntersectionObserver());

  afterEach(() => sinon.restore());

  it('should publish a inspection item update', async () => {
    const expected = true;
    const onSave = sinon
      .stub(inspectionsApi, 'updateInspectionTemplate')
      .resolves(deepClone(incompleteInspection) as inspectionModel);
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection: deepClone(incompleteInspection) as inspectionModel,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    // Add satisfactory answer
    await act(async () => {
      const checkmarkButton = screen.getByTestId('control-checkmark');
      await userEvent.click(checkmarkButton);
      await wait(); // for state transitions
    });

    // Publish
    await act(async () => {
      const save = screen.getByTestId('header-save-button');
      await userEvent.click(save);
    });

    await waitFor(() => onSave.called);

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { items: {} };
    const actual = Boolean(payload.items || null);
    expect(actual).toEqual(expected);
  });

  it('should delete an unpublished inspection item photo when it is removed', async () => {
    const expected = true;
    const unpublishedPhotosData = [unpublishedPhotoDataEntry];
    const deletePhotoRequest = sinon
      .stub(inspectionItemPhotosData, 'deleteRecord')
      .returns({
        snapshot: { ref: 'test' },
        on(evt, onStart, onError, onComplete) {
          onComplete();
        }
      });

    // Setup inspection with single section/item
    const inspection = deepClone(incompleteInspection) as inspectionModel;
    inspection.template.sections = {
      [singleSection.id]: deepClone(singleSection)
    };
    inspection.template.items = {
      [unselectedCheckmarkItem.id]: deepClone(unselectedCheckmarkItem)
    };

    // Setup unpublished photo for inspection item
    const unpublishedPhoto = deepClone(unpublishedPhotosData);
    unpublishedPhoto.item = unselectedCheckmarkItem.id;
    unpublishedPhoto.inspection = inspection.id;

    // Return unpublished photo data for item
    sinon
      .stub(inspectionItemPhotosData, 'queryInspectionRecords')
      .resolves(unpublishedPhoto);

    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };

    render(<PropertyUpdateInspection {...props} />);

    // Open item photo modal
    act(() => {
      const attachmentButton = screen.queryByTestId('attachment-photo');
      userEvent.click(attachmentButton);
    });

    let photoModal = null;
    await waitFor(() => {
      photoModal = screen.queryByTestId('photos-modal');
      return Boolean(photoModal);
    });

    act(() => {
      const removeButton = screen.queryByTestId('photos-modal-photos-remove');
      userEvent.click(removeButton);
    });
    await waitFor(() => deletePhotoRequest.called);

    const actual = deletePhotoRequest.called;
    expect(actual).toEqual(expected);
  });

  it('should create local updates record when any item is updated', async () => {
    // Setup inspection with single section/item
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedThumbsItem.id]: deepClone(
          unselectedThumbsItem
        ) as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    await act(async () => {
      const checkmarkButton = screen.getByTestId('control-thumbs-up');
      userEvent.click(checkmarkButton);
      await wait(); // for state transitions
    });

    const localInspectionData = await inspectionTemplateUpdates.queryRecord({
      inspection: inspection.id
    });

    expect(localInspectionData.inspection).toBe(inspection.id);
  });

  it('should delete local updates record when all changes are reverted', async () => {
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedThumbsItem.id]: deepClone(
          unselectedThumbsItem
        ) as inspectionTemplateItemModel,
        [emptyTextInputItem.id]: {
          ...deepClone(emptyTextInputItem),
          sectionId: originalMultiSection.id
        } as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel,
        [originalMultiSection.id]: deepClone(
          originalMultiSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    // change main input selection
    act(() => {
      const thumbButton = screen.getByTestId('control-thumbs-up');
      userEvent.click(thumbButton);
    });

    // add multi-section section
    await act(async () => {
      const addSectionButton = screen.getByTestId(
        'section-list-item-add-section'
      );
      userEvent.click(addSectionButton);
      await wait(); // for state transitions
    });

    let localInspectionData = await inspectionTemplateUpdates.queryRecord({
      inspection: inspection.id
    });

    expect(localInspectionData.inspection).toBe(inspection.id);

    // revert changes in main input selection
    act(() => {
      const thumbButton = screen.getByTestId('control-thumbs-up');
      userEvent.click(thumbButton);
    });

    // remove previously added multi-section section
    await act(async () => {
      const removeSectionButton = screen.getByTestId(
        'section-list-item-remove-section'
      );
      userEvent.click(removeSectionButton);
      await wait(); // for state transitions
    });

    localInspectionData = await inspectionTemplateUpdates.queryRecord({
      inspection: inspection.id
    });

    expect(localInspectionData).toBeUndefined();
  });

  it('should allow publishing when only uploading a signature', async () => {
    // Return unpublished signature data for inspection
    sinon
      .stub(inspectionSignature, 'queryRecords')
      .resolves([unpublishedSignatureEntry]);

    // Setup inspection with single section/item
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedSignatureInputItem.id]: deepClone(
          unselectedSignatureInputItem
        ) as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    await act(async () => {
      await wait(); // wait for updates to render
    });

    const completeButton = screen.getByTestId('header-complete-button');
    expect(completeButton).not.toBeDisabled();
  });

  it('should allow publishing when only uploading a single item photo', async () => {
    // Setup inspection with single section/item
    const unpublishedPhotosData = [unpublishedPhotoDataEntry];
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedCheckmarkItem.id]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable

    // Setup unpublished photo for inspection item
    const unpublishedPhoto = deepClone(unpublishedPhotosData);
    unpublishedPhoto.item = unselectedCheckmarkItem.id;
    unpublishedPhoto.inspection = inspection.id;

    // Return unpublished item photos data for inspection
    sinon
      .stub(inspectionItemPhotosData, 'queryInspectionRecords')
      .resolves(unpublishedPhoto);

    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    await act(async () => {
      await wait(); // wait for updates to render
    });

    const saveButton = screen.getByTestId('header-save-button');
    expect(saveButton).not.toBeDisabled();
  });

  it('should show complete button if completely fill out a non-deficiency tracking inspection', async () => {
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedCheckmarkItem.id]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id;

    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    await act(async () => {
      const checkmarkCancelButton = screen.getByTestId('control-cancel');
      userEvent.click(checkmarkCancelButton);
      // wait for updates to render
      await wait();
    });

    const completeButton = screen.getByTestId('header-complete-button');
    expect(completeButton).toBeTruthy();
    expect(completeButton).not.toBeDisabled();
  });

  it('should show complete button when a tracked deficient item is completely filled out', async () => {
    // Setup inspection with single section/item
    const unpublishedPhotosData = [unpublishedPhotoDataEntry];
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedCheckmarkItem.id]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel
      },
      requireDeficientItemNoteAndPhoto: true // tracked
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable

    // Setup unpublished photo for inspection item
    const unpublishedPhoto = deepClone(unpublishedPhotosData);
    unpublishedPhoto.item = unselectedCheckmarkItem.id;
    unpublishedPhoto.inspection = inspection.id;

    // Add required photo to deficiency
    sinon
      .stub(inspectionItemPhotosData, 'queryInspectionRecords')
      .resolves(unpublishedPhoto);

    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    // Select deficient answer to item
    await act(async () => {
      const checkmarkCancelButton = screen.getByTestId('control-cancel');
      userEvent.click(checkmarkCancelButton);
      await wait(); // for state transitions
    });

    // Check we show save button while we are missing inspector notes
    const saveButton = screen.getByTestId('header-save-button');
    expect(
      saveButton,
      'save visible while inspection is not completable'
    ).toBeTruthy();

    act(() => {
      const attachmentNoteIcon = screen.getByTestId('attachment-note');
      userEvent.click(attachmentNoteIcon);
    });

    let notesModal = null;
    await waitFor(() => {
      notesModal = screen.queryByTestId('attachment-notes-modal');
      return Boolean(notesModal);
    });

    // Add required inspector note to deficient item
    await act(async () => {
      const attachmentNoteTextarea = screen.getByTestId(
        'attachmentNotesModal-textarea'
      );
      fireEvent.change(attachmentNoteTextarea, {
        target: { value: 'Notes Text' }
      });
      await wait(); // for state transitions
    });

    // it should show complete button now that
    // single deficient item has met all requirements
    const completeButton = screen.getByTestId('header-complete-button');
    expect(completeButton).toBeTruthy();
  });

  it('should show complete button when all items are completed', async () => {
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedThumbsItem.id]: deepClone(
          unselectedThumbsItem
        ) as inspectionTemplateItemModel,
        [emptyTextInputItem.id]: {
          ...deepClone(emptyTextInputItem),
          sectionId: originalMultiSection.id
        } as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel,
        [originalMultiSection.id]: deepClone(
          originalMultiSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    // Change main input selection (satisfactory answer)
    await act(async () => {
      const thumbButton = screen.getByTestId('control-thumbs-up');
      userEvent.click(thumbButton);
      await wait(); // for state transitions
    });

    // Add multi-section section
    await act(async () => {
      const addSectionButton = screen.getByTestId(
        'section-list-item-add-section'
      );
      userEvent.click(addSectionButton);
      await wait(); // for state transitions
    });

    // Remove previously added multi-section section
    await act(async () => {
      const removeSectionButton = screen.getByTestId(
        'section-list-item-remove-section'
      );
      userEvent.click(removeSectionButton);
      await wait(); // for state transitions
    });

    const saveButton = screen.getByTestId('header-save-button');
    expect(
      saveButton,
      'save visible while inspection is not completable'
    ).toBeTruthy();

    // Add satisfactory answer to text input
    await act(async () => {
      const textInput = screen.getByTestId('item-text-input');
      fireEvent.change(textInput, { target: { value: 'Text Input Note' } });
      await wait(); // for state transitions
    });

    const completeButton = screen.getByTestId('header-complete-button');
    expect(completeButton).toBeTruthy();
  });

  it('should delete local updates record when all changes are reverted for all items', async () => {
    const inspection = deepClone(inspectionB) as inspectionModel;
    inspection.template = {
      items: {
        [unselectedThumbsItem.id]: deepClone(
          unselectedThumbsItem
        ) as inspectionTemplateItemModel,
        [unselectedCheckmarkItem.id]: deepClone(
          unselectedCheckmarkItem
        ) as inspectionTemplateItemModel,
        [unselectedCheckedExclaimItem.id]: deepClone(
          unselectedCheckedExclaimItem
        ) as inspectionTemplateItemModel,
        [unselectedAbcItem.id]: deepClone(
          unselectedAbcItem
        ) as inspectionTemplateItemModel,
        [unselectedOneToFiveItem.id]: deepClone(
          unselectedOneToFiveItem
        ) as inspectionTemplateItemModel,
        [unselectedOneActionNote.id]: deepClone(
          unselectedOneActionNote
        ) as inspectionTemplateItemModel,
        [emptyTextInputItem.id]: {
          ...deepClone(emptyTextInputItem),
          sectionId: originalMultiSection.id
        } as inspectionTemplateItemModel
      },
      sections: {
        [singleSection.id]: deepClone(
          singleSection
        ) as inspectionTemplateSectionModel,
        [originalMultiSection.id]: deepClone(
          originalMultiSection
        ) as inspectionTemplateSectionModel
      }
    } as inspectionTemplateModel;

    inspection.inspector = user.id; // make editable
    const props = {
      isOnline: true,
      user,
      property: deepClone(fullProperty) as propertyModel,
      inspection,
      unpublishedTemplateUpdates: {} as inspectionTemplateUpdateModel,
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertyUpdateInspection {...props} />);

    const thumbButton = screen.getByTestId('control-thumbs-up');
    const checkmarkButton = screen.getByTestId('control-checkmark');
    const controlCheckmarkButton = screen.getByTestId('control-icon-checkmark');
    const controlIconA = screen.getByTestId('control-icon-a');
    const controlIcon4 = screen.getByTestId('control-icon-4');
    const oneActionsNotes = screen.getByTestId('one-action-notes');
    const textInput = screen.getByTestId('item-text-input');

    // change main input selection
    await act(async () => {
      userEvent.click(thumbButton);
      userEvent.click(checkmarkButton);
      userEvent.click(controlCheckmarkButton);
      userEvent.click(controlIconA);
      userEvent.click(controlIcon4);
      await wait(); // for state transitions
    });

    // Add satisfactory answer to text input
    await act(async () => {
      fireEvent.change(textInput, { target: { value: 'Text Input Note' } });
      await wait(); // for state transitions
    });

    // add multi-section section
    await act(async () => {
      const addSectionButton = screen.getByTestId(
        'section-list-item-add-section'
      );
      userEvent.click(addSectionButton);
      // open one action notes modal
      userEvent.click(oneActionsNotes);
      await wait(); // for state transitions
    });

    let oneActionsNotesModal = null;
    await waitFor(() => {
      oneActionsNotesModal = screen.queryByTestId('one-action-notes-modal');
      return Boolean(oneActionsNotesModal);
    });

    // Add Main Input Notes
    await act(async () => {
      const mainInputNotesTextarea = screen.getByTestId(
        'main-input-notes-textarea'
      );
      fireEvent.change(mainInputNotesTextarea, {
        target: { value: 'Main Input Notes' }
      });

      // close one action notes modal
      const oneActionsNotesModalClose = screen.getByTestId(
        'one-action-notes-modal-close'
      );
      userEvent.click(oneActionsNotesModalClose);
      await wait(); // for state transitions
    });

    let localInspectionData = await inspectionTemplateUpdates.queryRecord({
      inspection: inspection.id
    });

    // it should have unpublished inspection data saved in local DB
    expect(localInspectionData.inspection).toBe(inspection.id);

    // revert changes in main input selection
    await act(async () => {
      userEvent.click(controlIcon4);
      userEvent.click(controlIconA);
      userEvent.click(controlCheckmarkButton);
      userEvent.click(checkmarkButton);
      userEvent.click(thumbButton);
      await wait(); // for state transitions
    });

    // remove answer to text input
    await act(async () => {
      fireEvent.change(textInput, { target: { value: '' } });
      await wait(); // for state transitions
    });

    // remove previously added multi-section section
    await act(async () => {
      const removeSectionButton = screen.getByTestId(
        'section-list-item-remove-section'
      );
      userEvent.click(removeSectionButton);
      // open one action notes modal
      userEvent.click(oneActionsNotes);
      await wait(); // for state transitions
    });

    await waitFor(() => {
      oneActionsNotesModal = screen.queryByTestId('one-action-notes-modal');
      return Boolean(oneActionsNotesModal);
    });

    // Remove Main Input Notes
    await act(async () => {
      const mainInputNotesTextarea = screen.getByTestId(
        'main-input-notes-textarea'
      );
      fireEvent.change(mainInputNotesTextarea, {
        target: { value: '' }
      });
      // close one action notes modal
      const oneActionsNotesModalClose = screen.getByTestId(
        'one-action-notes-modal-close'
      );
      userEvent.click(oneActionsNotesModalClose);
      await wait(); // for state transitions
    });

    localInspectionData = await inspectionTemplateUpdates.queryRecord({
      inspection: inspection.id
    });

    expect(localInspectionData).toBeUndefined();
  });
});

// Promise for given timeout
function wait(timeout = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, timeout));
}
