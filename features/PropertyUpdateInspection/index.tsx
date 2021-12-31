import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import inspectionModel from '../../common/models/inspection';
import inspectionTemplateUpdateModel from '../../common/models/inspections/templateUpdate';
import userModel from '../../common/models/user';
import copyTextToClipboard from '../../common/utils/copyTextToClipboard';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import { filterCompletedItems } from '../../common/utils/inspection/filterCompletedItems';
import useInspectionSectionSort from './hooks/useInspectionSections';
import Sections from './Sections';
import useInspectionItems from './hooks/useInspectionItems';
import inspectionTemplateItemModel from '../../common/models/inspectionTemplateItem';
import useUpdateTemplate from './hooks/useUpdateTemplate';
import useUnpublishedTemplateUpdates from './hooks/useUnpublishedTemplateUpdates';
import useUnpublishInspectionItemPhotos from './hooks/useUnpublishedInspectionItemPhotos';
import useUnpublishedInspectionSignature from './hooks/useUnpublishedInspectionItemSignature';
import useInspectionUpload from './hooks/useInspectionUpload';
import OneActionNotesModal from './OneActionNotesModal';
import LoadingHud from '../../common/LoadingHud';
import MobileHeader from './MobileHeader';
import AttachmentNotesModal from './AttachmentNotesModal';
import SignatureInputModal from './SignatureInputModal';
import Header from './Header';
import {
  canEnableOverwriteMode,
  canEditInspection
} from '../../common/utils/userPermissions';
import PhotosModal from '../../common/InspectionItemPhotosModal';

interface Props {
  user: userModel;
  inspection: inspectionModel;
  unpublishedTemplateUpdates: inspectionTemplateUpdateModel;
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
}

const PropertyUpdateInspection: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  property,
  inspection,
  unpublishedTemplateUpdates,
  user,
  forceVisible
}) => {
  const {
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue,
    addSection,
    removeSection,
    setItemIsNA,
    updateInspectorNotes,
    enableAdminEditMode,
    disableAdminEditMode,
    isAdminEditModeEnabled,
    setItemSignatureDownloadURL
  } = useUpdateTemplate(unpublishedTemplateUpdates, inspection.template);

  // Disable admin edit mode when user
  // exits the update inspection page
  useEffect(() => () => disableAdminEditMode(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [
    isVisibleOneActionNotesModal,
    setIsVisibleOneActionNotesModal
  ] = useState(false);

  const [
    isVisibleAttachmentNotesModal,
    setIsVisibleAttachmentNotesModal
  ] = useState(false);

  const [
    isVisibleSignatureInputModal,
    setIsVisibleSignatureInputModal
  ] = useState(false);

  const [isVisiblePhotosModal, setIsVisiblePhotosModal] = useState(false);

  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);

  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());

  const {
    setLatestTemplateUpdates,
    clearUnpublishedTemplateUpdates,
    hasUpdates
  } = useUnpublishedTemplateUpdates(
    inspection.id,
    property.id,
    sendNotification,
    unpublishedTemplateUpdates
  );

  const {
    addUnpublishedInspectionItemPhotos,
    unpublishedInspectionItemsPhotos,
    unpublishedSelectedInspectionItemsPhotos,
    addUnpublishedInspectionPhotoCaption,
    removeUnpublishedInspectionItemPhoto
  } = useUnpublishInspectionItemPhotos(
    sendNotification,
    selectedInspectionItem,
    inspection.id
  );

  const {
    unpublishedInspectionItemsSignature,
    unpublishedSelectedInspectionItemsSignature,
    saveUnpublishedInspectionSignature,
    removeUnpublishedInspectionItemSignature
  } = useUnpublishedInspectionSignature(
    sendNotification,
    selectedInspectionItem,
    inspection.id
  );

  // Responsive queries
  const isTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.mobile.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const canEdit = canEditInspection(user, inspection, isAdminEditModeEnabled);

  // Permission is only relevant when user cannot edit an inspection
  const canEnableEditMode =
    canEnableOverwriteMode(user, inspection, isAdminEditModeEnabled) &&
    !canEdit;

  // User updates main item selection
  const onMainInputChange = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    selectionIndex: number
  ) => {
    setLatestTemplateUpdates(updateMainInputSelection(item.id, selectionIndex));
  };

  // User updates text item value
  const onTextInputValueChange = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    textInputValue: string
  ) => {
    setLatestTemplateUpdates(updateTextInputValue(item.id, textInputValue));
  };

  // Add inspector notes updates to
  // local, unpublised, changes
  const onInspectorNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLatestTemplateUpdates(
      updateInspectorNotes(selectedInspectionItem.id, event.target.value)
    );
  };

  const onAddSection = (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setLatestTemplateUpdates(addSection(sectionId));
  };

  const onRemoveSection = (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setLatestTemplateUpdates(removeSection(sectionId));
  };

  // Add main and text input updates
  // to local, unpublished, changes
  const onInputChange = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: any
  ) => {
    if (item.itemType === 'text_input') {
      onTextInputValueChange(event, item, value);
    } else {
      onMainInputChange(event, item, value);
    }
  };

  const onItemIsNAChange = (itemId: string, itemIsNA: boolean) => {
    setLatestTemplateUpdates(setItemIsNA(itemId, itemIsNA));
  };

  // Add main input note updates to
  // local, unpublised, changes
  const onOneActionNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLatestTemplateUpdates(
      updateMainInputNotes(selectedInspectionItem.id, event.target.value)
    );
  };

  const onEnableAdminEditMode = () => {
    enableAdminEditMode(user);
  };

  // Add signature updates to
  // local, unpublised, changes
  const changeItemsSignature = async (
    itemId: string,
    signatureDownloadURL: string
  ): Promise<inspectionTemplateUpdateModel> => {
    return await setLatestTemplateUpdates(
      setItemSignatureDownloadURL(itemId, signatureDownloadURL)
    );
  };

  // hook for inspectionUpload
  const { onInspectionUpload, isLoading: isPublishing } = useInspectionUpload(
    inspection.id,
    sendNotification,
    changeItemsSignature,
    removeUnpublishedInspectionItemSignature
  );

  // Publish local changes and on success
  // clear all local changes
  const onSaveInspection = async () => {
    await onInspectionUpload(
      unpublishedInspectionItemsSignature,
      unpublishedTemplateUpdates
    );
    clearUnpublishedTemplateUpdates();
  };

  const {
    sortedTemplateSections,
    collapsedSections,
    onSectionCollapseToggle
  } = useInspectionSectionSort(
    inspection.template.sections,
    unpublishedTemplateUpdates
  );

  // Items grouped by their section
  const { sectionItems, inspectionItems } = useInspectionItems(
    unpublishedTemplateUpdates,
    inspection.template
  );

  const onShareAction = () => {
    copyTextToClipboard(window.location.href);
    sendNotification('Copied to clipboard.', { type: 'success' });
  };

  // Opens OneActionsNotes modal and
  // sets selected inspection
  const onClickOneActionNotes = (item: inspectionTemplateItemModel) => {
    setIsVisibleOneActionNotesModal(true);
    setSelectedInspectionItem(item);
  };

  // Opens Attachment notes modal and
  // sets selected inspection
  const onClickAttachmentNotes = (item: inspectionTemplateItemModel) => {
    setIsVisibleAttachmentNotesModal(true);
    setSelectedInspectionItem(item);
  };

  // Closes OneActionsNotes modal and
  // removes value for selected inspection item
  const closeOneActionNotesModal = () => {
    setIsVisibleOneActionNotesModal(false);
    setSelectedInspectionItem(null);
  };

  // Closes Attachment Notes modal and
  // removes value for selected inspection item
  const closeAttachmentNotesModal = () => {
    setIsVisibleAttachmentNotesModal(false);
    setSelectedInspectionItem(null);
  };

  // Opens signature Input modal and
  // sets selected inspection
  const onClickSignatureInput = (item: inspectionTemplateItemModel) => {
    setIsVisibleSignatureInputModal(true);
    setSelectedInspectionItem(item);
  };

  // Closes signature input modal and
  // removes value for selected inspection item
  const closeSignatureInputModal = () => {
    setIsVisibleSignatureInputModal(false);
    setSelectedInspectionItem(null);
  };

  // Opens photos modal and
  // sets selected inspection
  const onClickPhotos = (item: inspectionTemplateItemModel) => {
    setIsVisiblePhotosModal(true);
    setSelectedInspectionItem(item);
  };

  // Closes photos modal and
  // removes value for selected inspection item
  const closePhotosModal = () => {
    setIsVisiblePhotosModal(false);
    setSelectedInspectionItem(null);
  };

  // User updates an item's
  // unpublished photo data
  const onChangeItemsUnpublishedPhotos = async (files: Array<string>) => {
    addUnpublishedInspectionItemPhotos(files, selectedInspectionItem.id);
  };

  const saveSignature = async (signatureData: string, itemId: string) => {
    saveUnpublishedInspectionSignature(signatureData, itemId);
    closeSignatureInputModal();
  };

  const onRemoveItemsUnpublishedPhoto = (unpublishedPhotoId: string) => {
    removeUnpublishedInspectionItemPhoto(unpublishedPhotoId);
  };

  // Determine if inspection could be completed
  // when user requests to publish their updates
  const canUpdatesCompleteInspection = useMemo(() => {
    const completedItemsLength = (
      filterCompletedItems(
        inspectionItems,
        inspection.template.requireDeficientItemNoteAndPhoto
      ) || []
    ).length;
    return completedItemsLength === inspectionItems.length;
  }, [inspectionItems]);

  if (isPublishing) {
    return <LoadingHud title="Saving Inspection" />;
  }

  const hasUnpublishedUpdates =
    hasUpdates || unpublishedInspectionItemsSignature.size > 0;
  return (
    <>
      {isTablet || isMobile ? (
        <MobileHeader
          property={property}
          inspection={inspection}
          isOnline={isOnline}
          hasUpdates={hasUnpublishedUpdates}
          onShareAction={onShareAction}
          onSaveInspection={onSaveInspection}
          canEnableEditMode={canEnableEditMode}
          onEnableAdminEditMode={onEnableAdminEditMode}
          isStaging={isStaging}
          canUpdateCompleteInspection={canUpdatesCompleteInspection}
        />
      ) : (
        <Header
          property={property}
          inspection={inspection}
          isOnline={isOnline}
          hasUpdates={hasUnpublishedUpdates}
          onShareAction={onShareAction}
          onSaveInspection={onSaveInspection}
          canEnableEditMode={canEnableEditMode}
          onEnableAdminEditMode={onEnableAdminEditMode}
          canUpdateCompleteInspection={canUpdatesCompleteInspection}
        />
      )}

      <Sections
        sections={sortedTemplateSections}
        collapsedSections={collapsedSections}
        onSectionCollapseToggle={onSectionCollapseToggle}
        onInputChange={onInputChange}
        sectionItems={sectionItems}
        onClickOneActionNotes={onClickOneActionNotes}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        onItemIsNAChange={onItemIsNAChange}
        onClickAttachmentNotes={onClickAttachmentNotes}
        onClickSignatureInput={onClickSignatureInput}
        onClickPhotos={onClickPhotos}
        forceVisible={forceVisible}
        inspectionItemsPhotos={unpublishedInspectionItemsPhotos}
        inspectionItemsSignature={unpublishedInspectionItemsSignature}
        canEdit={canEdit}
        isMobile={isMobile}
      />

      <OneActionNotesModal
        isVisible={isVisibleOneActionNotesModal}
        onClose={closeOneActionNotesModal}
        onChange={onOneActionNotesChange}
        selectedInspectionItem={selectedInspectionItem}
        canEdit={canEdit}
      />

      <AttachmentNotesModal
        isVisible={isVisibleAttachmentNotesModal}
        onClose={closeAttachmentNotesModal}
        onChange={onInspectorNotesChange}
        selectedInspectionItem={selectedInspectionItem}
        propertyId={property.id}
        inspectionId={inspection.id}
        isMobile={isMobile}
        canEdit={canEdit}
      />
      <SignatureInputModal
        isVisible={isVisibleSignatureInputModal}
        onClose={closeSignatureInputModal}
        selectedInspectionItem={selectedInspectionItem}
        inspectionItemsSignature={unpublishedSelectedInspectionItemsSignature}
        saveSignature={saveSignature}
      />
      <PhotosModal
        photosData={selectedInspectionItem?.photosData}
        unpublishedPhotosData={unpublishedSelectedInspectionItemsPhotos}
        isVisible={isVisiblePhotosModal}
        onClose={closePhotosModal}
        title={selectedInspectionItem?.title}
        onChangeFiles={onChangeItemsUnpublishedPhotos}
        onAddCaption={addUnpublishedInspectionPhotoCaption}
        onRemovePhoto={onRemoveItemsUnpublishedPhoto}
        sendNotification={sendNotification}
        disabled={!canEdit}
      />
    </>
  );
};

export default PropertyUpdateInspection;
