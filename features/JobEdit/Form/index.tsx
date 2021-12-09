import { useRef, FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  useForm,
  UseFormRegister,
  FormState,
  UseFormSetValue
} from 'react-hook-form';
import clsx from 'clsx';
import Link from 'next/link';
import { diff } from 'deep-object-diff';
import propertyModel from '../../../common/models/property';
import LoadingHud from '../../../common/LoadingHud';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import userModel from '../../../common/models/user';
import attachmentModel from '../../../common/models/attachment';
import MobileHeader from '../../../common/MobileHeader';
import ErrorList from '../../../common/ErrorList';
import utilString from '../../../common/utils/string';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import DropdownHeader from '../DropdownHeader';
import DeleteAttachmentPrompt from '../DeleteAttachmentPrompt';
import DeleteTrelloCardPrompt from '../DeleteTrelloCardPrompt';
import { FileChangeEvent } from '../hooks/useAttachmentChange';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';
import {
  canApproveJob,
  canAuthorizeJob,
  canExpediteJob
} from '../../../common/utils/userPermissions';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import JobNeed from './Fields/Need';
import JobExpedite from './Fields/Expedite';
import JobType from './Fields/Type';
import FormInputs from './FormInputs';
import JobTitle from './Fields/Title';
import JobTrelloCard from './Fields/TrelloCard';
import JobBidCard from './Fields/BidCard';
import JobActionButtons from './Fields/ActionButtons';
import JobScope from './Fields/Scope';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  user: userModel;
  property: propertyModel;
  job: jobModel;
  jobId: string;
  bids: Array<bidModel>;
  isNewJob: boolean;
  isLoading: boolean;
  error: ErrorBadRequest;
  postJobCreate(propertyId: string, job: jobModel): void;
  putJobUpdate(propertyId: string, jobId: string, job: jobModel): void;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  onFileChange(ev: FileChangeEvent): void;
  uploadState: boolean;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  onDeleteAttachment(attachment: attachmentModel): void;
  isDeleteAttachmentPromptVisible: boolean;
  confirmAttachmentDelete(): Promise<any>;
  currentAttachment: attachmentModel;
  deleteAtachmentLoading: boolean;
  sendNotification: userNotifications;
  setDeleteTrelloCardPromptVisible(newState: boolean): void;
  isDeleteTrelloCardPromptVisible: boolean;
}

interface LayoutProps {
  isMobile: boolean;
  jobLink: string;
  job: jobModel;
  bids: Array<bidModel>;
  propertyId: string;
  isNewJob: boolean;
  isApprovedOrAuthorized: boolean;
  isJobComplete: boolean;
  canApprove: boolean;
  canAuthorize: boolean;
  canExpedite: boolean;
  user: userModel;
  isLoading: boolean;
  error: ErrorBadRequest;
  onFormAction: (action: string) => void;
  register: UseFormRegister<FormInputs>;
  formState: FormState<FormInputs>;
  onFileChange(ev: FileChangeEvent): void;
  isUploadingFile: boolean;
  bidsRequired: number;
  jobAttachments: attachmentModel[];
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  onDeleteAttachment(attachment: attachmentModel): void;
  sendNotification?: userNotifications;
  setValue?: UseFormSetValue<FormInputs>;
  setDeleteTrelloCardPromptVisible(newState: boolean): void;
}

// Validate if job meets scope of work requirements
const sowValidator = (value) => {
  let isValid = true;
  if (!value) {
    isValid = false;
  }
  // Check if we have attachment in SOW
  const attachmentList = document.getElementById('sowAttachmentList');
  if (!isValid && attachmentList) {
    isValid = attachmentList.children.length > 0;
  }
  return isValid || formErrors.scopeRequired;
};

const Layout: FunctionComponent<LayoutProps> = ({
  isMobile,
  job,
  bids,
  propertyId,
  isNewJob,
  isApprovedOrAuthorized,
  isJobComplete,
  canApprove,
  canAuthorize,
  canExpedite,
  jobLink,
  isLoading,
  error,
  onFormAction,
  register,
  formState,
  onFileChange,
  isUploadingFile,
  jobAttachments,
  bidsRequired,
  onDeleteAttachment,
  sendNotification,
  setValue,
  setDeleteTrelloCardPromptVisible
}) => {
  const apiErrors =
    error && error.errors ? error.errors.map((e) => e.detail) : [];

  const nextState = !isNewJob && jobsConfig.nextState[job.state];

  const inputFile = useRef(null);

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  const openAttachmentDeletePrompt = (attachment: attachmentModel) => {
    onDeleteAttachment(attachment);
  };

  const openTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(true);
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
        onFormAction('save');
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

  const needValidationOptions: any = {};
  const expediteReasonValidation: any = {};
  const sowValidationOptions: any = {};
  if (isApprovedOrAuthorized) {
    // Add need validation if job is in approve or authorized state
    needValidationOptions.required = formErrors.descriptionRequired;

    // Add scope of work validation if job is in approve or authorized state
    sowValidationOptions.validate = sowValidator;
  }
  if (job.expediteReason) {
    // Add expedite reason required if it is present
    expediteReasonValidation.required = formErrors.expediteReasonRequired;
  }

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

  return (
    <>
      <div className={clsx(styles.form__grid)}>
        {!isNewJob && (
          <>
            <div
              className={clsx(
                styles.job__info,
                isMobile && styles.job__info__mobile
              )}
            >
              {job.state && (
                <div
                  className={clsx(
                    styles.job__info__box,
                    isMobile
                      ? styles.job__info__box__mobile
                      : styles.job__info__box__desktop
                  )}
                >
                  <p>Job Status{!isMobile && <> :&nbsp;</>}</p>
                  <h3 data-testid="job-form-edit-state">
                    {utilString.titleize(job.state)}
                  </h3>
                </div>
              )}
              {nextState && (
                <div
                  className={clsx(
                    styles.job__info__box,
                    isMobile
                      ? styles.job__info__box__mobile
                      : styles.job__info__box__desktop
                  )}
                >
                  <p>Requires{!isMobile && <> :&nbsp;</>}</p>
                  <h3 data-testid="job-form-edit-nextstatus">{nextState}</h3>
                </div>
              )}
              {!isMobile && job.authorizedRules === 'expedite' && (
                <div
                  className={clsx(
                    styles.job__info__box,
                    styles.job__info__box__desktop
                  )}
                >
                  <span className={styles['job__info__expedited--desktop']}>
                    Expedited
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <ErrorList errors={apiErrors} />

        <form>
          <div className={styles.form__grid__fields}>
            <div>
              <JobTitle
                defaultValue={job.title}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                formState={formState}
                {...register('title', {
                  required: formErrors.titleRequired
                })}
              />
              <input
                type="hidden"
                defaultValue={job.trelloCardURL}
                {...register('trelloCardURL')}
              />
              <JobNeed
                defaultValue={job.need}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                formState={formState}
                isApprovedOrAuthorized={isApprovedOrAuthorized}
                {...register('need', needValidationOptions)}
              />
              <JobExpedite
                defaultValue={job.expediteReason}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                formState={formState}
                expediteReason={job.expediteReason}
                {...register('expediteReason', expediteReasonValidation)}
              />
              <JobType
                jobType={job.type}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                {...register('type')}
              />
              <JobScope
                isNewJob={isNewJob}
                isUploadingFile={isUploadingFile}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                scopeOfWork={job.scopeOfWork}
                formState={formState}
                onUploadClick={onUploadClick}
                openAttachmentDeletePrompt={openAttachmentDeletePrompt}
                inputFile={inputFile}
                onInputFileChange={onInputFileChange}
                jobAttachments={jobAttachments}
                {...register('scopeOfWork', sowValidationOptions)}
              />
              <JobActionButtons
                jobState={job.state}
                canApprove={canApprove}
                canAuthorize={canAuthorize}
                jobLink={jobLink}
                canExpedite={canExpedite}
                isJobComplete={isJobComplete}
                isMobile={isMobile}
                isLoading={isLoading}
                onFormAction={onFormAction}
                showAction={!isMobile}
              />
            </div>
            <div>
              <JobTrelloCard
                trelloCardURL={job.trelloCardURL}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                isMobile={isMobile}
                isNewJob={isNewJob}
                openTrelloCardDeletePrompt={openTrelloCardDeletePrompt}
                openTrelloCardInputPrompt={openTrelloCardInputPrompt}
              />
              <JobBidCard
                bids={bids}
                isMobile={isMobile}
                isNewJob={isNewJob}
                bidsRequired={bidsRequired}
                propertyId={propertyId}
                jobId={job.id}
                jobState={job.state}
              />
            </div>
          </div>

          <JobActionButtons
            jobState={job.state}
            jobLink={jobLink}
            canApprove={canApprove}
            canAuthorize={canAuthorize}
            canExpedite={canExpedite}
            isJobComplete={isJobComplete}
            isMobile={isMobile}
            isLoading={isLoading}
            onFormAction={onFormAction}
            showAction={isMobile}
          />
        </form>
      </div>
    </>
  );
};

const JobForm: FunctionComponent<Props> = ({
  user,
  property,
  job,
  jobId,
  bids,
  isNewJob,
  isOnline,
  isStaging,
  isLoading,
  error,
  postJobCreate,
  putJobUpdate,
  toggleNavOpen,
  onFileChange,
  uploadState,
  setDeleteAttachmentPromptVisible,
  onDeleteAttachment,
  isDeleteAttachmentPromptVisible,
  confirmAttachmentDelete,
  deleteAtachmentLoading,
  sendNotification,
  setDeleteTrelloCardPromptVisible,
  isDeleteTrelloCardPromptVisible,
  currentAttachment
}) => {
  const closeAttachmentDeletePrompt = () => {
    setDeleteAttachmentPromptVisible(false);
  };

  const closeTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(false);
  };

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });
  const propertyLink = `/properties/${property.id}/`;
  const jobLink = `/properties/${property.id}/jobs/`;

  // Publish Job updates to API
  const onPublish = (data, action) => {
    const formJob = {
      ...data
    } as jobModel;

    switch (action) {
      case 'approved':
        formJob.state = 'approved';
        break;
      case 'authorized':
        formJob.state = 'authorized';
        break;
      case 'expedite':
        formJob.authorizedRules = 'expedite';
        break;
      default:
        break;
    }

    // Check if we have job data
    // Means it is an edit form
    if (Object.keys(job).length > 0) {
      // Update request
      putJobUpdate(property.id, job.id, formJob);
    } else {
      // Save request
      postJobCreate(property.id, formJob);
    }
  };

  const isApprovedOrAuthorized =
    !isNewJob && ['approved', 'authorized'].includes(job.state);
  const isJobComplete = !isNewJob && job.state === 'complete';
  const hasMetSowReq =
    Boolean(job.scopeOfWork) || (job.scopeOfWorkAttachments || []).length > 0;
  const canApprove =
    hasMetSowReq && canApproveJob(isNewJob, user, property.id, job);
  const bidsRequired = job.minBids - bids.length;

  const canAuthorize = canAuthorizeJob(jobId, user, property.id, job, bids);

  const canExpedite = canExpediteJob(jobId, user, job, bidsRequired);

  // Setup form submissions
  const {
    register,
    getValues: getFormValues,
    trigger: triggerFormValidation,
    formState,
    setValue
  } = useForm<FormInputs>({
    mode: 'all'
  });

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
    onPublish(difference, action);
  };

  const confirmTrelloCardDelete = () => {
    // Remove the trello card url from hidden value
    setValue('trelloCardURL', '');
    // Save the form
    onSubmit('save');
  };

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
      {isMobileorTablet && (
        <>
          <MobileHeader
            title={isNewJob ? 'Create New Job' : `${property.name} Job`}
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.jobNew__header}
          />
          <div
            className={styles.job__info__header__main}
            data-testid="job-form-title-mobile"
          >
            <div className={styles.job__info__header__separated}>
              <div className={styles.job__info__header__breadcrumb}>
                <Link href={propertyLink}>
                  <a
                    className={styles.job__info__header__breadcrumb__text}
                  >{`${property.name}`}</a>
                </Link>
                <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                <Link href={jobLink}>
                  <a className={styles.job__info__header__breadcrumb__text}>
                    Jobs
                  </a>
                </Link>
                {!isNewJob && (
                  <span className={styles.job__info__header__breadcrumb}>
                    &nbsp;&nbsp;/&nbsp;&nbsp;Edit
                  </span>
                )}
              </div>
              <div>
                {bidsRequired > 0 ? (
                  <span
                    className={styles.job__info__bidsRequired}
                    data-testid="bids-required"
                  >
                    {`+${bidsRequired} bid${
                      bidsRequired > 1 ? 's' : ''
                    } required`}
                  </span>
                ) : (
                  <span
                    className={clsx(
                      styles.job__info__bidsRequired,
                      styles['job__info__bidsRequired--met']
                    )}
                    data-testid="bids-requirement-met"
                  >
                    Bid requirements met
                  </span>
                )}
              </div>
            </div>
            <h1 className={styles.job__info__header__title}>
              {isNewJob ? 'New Job' : job.title}
              {!isNewJob && job.authorizedRules === 'expedite' && (
                <div>
                  <span className={styles.job__info__expedited}>Expedited</span>
                </div>
              )}
            </h1>
          </div>
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            bids={bids}
            propertyId={property.id}
            isNewJob={isNewJob}
            isApprovedOrAuthorized={isApprovedOrAuthorized}
            isJobComplete={isJobComplete}
            canApprove={canApprove}
            canAuthorize={canAuthorize}
            canExpedite={canExpedite}
            user={user}
            jobLink={jobLink}
            onFormAction={onSubmit}
            register={register}
            formState={formState}
            isLoading={isLoading}
            error={error}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            bidsRequired={bidsRequired}
            jobAttachments={job.scopeOfWorkAttachments}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
            onDeleteAttachment={onDeleteAttachment}
            sendNotification={sendNotification}
            setValue={setValue}
            setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
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
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            bids={bids}
            propertyId={property.id}
            isNewJob={isNewJob}
            isApprovedOrAuthorized={isApprovedOrAuthorized}
            isJobComplete={isJobComplete}
            canApprove={canApprove}
            canAuthorize={canAuthorize}
            canExpedite={canExpedite}
            user={user}
            jobLink={jobLink}
            onFormAction={onSubmit}
            register={register}
            formState={formState}
            isLoading={isLoading}
            error={error}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            bidsRequired={bidsRequired}
            jobAttachments={job.scopeOfWorkAttachments}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
            onDeleteAttachment={onDeleteAttachment}
            sendNotification={sendNotification}
            setValue={setValue}
            setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
          />
        </div>
      )}

      <DeleteAttachmentPrompt
        fileName={currentAttachment && currentAttachment.name}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onConfirm={confirmAttachmentDelete}
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

export default JobForm;
