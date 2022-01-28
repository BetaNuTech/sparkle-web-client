import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import InspectionItemPhotosModal from '../../common/InspectionItemPhotosModal';
import DeficientItemEditForm from '../../common/DeficientItemEditForm';
import Header from './Header';

interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: deficientItemModel;
  isOnline?: boolean;
  isStaging?: boolean;
}

const DeficientItemEdit: FunctionComponent<Props> = ({
  user,
  property,
  deficientItem,
  isOnline,
  isStaging
}) => {
  // placeholder for update state
  const deficientItemUpdates = {} as deficientItemModel;

  const [isVisiblePhotosModal, setIsVisiblePhotosModal] = useState(false);

  const isSaving = false;

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const isUpdatingCurrentCompleteNowReason = false;

  const isUpdatingDeferredDate = false;

  const onShowPlanToFix = () => {
    console.log('triggered on show plan to fix action'); // eslint-disable-line
  };

  const onChangePlanToFix = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered plan to fix textarea change event with value => ${evt.target.value}`
    );
  };
  const onShowHistory = () => {
    console.log('show history action'); // eslint-disable-line
  };

  const onClickViewPhotos = () => {
    setIsVisiblePhotosModal(true);
  };

  const onShowDueDates = () => {
    console.log('triggered on show previous due dates action'); // eslint-disable-line
  };

  const onChangeDueDate = (evt: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered due date change event with value => ${evt.target.value}`
    );
  };

  const onShowResponsibilityGroups = () => {
    console.log('triggered on show responsibility groups action'); // eslint-disable-line
  };

  const onChangeResponsibilityGroup = (evt: ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered responsibility group change event with value => ${evt.target.value}`
    );
  };

  const onShowReasonIncomplete = () => {
    console.log('triggered on show reason incomplete action'); // eslint-disable-line
  };

  const onChangeReasonIncomplete = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered reason incomplete change event with value => ${evt.target.value}`
    );
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
    console.log('triggered on add progress note action'); // eslint-disable-line
  };

  const onUpdateIncomplete = () => {
    console.log('triggered on update incomplete action'); // eslint-disable-line
  };

  const onComplete = () => {
    console.log('triggered on complete action'); // eslint-disable-line
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
    console.log('triggered on cancel complete now action'); // eslint-disable-line
  };

  const onConfirmCompleteNow = () => {
    console.log('triggered on confirm complete now action'); // eslint-disable-line
  };

  const onCompleteNow = () => {
    console.log('triggered on complete now action'); // eslint-disable-line
  };

  const onCancelDefer = () => {
    console.log('triggered on cancel defer action'); // eslint-disable-line
  };

  const onConfirmDefer = () => {
    console.log('triggered on confirm defer action'); // eslint-disable-line
  };

  const onInitiateDefer = () => {
    console.log('triggered on initiate defer action'); // eslint-disable-line
  };

  const onUnpermittedDefer = () => {
    console.log('triggered on unpermitted defer action'); // eslint-disable-line
  };

  const onShowProgressNotes = () => {
    console.log('triggered on show all progress notes action'); // eslint-disable-line
  };

  const onChangeProgressNote = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered progress notes textarea change event with value => ${evt.target.value}`
    );
  };

  const onShowCompleteNowReason = () => {
    console.log('triggered on show complete now reason action'); // eslint-disable-line
  };

  const onChangeCompleteNowReason = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered complete now reason textarea change event with value => ${evt.target.value}`
    );
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
        deficientItemUpdates={deficientItemUpdates}
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
        onShowHistory={onShowHistory}
        isMobile={isMobile}
        isSaving={isSaving}
        deficientItemUpdates={deficientItemUpdates}
        isUpdatingCurrentCompleteNowReason={isUpdatingCurrentCompleteNowReason}
        isUpdatingDeferredDate={isUpdatingDeferredDate}
        onClickViewPhotos={onClickViewPhotos}
        deficientItem={deficientItem}
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

      <InspectionItemPhotosModal
        photosData={deficientItem.itemPhotosData}
        subTitle={deficientItem.itemTitle}
        title="Item Photos"
        isVisible={isVisiblePhotosModal}
        onClose={() => setIsVisiblePhotosModal(false)}
        disabled={true} // eslint-disable-line
      />
    </>
  );
};

export default DeficientItemEdit;
