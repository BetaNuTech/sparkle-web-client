import { useRef, FunctionComponent, ChangeEventHandler } from 'react';

import { UseFormRegister, FormState } from 'react-hook-form';
import clsx from 'clsx';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import attachmentModel from '../../../common/models/attachment';
import ErrorList from '../../../common/ErrorList';
import utilString from '../../../common/utils/string';

import jobsConfig from '../../../config/jobs';

import FormInputs from './FormInputs';
import styles from '../styles.module.scss';
import formErrors from './errors';
import JobNeed from './Fields/Need';
import JobExpedite from './Fields/Expedite';
import JobType from './Fields/Type';
import JobTitle from './Fields/Title';
import JobTrelloCard from './Fields/TrelloCard';
import JobBidCard from './Fields/BidCard';
import JobActionButtons from './Fields/ActionButtons';
import JobScope from './Fields/Scope';

interface Props {
  property: propertyModel;
  job: jobModel;
  bids: Array<bidModel>;
  isNewJob: boolean;
  isLoading: boolean;
  generalFormErrors: Array<string>;
  isNavOpen?: boolean;
  uploadState: boolean;
  isApprovedOrAuthorized: boolean;
  isJobComplete: boolean;
  canApprove: boolean;
  canAuthorize: boolean;
  canExpedite: boolean;
  bidsRequired: number;
  register: UseFormRegister<FormInputs>;

  formState: FormState<FormInputs>;

  needValidationOptions: any;
  expediteReasonValidation: any;
  sowValidationOptions: any;
  isMobile: boolean;
  onSubmit: (action: string) => void;
  jobLink: string;
  openTrelloCardInputPrompt(string?): void;
  onInputFileChange: ChangeEventHandler<HTMLInputElement>;
  openAttachmentDeletePrompt(attachment: attachmentModel): void;
  openTrelloCardDeletePrompt(): void;
}

const JobForm: FunctionComponent<Props> = ({
  property,
  job,
  bids,
  isNewJob,
  isLoading,
  generalFormErrors,
  uploadState,
  isApprovedOrAuthorized,
  isJobComplete,
  canApprove,
  canAuthorize,
  canExpedite,
  bidsRequired,
  register,
  formState,
  needValidationOptions,
  expediteReasonValidation,
  sowValidationOptions,
  isMobile,
  onSubmit,
  jobLink,
  openTrelloCardInputPrompt,
  onInputFileChange,
  openAttachmentDeletePrompt,
  openTrelloCardDeletePrompt
}) => {
  const nextState = !isNewJob && jobsConfig.nextState[job.state];

  const inputFile = useRef(null);

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
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

        <ErrorList errors={generalFormErrors} />

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
                isUploadingFile={uploadState}
                isLoading={isLoading}
                isJobComplete={isJobComplete}
                scopeOfWork={job.scopeOfWork}
                formState={formState}
                onUploadClick={onUploadClick}
                openAttachmentDeletePrompt={openAttachmentDeletePrompt}
                inputFile={inputFile}
                onInputFileChange={onInputFileChange}
                jobAttachments={job.scopeOfWorkAttachments}
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
                onFormAction={onSubmit}
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
                propertyId={property.id}
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
            onFormAction={onSubmit}
            showAction={isMobile}
          />
        </form>
      </div>
    </>
  );
};

export default JobForm;
