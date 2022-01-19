import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import inspectionModel from '../../common/models/inspection';
import userModel from '../../common/models/user';
import copyTextToClipboard from '../../common/utils/copyTextToClipboard';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import { filterCompletedItems } from '../../common/utils/inspection/filterCompletedItems';
import useInspectionSectionSort from './hooks/useInspectionSections';
import Sections from './Sections';
import useInspectionItems from './hooks/useInspectionItems';
import inspectionTemplateItemModel from '../../common/models/inspectionTemplateItem';
import unpublishedTemplateUpdatesModel from '../../common/models/inspections/unpublishedTemplateUpdate';
import useUpdateTemplate from './hooks/useUpdateTemplate';
import useUnpublishInspectionItemPhotos from './hooks/useUnpublishedInspectionItemPhotos';
import useUnpublishedInspectionSignature from './hooks/useUnpublishedInspectionItemSignature';
import usePdfReport from './hooks/usePdfReport';
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
  unpublishedTemplateUpdates: unpublishedTemplateUpdatesModel;
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  isIncompleteRevealed: boolean;
}

const PropertyUpdateInspection: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  property,
  inspection,
  unpublishedTemplateUpdates,
  user,
  forceVisible,
  isIncompleteRevealed
}) => {
  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());

  const {
    isPublishing,
    isAdminEditModeEnabled,
    hasUpdates,
    updates,
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue,
    addSection,
    removeSection,
    setItemIsNA,
    updateInspectorNotes,
    enableAdminEditMode,
    disableAdminEditMode,
    destroyUpdates,
    publish,
    publishProgress
  } = useUpdateTemplate(
    property.id,
    inspection.id,
    unpublishedTemplateUpdates,
    inspection.template,
    sendNotification
  );

  // Disable admin edit mode when user
  // exits the update inspection page
  useEffect(() => () => disableAdminEditMode(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isVisibleOneActionNotesModal, setIsVisibleOneActionNotesModal] =
    useState(false);

  const [isVisibleAttachmentNotesModal, setIsVisibleAttachmentNotesModal] =
    useState(false);

  const [isVisibleSignatureInputModal, setIsVisibleSignatureInputModal] =
    useState(false);

  const [isVisiblePhotosModal, setIsVisiblePhotosModal] = useState(false);

  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);

  const {
    addUnpublishedInspectionItemPhoto,
    unpublishedInspectionItemsPhotos,
    unpublishedSelectedInspectionItemsPhotos,
    addUnpublishedInspectionPhotoCaption,
    removeUnpublishedInspectionItemPhoto,
    reloadPhotos
  } = useUnpublishInspectionItemPhotos(
    sendNotification,
    selectedInspectionItem,
    inspection.id
  );

  const {
    unpublishedInspectionItemsSignature,
    unpublishedSelectedInspectionItemsSignature,
    saveUnpublishedInspectionSignature,
    reloadSignatures
  } = useUnpublishedInspectionSignature(
    sendNotification,
    selectedInspectionItem,
    inspection.id
  );

  const {
    generatePdfReport,
    isPdfReportStatusShowing,
    isPdfReportOutOfDate,
    isPdfReportGenerating,
    isPdfReportQueued,
    showRestartAction,
    hasPdfReportGenerationFailed,
    isRequestingReport
  } = usePdfReport(inspection, sendNotification, isOnline, hasUpdates);

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
    updateMainInputSelection(item.id, selectionIndex);
  };

  // User updates text item value
  const onTextInputChange = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    textInputValue: string
  ) => {
    updateTextInputValue(item.id, textInputValue);
  };

  // Add inspector notes updates to
  // local, unpublised, changes
  const onInspectorNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateInspectorNotes(selectedInspectionItem.id, event.target.value);
  };

  const onAddSection = (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    addSection(sectionId);
  };

  const onRemoveSection = (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    removeSection(sectionId);
  };

  const onItemIsNAChange = (itemId: string, itemIsNA: boolean) => {
    setItemIsNA(itemId, itemIsNA);
  };

  // Add main input note updates to
  // local, unpublised, changes
  const onOneActionNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateMainInputNotes(selectedInspectionItem.id, event.target.value);
  };

  const onEnableAdminEditMode = () => {
    enableAdminEditMode(user);
  };

  // Publish local changes and on success
  // clear all local changes
  const onSaveInspection = async () => {
    try {
      await publish(
        unpublishedInspectionItemsSignature,
        unpublishedInspectionItemsPhotos
      );
      destroyUpdates();
    } catch (err) {}

    reloadSignatures();
    reloadPhotos();
  };

  const { sortedTemplateSections, collapsedSections, onSectionCollapseToggle } =
    useInspectionSectionSort(inspection.template.sections, updates);

  // Items grouped by their section
  const { sectionItems, inspectionItems, inspectionItemDeficientIds } =
    useInspectionItems(
      updates,
      inspection.template,
      Boolean(inspection.template.requireDeficientItemNoteAndPhoto)
    );

  const onShareAction = () => {
    copyTextToClipboard(window.location.href);
    sendNotification('Inspection URL copied to clipboard.', { type: 'info' });
  };

  const onCopyReportURL = () => {
    copyTextToClipboard(inspection.inspectionReportURL);
    sendNotification('Inspection Report URL copied to clipboard.', {
      type: 'info'
    });
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
  const onChangeItemsUnpublishedPhotos = async (file: any) => {
    return addUnpublishedInspectionItemPhoto(
      file.dataUri,
      file.size,
      selectedInspectionItem.id,
      property.id
    );
  };

  const saveSignature = async (
    signatureData: string,
    size: number,
    itemId: string
  ) => {
    saveUnpublishedInspectionSignature(
      signatureData,
      size,
      itemId,
      property.id
    );
  };

  const onRemoveItemsUnpublishedPhoto = (unpublishedPhotoId: string) => {
    removeUnpublishedInspectionItemPhoto(unpublishedPhotoId);
  };

  // Determine if inspection could be completed
  // when user requests to publish their updates
  const { canUpdatesCompleteInspection, completedItems } = useMemo(() => {
    const completedItems =
      filterCompletedItems(
        inspectionItems,
        unpublishedInspectionItemsSignature,
        unpublishedInspectionItemsPhotos,
        inspection.template.requireDeficientItemNoteAndPhoto
      ) || [];
    return {
      canUpdatesCompleteInspection:
        completedItems.length === inspectionItems.length,
      completedItems
    };
  }, [inspectionItems]);

  //Calculate percentage of completed item vs total inspection items
  const inspCompletionPercentage = useMemo(
    () =>
      Math.round((completedItems.length / inspectionItems.length) * 100) || 0,
    [completedItems, inspectionItems]
  );

  // Check if inspection has any unpublished updates
  // or unpublished signatures
  // or unpublished item photos
  const hasUnpublishedUpdates =
    hasUpdates ||
    unpublishedInspectionItemsSignature.size > 0 ||
    unpublishedInspectionItemsPhotos.size > 0;

  if (isPublishing) {
    return (
      <LoadingHud
        title="Saving Inspection"
        hasProgress={true}
        progressValue={publishProgress}
      />
    );
  }

  return (
    <>
      {isTablet || isMobile ? (
        <>
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
            isPdfReportGenerating={isPdfReportGenerating}
            isPdfReportQueued={isPdfReportQueued}
          />
        </>
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
          onCopyReportURL={onCopyReportURL}
          isPdfReportStatusShowing={isPdfReportStatusShowing}
          isPdfReportOutOfDate={isPdfReportOutOfDate}
          isPdfReportGenerating={isPdfReportGenerating}
          isPdfReportQueued={isPdfReportQueued}
          showRestartAction={showRestartAction}
          hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
          onRegenerateReport={generatePdfReport}
          isRequestingReport={isRequestingReport}
        />
      )}

      <Sections
        sections={sortedTemplateSections}
        collapsedSections={collapsedSections}
        onSectionCollapseToggle={onSectionCollapseToggle}
        onMainInputChange={onMainInputChange}
        onTextInputChange={onTextInputChange}
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
        isIncompleteRevealed={isIncompleteRevealed}
        completedItems={completedItems}
        inspectionItemDeficientIds={inspectionItemDeficientIds}
        requireDeficientItemNoteAndPhoto={
          inspection.template.requireDeficientItemNoteAndPhoto
        }
        showAction={isDesktop}
        inspCompletionPercentage={inspCompletionPercentage}
        onSaveInspection={onSaveInspection}
        canEnableEditMode={canEnableEditMode}
        onEnableAdminEditMode={onEnableAdminEditMode}
        canUpdateCompleteInspection={canUpdatesCompleteInspection}
        isOnline={isOnline}
        hasUpdates={hasUnpublishedUpdates}
        onCopyReportURL={onCopyReportURL}
        isPdfReportStatusShowing={isPdfReportStatusShowing}
        isPdfReportOutOfDate={isPdfReportOutOfDate}
        isPdfReportGenerating={isPdfReportGenerating}
        isPdfReportQueued={isPdfReportQueued}
        showRestartAction={showRestartAction}
        hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
        onRegenerateReport={generatePdfReport}
        inspectionReportURL={inspection.inspectionReportURL}
        isRequestingReport={isRequestingReport}
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
        subTitle={selectedInspectionItem?.title}
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
