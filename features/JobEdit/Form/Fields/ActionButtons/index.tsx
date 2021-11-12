import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { JobState } from '../../../../../common/models/job';
import styles from '../../../styles.module.scss';

interface Props {
  jobState: JobState;
  isLoading: boolean;
  canApprove: boolean;
  jobLink: string;
  canAuthorize: boolean;
  canExpedite: boolean;
  isJobComplete: boolean;
  isMobile: boolean;
  onFormAction: (action: string) => void;
  showAction?: boolean;
}

const JobActionButtons: FunctionComponent<Props> = ({
  jobState,
  isLoading,
  jobLink,
  canApprove,
  canAuthorize,
  canExpedite,
  isJobComplete,
  isMobile,
  showAction,
  onFormAction
}) =>
  showAction && (
    <>
      {jobState === 'open' && (
        <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
          <button
            type="button"
            data-testid="job-form-approve"
            disabled={isLoading || !canApprove}
            className={clsx(
              styles.button__submit,
              isMobile && styles.button__fullwidth
            )}
            onClick={() => onFormAction('approved')}
          >
            Approve
          </button>
          {!canApprove && (
            <p className={clsx('-c-gray-light', '-mb-none')}>
              You do not have permission to approve this job
            </p>
          )}
        </div>
      )}
      {jobState === 'approved' && (
        <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
          <button
            type="button"
            data-testid="job-form-authorize"
            disabled={isLoading || !canAuthorize}
            className={clsx(
              styles.button__submit,
              isMobile && styles.button__fullwidth
            )}
            data-value="authorized"
            onClick={() => onFormAction('authorized')}
          >
            Authorize
          </button>
          {!canAuthorize && (
            <p className={clsx('-c-gray-light', '-mb-none')}>
              You cannot authorize this job
            </p>
          )}
        </div>
      )}
      {canExpedite && (
        <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
          <button
            type="button"
            data-testid="job-form-expedite"
            disabled={isLoading}
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
            disabled={isLoading}
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
    </>
  );

JobActionButtons.displayName = 'JobActionButtons';

JobActionButtons.defaultProps = {
  showAction: true
};

export default JobActionButtons;
