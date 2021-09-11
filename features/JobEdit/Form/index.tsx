import { useRef, FunctionComponent, ChangeEvent } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  useForm,
  UseFormRegister,
  FormState,
  UseFormSetValue
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import Link from 'next/link';
import { diff } from 'deep-object-diff';
import propertyModel from '../../../common/models/property';
import LoadingHud from '../../../common/LoadingHud';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import userModel from '../../../common/models/user';
import attachmentModel from '../../../common/models/attachments';
import MobileHeader from '../../../common/MobileHeader';
import Dropdown, { DropdownButton } from '../../../common/Dropdown';
import ErrorLabel from '../../../common/ErrorLabel';
import ErrorList from '../../../common/ErrorList';
import utilString from '../../../common/utils/string';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import bidsConfig from '../../../config/bids';
import AddIcon from '../../../public/icons/ios/add.svg';
import AlbumIcon from '../../../public/icons/sparkle/album.svg';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import { JobApiResult } from '../hooks/useJobForm';
import DropdownHeader from '../DropdownHeader';
import DropdownAttachment from '../DropdownAttachment';
import DeleteAttachmentPrompt from '../DeleteAttachmentPrompt';
import DeleteTrelloCardPrompt from '../DeleteTrelloCardPrompt';
import { colors as bidColors } from '../../JobBids';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  user: userModel;
  property: propertyModel;
  job: jobModel;
  bids: Array<bidModel>;
  isNewJob: boolean;
  apiState: JobApiResult;
  postJobCreate(propertyId: string, job: jobModel): void;
  putJobUpdate(propertyId: string, jobId: string, job: jobModel): void;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  onFileChange(ev: ChangeEvent<HTMLInputElement>): void;
  uploadState: boolean;
  jobAttachment: attachmentModel;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  isDeleteAttachmentPromptVisible: boolean;
  confirmAttachmentDelete(): Promise<any>;
  deleteAtachmentLoading: boolean;
  sendNotification: userNotifications;
  setDeleteTrelloCardPromptVisible(newState: boolean): void;
  isDeleteTrelloCardPromptVisible: boolean;
}

type Inputs = {
  title: string;
  need: string;
  scopeOfWork: string;
  type: string;
  action: string;
  trelloCardURL: string;
};

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
  apiState: JobApiResult;
  onFormAction: (action: string) => void;
  register: UseFormRegister<Inputs>;
  formState: FormState<Inputs>;
  onFileChange(ev: ChangeEvent<HTMLInputElement>): void;
  isUploadingFile: boolean;
  jobAttachment: attachmentModel;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  sendNotification?: userNotifications;
  setValue?: UseFormSetValue<Inputs>;
  setDeleteTrelloCardPromptVisible(newState: boolean): void;
}

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
  apiState,
  onFormAction,
  register,
  formState,
  onFileChange,
  isUploadingFile,
  jobAttachment,
  setDeleteAttachmentPromptVisible,
  sendNotification,
  setValue,
  setDeleteTrelloCardPromptVisible
}) => {
  const apiErrors =
    apiState.statusCode === 400 && apiState.response.errors
      ? apiState.response.errors.map((e) => e.detail)
      : [];

  const nextState = !isNewJob && jobsConfig.nextState[job.state];

  const inputFile = useRef(null);

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  const openAttachmentDeletePrompt = () => {
    setDeleteAttachmentPromptVisible(true);
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

  return (
    <>
      {!isNewJob && isMobile && (
        <h1 data-testid="job-form-title-mobile" className={styles.mobileTitle}>
          <Link href={jobLink}>
            <a></a>
          </Link>
          {job.title}
        </h1>
      )}
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
            </div>
          </>
        )}

        <ErrorList errors={apiErrors} />

        <form>
          <div className={styles.form__grid__fields}>
            <div>
              <div className={styles.jobNew__formGroup}>
                <label htmlFor="jobTitle">
                  Title <span>*</span>
                </label>
                <div className={styles.jobNew__formGroup__control}>
                  <input
                    id="jobTitle"
                    type="text"
                    name="title"
                    className={styles.jobNew__input}
                    defaultValue={job.title}
                    data-testid="job-form-title"
                    {...register('title')}
                    disabled={apiState.isLoading || isJobComplete}
                  />
                  <ErrorLabel formName="title" errors={formState.errors} />
                </div>
              </div>
              <input
                type="hidden"
                defaultValue={job.trelloCardURL}
                {...register('trelloCardURL')}
              />
              <div className={styles.jobNew__formGroup}>
                <label htmlFor="jobDescription">
                  Need {isApprovedOrAuthorized && <span>*</span>}
                </label>
                <div className={styles.jobNew__formGroup__control}>
                  <textarea
                    id="jobDescription"
                    className="form-control"
                    rows={4}
                    name="need"
                    defaultValue={job.need}
                    data-testid="job-form-description"
                    {...register('need')}
                    disabled={apiState.isLoading || isJobComplete}
                  ></textarea>
                  <ErrorLabel formName="need" errors={formState.errors} />
                </div>
              </div>
              <div className={styles.jobNew__formGroup}>
                <label htmlFor="jobType">Job Type</label>
                <select
                  name="type"
                  id="jobType"
                  data-testid="job-form-type"
                  defaultValue={job.type}
                  {...register('type')}
                  disabled={apiState.isLoading || isJobComplete}
                >
                  {Object.keys(jobsConfig.types).map((t) => (
                    <option key={t} value={t}>
                      {jobsConfig.types[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.jobNew__formGroup}>
                <div className={styles.jobNew__formSeparatedLabel}>
                  <label htmlFor="jobScope">
                    Scope of work {isApprovedOrAuthorized && <span>*</span>}
                  </label>
                  {!isNewJob &&
                    (job.scopeOfWorkAttachment && jobAttachment ? (
                      <span className={styles['jobNew__formGroup--dropdown']}>
                        Attachment
                        <ActionsIcon />
                        <DropdownAttachment
                          fileUrl={jobAttachment.url}
                          onDelete={() => openAttachmentDeletePrompt()}
                        />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={styles.jobNew__formGroup__upload}
                        onClick={onUploadClick}
                        disabled={isUploadingFile}
                      >
                        Upload
                        <span
                          className={styles.jobNew__formGroup__upload__icon}
                        >
                          <AddIcon />
                        </span>
                        <input
                          type="file"
                          ref={inputFile}
                          className={styles.jobNew__formGroup__file}
                          onChange={onFileChange}
                          data-testid="input-file-attachment"
                        />
                      </button>
                    ))}
                </div>
                <div className={styles.jobNew__formGroup__control}>
                  <textarea
                    id="jobScope"
                    className="form-control"
                    rows={6}
                    name="scopeOfWork"
                    defaultValue={job.scopeOfWork}
                    data-testid="job-form-scope"
                    {...register('scopeOfWork')}
                    disabled={apiState.isLoading || isJobComplete}
                  ></textarea>
                  <ErrorLabel
                    formName="scopeOfWork"
                    errors={formState.errors}
                  />
                </div>
              </div>
            </div>
            <div>
              {/** Trello card */}
              {!isNewJob && (
                <div className={styles.jobNew__card}>
                  <div className={styles.jobNew__card__pill__action}>
                    <h4 className={styles.jobNew__card__title}>Trello Card</h4>
                    {job.trelloCardURL && (
                      <span className={styles.jobNew__card__pill__action__menu}>
                        <ActionsIcon />
                        <Dropdown>
                          <DropdownButton
                            type="button"
                            disabled={apiState.isLoading}
                            onClick={() =>
                              openTrelloCardInputPrompt(job.trelloCardURL)
                            }
                          >
                            Update
                          </DropdownButton>
                          <DropdownButton
                            type="button"
                            disabled={apiState.isLoading}
                            onClick={() => openTrelloCardDeletePrompt()}
                          >
                            Delete
                          </DropdownButton>
                        </Dropdown>
                      </span>
                    )}
                  </div>
                  {job.trelloCardURL ? (
                    <div
                      className={clsx(styles.jobNew__card__pill, '-mt')}
                      data-testid="trello-card-pill"
                    >
                      <h5 className={styles.jobNew__card__pill__title}>
                        <AlbumIcon />
                        Trello Card #1
                      </h5>
                      <a
                        href={job.trelloCardURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Card
                      </a>
                    </div>
                  ) : (
                    <div
                      className={clsx(styles.button__group, '-mt', '-mr-none')}
                    >
                      <button
                        type="button"
                        disabled={apiState.isLoading}
                        className={clsx(
                          styles.button__submit,
                          isMobile && styles.button__fullwidth
                        )}
                        onClick={() => openTrelloCardInputPrompt()}
                        data-testid="add-trello-card-btn"
                      >
                        Add Trello Card{' '}
                        <span>
                          <AddIcon />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/** Add Bid card */}
              {!isNewJob && (
                <div className={clsx(styles.jobNew__card, '-mt')}>
                  <div className={styles.jobNew__card__pill__action}>
                    <h4 className={styles.jobNew__card__title}>Bids</h4>
                  </div>
                  {bids.length > 0 ? (
                    bids.map((b) => (
                      <Link
                        href={`/properties/${propertyId}/jobs/${job.id}/bids/${b.id}`}
                        key={b.id}
                      >
                        <a>
                          <div
                            className={clsx(
                              styles.jobNew__card__pill,
                              styles.jobNew__bid,
                              '-mt'
                            )}
                            data-testid="bid-edit-card-pill"
                          >
                            <div className={styles.jobNew__bid__title}>
                              <h5 className={styles.jobNew__card__pill__title}>
                                {b.vendor}
                              </h5>
                              <span
                                className={clsx(
                                  styles.jobNew__bid__status,
                                  bidColors[bidsConfig.stateColors[b.state]]
                                )}
                              >
                                {utilString.titleize(b.state)}
                              </span>
                            </div>
                            <span className={styles.jobNew__bid__link}>
                              View Bid
                            </span>
                          </div>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <div
                      className={clsx(styles.button__group, '-mt', '-mr-none')}
                    >
                      <Link
                        href={`/properties/${propertyId}/jobs/${job.id}/bids/new`}
                      >
                        <a
                          className={clsx(
                            styles.button__submit,
                            isMobile && styles.button__fullwidth
                          )}
                          data-testid="add-bid-card-btn"
                        >
                          Add First Bid{' '}
                          <span>
                            <AddIcon />
                          </span>
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {canApprove && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="job-form-approve"
                disabled={apiState.isLoading}
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onFormAction('approved')}
              >
                Approve
              </button>
            </div>
          )}
          {canAuthorize && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="job-form-authorize"
                disabled={apiState.isLoading}
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                data-value="authorized"
                onClick={() => onFormAction('authorized')}
              >
                Authorize
              </button>
            </div>
          )}
          {canExpedite && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="job-form-expedite"
                disabled={apiState.isLoading}
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                data-value="expedite"
                onClick={() => onFormAction('expedite')}
              >
                Expedite
              </button>
            </div>
          )}

          {!isJobComplete && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="job-form-submit"
                disabled={apiState.isLoading}
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onFormAction('save')}
              >
                Save
              </button>
            </div>
          )}

          {isMobile && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <Link href={jobLink}>
                <a
                  className={clsx(
                    styles.button__cancel,
                    styles.button__fullwidth,
                    '-ta-center'
                  )}
                  data-testid="mobile-form-cancel"
                >
                  Cancel
                </a>
              </Link>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

const JobForm: FunctionComponent<Props> = ({
  user,
  property,
  job,
  bids,
  isNewJob,
  isOnline,
  isStaging,
  apiState,
  postJobCreate,
  putJobUpdate,
  toggleNavOpen,
  onFileChange,
  uploadState,
  jobAttachment,
  setDeleteAttachmentPromptVisible,
  isDeleteAttachmentPromptVisible,
  confirmAttachmentDelete,
  deleteAtachmentLoading,
  sendNotification,
  setDeleteTrelloCardPromptVisible,
  isDeleteTrelloCardPromptVisible
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
  const jobLink = `/properties/${property.id}/jobs`;

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

  const validationShape = {
    title: yup.string().required(formErrors.titleRequired),
    need: yup.string(),
    scopeOfWork: yup.string()
  };

  const isApprovedOrAuthorized =
    !isNewJob && ['approved', 'authorized'].includes(job.state);
  const isJobComplete = !isNewJob && job.state === 'complete';
  const canApprove = !isNewJob && job.state === 'open';
  const hasApprovedBid = bids.filter((b) => b.state === 'approved').length > 0;

  // If job is in approved state
  // And if job is expedited then have 1 approved bid
  // OR if job is not expedited then have 1 approved bid and more than 3 bids
  const canAuthorize =
    !isNewJob &&
    job.state === 'approved' &&
    ((job.authorizedRules === 'expedite' && hasApprovedBid) ||
      (job.authorizedRules !== 'expedite' &&
        hasApprovedBid &&
        bids.length >= 3));

  // If job is in approved state
  // And user is admin and job is not already expedited
  const canExpedite =
    !isNewJob &&
    job.state === 'approved' &&
    user.admin &&
    job.authorizedRules !== 'expedite';

  if (isApprovedOrAuthorized) {
    // Add need validation if job is in approve or authorized state
    validationShape.need = yup
      .string()
      .required(formErrors.descriptionRequired);

    // Add need validation if job is in approve or authorized state
    validationShape.scopeOfWork = yup
      .string()
      .required(formErrors.scopeRequired);
  }

  // Setup form validations
  const validationSchema = yup.object().shape(validationShape);

  // Setup form submissions
  const {
    register,
    getValues: getFormValues,
    trigger: triggerFormValidation,
    formState,
    setValue
  } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(validationSchema)
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
    const difference = diff(apiJob, formData);
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
      {apiState.isLoading && <LoadingHud title="Saving..." />}
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
          apiState={apiState}
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
            jobLink={jobLink}
            onFormAction={onSubmit}
            register={register}
            formState={formState}
            apiState={apiState}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            jobAttachment={jobAttachment}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
            sendNotification={sendNotification}
            setValue={setValue}
            setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          {apiState.isLoading && <LoadingHud title="Saving..." />}
          {uploadState && <LoadingHud title="Uploading..." />}
          {deleteAtachmentLoading && (
            <LoadingHud title="Remove Attachment..." />
          )}
          <Header
            property={property}
            apiState={apiState}
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
            jobLink={jobLink}
            onFormAction={onSubmit}
            register={register}
            formState={formState}
            apiState={apiState}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            jobAttachment={jobAttachment}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
            sendNotification={sendNotification}
            setValue={setValue}
            setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
          />
        </div>
      )}

      <DeleteAttachmentPrompt
        fileName={jobAttachment && jobAttachment.name}
        onConfirm={() => confirmAttachmentDelete()}
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
