import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import { diff } from 'deep-object-diff';
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import attachmentModel from '../../common/models/attachment';
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

  const [isDeleteTrelloCardPromptVisible, setDeleteTrelloCardPromptVisible] =
    useState(false);

  const { isLoading, generalFormErrors, onPublish } =
    useJobForm(sendNotification);

  const { uploadState, onFileChange } = useAttachmentChange(
    firestore,
    property.id,
    jobId,
    sendNotification
  );

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

  const closeTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(false);
  };

  const openTrelloCardInputPrompt = (oldTrellCardURL?: string) => {
    // eslint-disable-next-line no-alert
    const trelloCardURL = window.prompt(
      'Enter job trello card link.',
      oldTrellCardURL
    );

    if (trelloCardURL) {
      const regExp = /https:\/\/trello\.com\/c\/\w+(?:\/[a-zA-Z0-9-]*)?/;
      // If reg ex matches then send update request
      if (regExp.test(trelloCardURL)) {
        setValue('trelloCardURL', trelloCardURL);
        onSubmit('save');
      } else {
        // Show notificaiton
        sendNotification(
          'Not a valid trello card URL. Try again with valid URL.',
          {
            type: 'error'
          }
        );
      }
    }
  };

  const onInputFileChange = (ev) => {
    const files = [];
    // loop through files
    for (let index = 0; index < ev.target.files.length; ) {
      files.push(ev.target.files[index]);
      index += 1;
    }
    onFileChange({
      target: {
        files
      }
    });
  };

  const openAttachmentDeletePrompt = (attachment: attachmentModel) => {
    onDeleteAttachment(attachment);
  };

  const openTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(true);
  };

  const apiJob = (({ title, need, type, scopeOfWork, trelloCardURL }) => ({
    title,
    need,
    type,
    scopeOfWork,
    trelloCardURL
  }))(job);

  // Handle form submissions
  const onSubmit = async (action) => {
    // Check if form is valid
    await triggerFormValidation();
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    if (hasErrors) return;

    const formData = getFormValues();
    const difference: jobModel = diff(apiJob, formData) as jobModel;

    // Check if it is an expedite request
    if (action === 'expedite') {
      // eslint-disable-next-line no-alert
      const expediteReason = window.prompt('Expedite Reason');

      if (!expediteReason) {
        return;
      }
      difference.expediteReason = expediteReason;
    }

    // Make request to api call
    onPublish(difference, isNewJob, property.id, job.id, action);
  };

  const confirmTrelloCardDelete = () => {
    // Remove the trello card url from hidden value
    setValue('trelloCardURL', '');
    // Save the form
    onSubmit('save');
  };

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
        openAttachmentDeletePrompt={openAttachmentDeletePrompt}
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
