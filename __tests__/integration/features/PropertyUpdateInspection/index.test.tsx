import sinon from 'sinon';
import {
  render as rtlRender,
  screen,
  waitFor,
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
  unpublishedPhotoDataEntry
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
import deepClone from '../../../helpers/deepClone';

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

    await act(async () => {
      const checkmarkButton = screen.getByTestId('control-checkmark');

      await userEvent.click(checkmarkButton);

      // need to wait for all state updates related to unpublished template updates
      await new Promise((r) => setTimeout(r, 100));
    });

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
});
