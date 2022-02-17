import { ChangeEvent, FunctionComponent, useState } from 'react';
import firebase from 'firebase/app';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import PhotosModal from '../../common/PhotosModal';
import PropertyTrelloIntegrationModel from '../../common/models/propertyTrelloIntegration';
import HistoryModal from './HistoryModal';
import dateUtil from '../../common/utils/date';
import Header from './Header';
import useTrelloCard from './hooks/useTrelloCard';
import useUpdateItem from './hooks/useUpdateItem';
import useUnpublishedDeficiencyPhotos from './hooks/useUnpublishedDeficiencyPhotos';
import DeficientItemLocalUpdates from '../../common/models/deficientItems/unpublishedUpdates';
import LoadingHud from '../../common/LoadingHud';
import Form from './Form';

type userNotifications = (message: string, options?: any) => any;
interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: DeficientItemModel;
  propertyIntegration: PropertyTrelloIntegrationModel;
  isOnline?: boolean;
  isStaging?: boolean;
  sendNotification: userNotifications;
  unpublishedUpdates: DeficientItemLocalUpdates;
  firestore: firebase.firestore.Firestore;
}

const DeficientItemEdit: FunctionComponent<Props> = ({
  user,
  property,
  deficientItem,
  propertyIntegration,
  isOnline,
  isStaging,
  sendNotification,
  unpublishedUpdates,
  firestore
}) => {
  const [isVisiblePhotosModal, setIsVisiblePhotosModal] = useState(false);

  const [historyType, setHistoryType] = useState(null);
  const [isVisibleCompletedPhotosModal, setIsVisibleCompletedPhotosModal] =
    useState(false);

  const { onCreateTrelloCard, isLoading: isCreatingTrelloCard } = useTrelloCard(
    sendNotification,
    deficientItem.id
  );

  const {
    updates,
    isSaving,
    updateState,
    updateCurrentDueDate,
    updateCurrentDeferredDate,
    updateCurrentPlanToFix,
    updateCurrentResponsibilityGroup,
    updateProgressNote,
    updateCurrentReasonIncomplete,
    updateCurrentCompleteNowReason,
    publish,
    publishProgress,
    handlePermissionWarning
  } = useUpdateItem(
    deficientItem.id,
    property.id,
    sendNotification,
    unpublishedUpdates,
    deficientItem,
    user
  );

  const {
    addUnpublishedDeficiencyPhoto,
    unpublishedDeficiencyPhotos,
    addUnpublishedDeficiencyPhotoCaption,
    removedUnpubilshedDeficiencyPhoto
  } = useUnpublishedDeficiencyPhotos(sendNotification, deficientItem.id);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const isLargeDesktop = useMediaQuery({
    minWidth: breakpoints.largeDesktop.minWidth
  });

  const [
    isUpdatingCurrentCompleteNowReason,
    setIsUpdatingCurrentCompleteNowReason
  ] = useState(false);
  const [isUpdatingDeferredDate, setIsUpdatingDeferredDate] = useState(false);

  const onShowPlanToFix = () => {
    setHistoryType('plansToFix');
  };

  const onChangePlanToFix = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentPlanToFix(evt.target.value);
  };
  const onShowHistory = () => {
    setHistoryType('stateHistory');
  };

  const onClickViewPhotos = () => {
    setIsVisiblePhotosModal(true);
  };

  const onShowDueDates = () => {
    setHistoryType('dueDates');
  };

  const onShowDeferredDates = () => {
    setHistoryType('deferredDates');
  };

  const onChangeDueDate = (evt: ChangeEvent<HTMLInputElement>) => {
    updateCurrentDueDate(dateUtil.isoToTimestamp(evt.target.value));
  };

  const onChangeDeferredDate = (evt: ChangeEvent<HTMLInputElement>) => {
    updateCurrentDeferredDate(dateUtil.isoToTimestamp(evt.target.value));
  };

  const onShowResponsibilityGroups = () => {
    setHistoryType('responsibilityGroups');
  };

  const onChangeResponsibilityGroup = (evt: ChangeEvent<HTMLSelectElement>) => {
    updateCurrentResponsibilityGroup(evt.target.value);
  };

  const onShowReasonIncomplete = () => {
    setHistoryType('reasonsIncomplete');
  };

  const onChangeReasonIncomplete = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentReasonIncomplete(evt.target.value);
  };

  const onShowCompletedPhotos = () => {
    setIsVisibleCompletedPhotosModal(true);
  };

  const onUpdatePending = () => {
    updateState('pending');
    publish();
  };

  const onUnpermittedPending = () => {
    console.log('triggered on unpermitted  pending action'); // eslint-disable-line
    handlePermissionWarning('pending');
  };

  const onAddProgressNote = () => {
    publish();
  };

  const onUpdateIncomplete = () => {
    updateState('incomplete');
    publish();
  };

  const onComplete = () => {
    updateState('completed');
    publish(unpublishedDeficiencyPhotos);
  };

  const onAddCompletionPhotos = () => {
    setIsVisibleCompletedPhotosModal(true);
  };

  const onGoBack = () => {
    updateState('go-back');
    publish();
  };

  const onCloseDuplicate = () => {
    updateState('closed');
    publish();
  };

  const onUnpermittedDuplicate = () => {
    console.log('triggered on unpermittd duplicate action'); // eslint-disable-line
    handlePermissionWarning('duplicate');
  };

  const onClose = () => {
    updateState('closed');
    publish();
  };

  const onCancelCompleteNow = () => {
    setIsUpdatingCurrentCompleteNowReason(false);
  };

  const onConfirmCompleteNow = async () => {
    updateState('closed');
    await publish();
    setIsUpdatingCurrentCompleteNowReason(false);
  };

  const onCompleteNow = () => {
    setIsUpdatingCurrentCompleteNowReason(true);
  };

  const onCancelDefer = () => {
    setIsUpdatingDeferredDate(false);
  };

  const onConfirmDefer = async () => {
    updateState('deferred');
    await publish();
    setIsUpdatingDeferredDate(false);
  };

  const onInitiateDefer = () => {
    setIsUpdatingDeferredDate(true);
  };

  const onUnpermittedDefer = () => {
    console.log('triggered on unpermitted defer action'); // eslint-disable-line
    handlePermissionWarning('defer');
  };

  const onShowProgressNotes = () => {
    console.log('triggered on show all progress notes action'); // eslint-disable-line
  };

  const onChangeProgressNote = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateProgressNote(evt.target.value);
  };

  const onShowCompleteNowReason = () => {
    setHistoryType('completeNowReasons');
  };

  const onChangeCompleteNowReason = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentCompleteNowReason(evt.target.value);
  };

  const onChangeFiles = async (file: Record<string, string | number>) =>
    addUnpublishedDeficiencyPhoto(
      file.dataUri as string,
      file.size as number,
      deficientItem.item,
      deficientItem.inspection,
      property.id,
      deficientItem.currentStartDate
    );

  const hasUnpublishedPhotos = unpublishedDeficiencyPhotos.length > 0;

  if (isSaving) {
    return (
      <LoadingHud
        title="Saving Deficient Item"
        hasProgress={true} // eslint-disable-line react/jsx-boolean-value
        progressValue={publishProgress}
      />
    );
  }

  return (
    <>
      <Header
        user={user}
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        itemTitle={deficientItem.itemTitle}
        deficientItem={deficientItem}
        isSaving={isSaving}
        updates={updates}
        isUpdatingCurrentCompleteNowReason={isUpdatingCurrentCompleteNowReason}
        isUpdatingDeferredDate={isUpdatingDeferredDate}
        onUpdatePending={onUpdatePending}
        onUnpermittedPending={onUnpermittedPending}
        onAddProgressNote={onAddProgressNote}
        onUpdateIncomplete={onUpdateIncomplete}
        onComplete={onComplete}
        onGoBack={onGoBack}
        onCloseDuplicate={onCloseDuplicate}
        onUnpermittedDuplicate={onUnpermittedDuplicate}
        onClose={onClose}
        onCancelCompleteNow={onCancelCompleteNow}
        onConfirmCompleteNow={onConfirmCompleteNow}
        onCompleteNow={onCompleteNow}
        onCancelDefer={onCancelDefer}
        onConfirmDefer={onConfirmDefer}
        onInitiateDefer={onInitiateDefer}
        onUnpermittedDefer={onUnpermittedDefer}
        onShowCompletedPhotos={onShowCompletedPhotos}
        hasUnpublishedPhotos={hasUnpublishedPhotos}
        onAddCompletionPhotos={onAddCompletionPhotos}
      />

      <Form
        user={user}
        property={property}
        onShowHistory={onShowHistory}
        isMobile={isMobile}
        isLargeDesktop={isLargeDesktop}
        isOnline={isOnline}
        isSaving={isSaving}
        updates={updates}
        isUpdatingCurrentCompleteNowReason={isUpdatingCurrentCompleteNowReason}
        isUpdatingDeferredDate={isUpdatingDeferredDate}
        onClickViewPhotos={onClickViewPhotos}
        deficientItem={deficientItem}
        propertyIntegration={propertyIntegration}
        onShowPlanToFix={onShowPlanToFix}
        onChangePlanToFix={onChangePlanToFix}
        onShowCompleteNowReason={onShowCompleteNowReason}
        onChangeCompleteNowReason={onChangeCompleteNowReason}
        onShowProgressNotes={onShowProgressNotes}
        onChangeProgressNote={onChangeProgressNote}
        onShowReasonIncomplete={onShowReasonIncomplete}
        onChangeReasonIncomplete={onChangeReasonIncomplete}
        onChangeDeferredDate={onChangeDeferredDate}
        onShowDeferredDates={onShowDeferredDates}
        onShowDueDates={onShowDueDates}
        onChangeDueDate={onChangeDueDate}
        onShowResponsibilityGroups={onShowResponsibilityGroups}
        onChangeResponsibilityGroup={onChangeResponsibilityGroup}
        onCreateTrelloCard={onCreateTrelloCard}
        onUpdatePending={onUpdatePending}
        onUnpermittedPending={onUnpermittedPending}
        onAddProgressNote={onAddProgressNote}
        onUpdateIncomplete={onUpdateIncomplete}
        onComplete={onComplete}
        onGoBack={onGoBack}
        onCloseDuplicate={onCloseDuplicate}
        onUnpermittedDuplicate={onUnpermittedDuplicate}
        onClose={onClose}
        onCancelCompleteNow={onCancelCompleteNow}
        onConfirmCompleteNow={onConfirmCompleteNow}
        onCompleteNow={onCompleteNow}
        onCancelDefer={onCancelDefer}
        onConfirmDefer={onConfirmDefer}
        onInitiateDefer={onInitiateDefer}
        onUnpermittedDefer={onUnpermittedDefer}
        onShowCompletedPhotos={onShowCompletedPhotos}
        isCreatingTrelloCard={isCreatingTrelloCard}
        hasUnpublishedPhotos={hasUnpublishedPhotos}
        onAddCompletionPhotos={onAddCompletionPhotos}
      />

      <PhotosModal
        photosData={deficientItem.itemPhotosData}
        subTitle={deficientItem.itemTitle}
        title="Item Photos"
        isVisible={isVisiblePhotosModal}
        onClose={() => setIsVisiblePhotosModal(false)}
        disabled={true} // eslint-disable-line
      />

      <PhotosModal
        completedPhotos={deficientItem.completedPhotos}
        subTitle="Completed Photo(s)"
        isVisible={isVisibleCompletedPhotosModal}
        onClose={() => setIsVisibleCompletedPhotosModal(false)}
        showCompletedList={true} // eslint-disable-line
        sendNotification={sendNotification}
        onChangeFiles={onChangeFiles}
        unpublishedPhotosData={unpublishedDeficiencyPhotos}
        onAddCaption={addUnpublishedDeficiencyPhotoCaption}
        onRemovePhoto={removedUnpubilshedDeficiencyPhoto}
        disabled={deficientItem.state !== 'pending'}
      />

      <HistoryModal
        onClose={() => setHistoryType(null)}
        isVisible={Boolean(historyType)}
        historyType={historyType}
        deficientItem={deficientItem}
        firestore={firestore}
      />
    </>
  );
};

export default DeficientItemEdit;
