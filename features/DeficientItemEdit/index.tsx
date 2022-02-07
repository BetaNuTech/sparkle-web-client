import { ChangeEvent, FunctionComponent, useState } from 'react';
import firebase from 'firebase/app';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import PhotosModal from '../../common/PhotosModal';
import PropertyTrelloIntegrationModel from '../../common/models/propertyTrelloIntegration';
import DeficientItemEditForm from '../../common/DeficientItemEditForm';
import HistoryModal from './HistoryModal';
import dateUtil from '../../common/utils/date';
import Header from './Header';
import useTrelloCard from './hooks/useTrelloCard';
import useUpdateItem from './hooks/useUpdateItem';

type userNotifications = (message: string, options?: any) => any;
interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: DeficientItemModel;
  propertyIntegration: PropertyTrelloIntegrationModel;
  isOnline?: boolean;
  isStaging?: boolean;
  sendNotification: userNotifications;
  unpublishedItemUpdates: DeficientItemModel;
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
  unpublishedItemUpdates,
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
    updateCurrentDueDate,
    updateCurrentPlanToFix,
    updateCurrentResponsibilityGroup,
    updateProgressNote,
    updateCurrentReasonIncomplete,
    updateCurrentCompleteNowReason,
    publish
  } = useUpdateItem(
    deficientItem.id,
    sendNotification,
    unpublishedItemUpdates,
    deficientItem
  );

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
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
    console.log('triggered on show previous due dates action'); // eslint-disable-line
  };

  const onChangeDueDate = (evt: ChangeEvent<HTMLInputElement>) => {
    updateCurrentDueDate(dateUtil.isoToTimestamp(evt.target.value));
  };

  const onShowResponsibilityGroups = () => {
    console.log('triggered on show responsibility groups action'); // eslint-disable-line
  };

  const onChangeResponsibilityGroup = (evt: ChangeEvent<HTMLSelectElement>) => {
    updateCurrentResponsibilityGroup(evt.target.value);
  };

  const onShowReasonIncomplete = () => {
    console.log('triggered on show reason incomplete action'); // eslint-disable-line
  };

  const onChangeReasonIncomplete = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentReasonIncomplete(evt.target.value);
  };

  const onShowCompletedPhotos = () => {
    console.log('triggered on show completed photos action'); // eslint-disable-line
  };

  const onUpdatePending = () => {
    console.log('triggered on update pending action'); // eslint-disable-line
  };

  const onUnpermittedPending = () => {
    console.log('triggered on unpermitted  pending action'); // eslint-disable-line
  };

  const onAddProgressNote = () => {
    publish();
  };

  const onUpdateIncomplete = () => {
    console.log('triggered on update incomplete action'); // eslint-disable-line
  };

  const onComplete = () => {
    setIsVisibleCompletedPhotosModal(true);
  };

  const onGoBack = () => {
    console.log('triggered on go back action'); // eslint-disable-line
  };

  const onCloseDuplicate = () => {
    console.log('triggered on close duplicate action'); // eslint-disable-line
  };

  const onUnpermittedDuplicate = () => {
    console.log('triggered on unpermittd duplicate action'); // eslint-disable-line
  };

  const onClose = () => {
    console.log('triggered on close action'); // eslint-disable-line
  };

  const onCancelCompleteNow = () => {
    setIsUpdatingCurrentCompleteNowReason(false);
  };

  const onConfirmCompleteNow = () => {
    console.log('triggered on confirm complete now action'); // eslint-disable-line
  };

  const onCompleteNow = () => {
    setIsUpdatingCurrentCompleteNowReason(true);
  };

  const onCancelDefer = () => {
    setIsUpdatingDeferredDate(false);
  };

  const onConfirmDefer = () => {
    console.log('triggered on confirm defer action'); // eslint-disable-line
  };

  const onInitiateDefer = () => {
    setIsUpdatingDeferredDate(true);
  };

  const onUnpermittedDefer = () => {
    console.log('triggered on unpermitted defer action'); // eslint-disable-line
  };

  const onShowProgressNotes = () => {
    console.log('triggered on show all progress notes action'); // eslint-disable-line
  };

  const onChangeProgressNote = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateProgressNote(evt.target.value);
  };

  const onShowCompleteNowReason = () => {
    console.log('triggered on show complete now reason action'); // eslint-disable-line
  };

  const onChangeCompleteNowReason = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentCompleteNowReason(evt.target.value);
  };

  const onChangeFiles = (files: Record<string, string | number>) => {
    // eslint-disable-next-line
    console.log('triggered on file change', files);
  };

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
      />

      <DeficientItemEditForm
        user={user}
        property={property}
        onShowHistory={onShowHistory}
        isMobile={isMobile}
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
