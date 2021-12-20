import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import {
  canApproveJob,
  canAuthorizeJob,
  canExpediteJob
} from '../../common/utils/userPermissions';
import MobileHeader from '../../common/MobileHeader';
import LoadingHud from '../../common/LoadingHud';
import breakpoints from '../../config/breakpoints';

import ActionsIcon from '../../public/icons/ios/actions.svg';
import DropdownHeader from './DropdownHeader';

import useJobForm from './hooks/useJobForm';
import useAttachmentChange from './hooks/useAttachmentChange';
import useAttachmentDelete from './hooks/useAttachmentDelete';
import useValidateJobForm from './hooks/useValidateJobForm';
import useTrelloCard from './hooks/useTrelloCard';
import JobForm from './Form';
import DeleteAttachmentPrompt from './DeleteAttachmentPrompt';
import MobileJobInfoHeader from './MobileJobInfoHeader';
import Header from './Header';
import DeleteTrelloCardPrompt from './DeleteTrelloCardPrompt';

import styles from './styles.module.scss';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  user: userModel;
  property: propertyModel;
  job: jobModel;
  jobId: string;
  bids: Array<bidModel>;
  sendNotification: userNotifications;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const JobNew: FunctionComponent<Props> = ({
  user,
  property,
  job,
  bids,
  jobId,
  sendNotification,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const isNewJob = jobId === 'new';

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const {
    register,
    getValues: getFormValues,
    triggerFormValidation,
    formState,
    setValue,
    needValidationOptions,
    expediteReasonValidation,
    sowValidationOptions
  } = useValidateJobForm(job, isNewJob);

  // get required job data for useJobForm hook
  const apiJob = (({ title, need, type, scopeOfWork, trelloCardURL, id }) => ({
    title,
    need,
    type,
    scopeOfWork,
    trelloCardURL,
    id,
    property: property.id
  }))(job);

  const { isLoading, generalFormErrors, onSubmit } = useJobForm(
    sendNotification,
    isNewJob,
    triggerFormValidation,
    getFormValues,
    formState,
    apiJob
  );

  const { uploadState, onInputFileChange } = useAttachmentChange(
    firestore,
    property.id,
    jobId,
    sendNotification
  );

  const {
    isDeleteAttachmentPromptVisible,
    currentAttachment,
    deleteAtachmentLoading,
    onDeleteAttachment,
    onConfirmAttachmentDelete,
    setDeleteAttachmentPromptVisible
  } = useAttachmentDelete(firestore, jobId, sendNotification);

  const closeAttachmentDeletePrompt = () => {
    setDeleteAttachmentPromptVisible(false);
  };

  const {
    openTrelloCardInputPrompt,
    isDeleteTrelloCardPromptVisible,
    openTrelloCardDeletePrompt,
    closeTrelloCardDeletePrompt,
    confirmTrelloCardDelete
  } = useTrelloCard(sendNotification, setValue, onSubmit);

  const propertyLink = `/properties/${property.id}/`;
  const jobLink = `/properties/${property.id}/jobs/`;

  const jobData = job && { ...job };

  const isApprovedOrAuthorized =
    !isNewJob && ['approved', 'authorized'].includes(job.state);
  const isJobComplete = !isNewJob && job.state === 'complete';

  const canApprove = canApproveJob(isNewJob, user, property.id, job);
  const bidsRequired = job.minBids - bids.length;

  const canAuthorize = canAuthorizeJob(jobId, user, property.id, job, bids);

  const canExpedite = canExpediteJob(jobId, user, job, bidsRequired);

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {isLoading && <LoadingHud title="Saving..." />}
      {uploadState && <LoadingHud title="Uploading..." />}
      {deleteAtachmentLoading && <LoadingHud title="Remove Attachment..." />}
      <div
        className={clsx(
          headStyle.header__button,
          headStyle['header__button--dropdown'],
          styles.jobNew__header__icon
        )}
      >
        <ActionsIcon />
        <DropdownHeader
          jobLink={jobLink}
          canApprove={canApprove}
          canAuthorize={canAuthorize}
          canExpedite={canExpedite}
          isLoading={isLoading}
          isJobComplete={isJobComplete}
          onFormAction={onSubmit}
        />
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <>
          <MobileHeader
            title={isNewJob ? 'Create New Job' : `${property.name} Job`}
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.jobNew__header}
          />
          <MobileJobInfoHeader
            propertyLink={propertyLink}
            jobLink={jobLink}
            property={property}
            isNewJob={isNewJob}
            bidsRequired={bidsRequired}
            job={job}
          />
        </>
      )}
      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          {isLoading && <LoadingHud title="Saving..." />}
          {uploadState && <LoadingHud title="Uploading..." />}
          {deleteAtachmentLoading && (
            <LoadingHud title="Remove Attachment..." />
          )}
          <Header
            property={property}
            isLoading={isLoading}
            job={job}
            isNewJob={isNewJob}
            isOnline={isOnline}
            isJobComplete={isJobComplete}
            canApprove={canApprove}
            canAuthorize={canAuthorize}
            canExpedite={canExpedite}
            onFormAction={onSubmit}
          />
        </div>
      )}
      <JobForm
        property={property}
        job={jobData}
        bids={bids}
        isNewJob={isNewJob}
        isLoading={isLoading}
        generalFormErrors={generalFormErrors}
        uploadState={uploadState}
        isApprovedOrAuthorized={isApprovedOrAuthorized}
        isJobComplete={isJobComplete}
        canApprove={canApprove}
        canAuthorize={canAuthorize}
        canExpedite={canExpedite}
        bidsRequired={bidsRequired}
        register={register}
        formState={formState}
        needValidationOptions={needValidationOptions}
        expediteReasonValidation={expediteReasonValidation}
        sowValidationOptions={sowValidationOptions}
        isMobile={isMobile}
        onSubmit={onSubmit}
        jobLink={jobLink}
        openTrelloCardInputPrompt={openTrelloCardInputPrompt}
        onInputFileChange={onInputFileChange}
        openAttachmentDeletePrompt={onDeleteAttachment}
        openTrelloCardDeletePrompt={openTrelloCardDeletePrompt}
      />
      <DeleteAttachmentPrompt
        fileName={currentAttachment && currentAttachment.name}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onConfirm={onConfirmAttachmentDelete}
        isVisible={isDeleteAttachmentPromptVisible}
        onClose={closeAttachmentDeletePrompt}
      />

      <DeleteTrelloCardPrompt
        onConfirm={() => confirmTrelloCardDelete()}
        isVisible={isDeleteTrelloCardPromptVisible}
        onClose={closeTrelloCardDeletePrompt}
      />
    </>
  );
};

JobNew.defaultProps = {};

export default JobNew;
