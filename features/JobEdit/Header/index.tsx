import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import { JobApiResult } from '../hooks/useJobForm';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  apiState: JobApiResult;
  job: jobModel;
  isNewJob: boolean;
  isJobComplete: boolean;
  canApprove: boolean;
  canAuthorize: boolean;
  canExpedite: boolean;
  onFormAction: (action: string) => void;
}

const Header: FunctionComponent<JobsHeaderModel> = ({
  property,
  apiState,
  job,
  isNewJob,
  isJobComplete,
  canApprove,
  canAuthorize,
  canExpedite,
  onFormAction
}) => {
  const jobLink = `/properties/${property.id}/jobs`;

  return (
    <header className={styles.header} data-testid="jobedit-header">
      {/* Title And Create Button */}
      <div className={styles.header__content}>
        <div className={styles.header__content__main}>
          <Link href={jobLink}>
            <a
              className={styles.header__backButton}
              data-testid="property-jobs-back"
            ></a>
          </Link>
          <h1 className={styles.header__content__main__title}>
            <span
              className={styles.header__propertyName}
            >{`${property.name}`}</span>
            <span>&nbsp;/ Jobs</span>
            <span data-testid="jobedit-header-name">
              &nbsp;/ {isNewJob ? 'Create New' : job.title}
            </span>
          </h1>
        </div>
      </div>

      <aside className={styles.header__controls}>
        <div className={parentStyles.button__group}>
          <Link href={jobLink}>
            <a
              className={clsx(parentStyles.button__cancel)}
              data-testid="jobedit-header-cancel"
            >
              Cancel
            </a>
          </Link>
        </div>
        {!isJobComplete && (
          <div className={parentStyles.button__group}>
            <button
              type="button"
              className={clsx(parentStyles.button__submit)}
              disabled={apiState.isLoading}
              data-testid="jobedit-header-submit"
              onClick={() => onFormAction('save')}
            >
              Save
            </button>
          </div>
        )}
        {canApprove && (
          <div className={parentStyles.button__group}>
            <button
              type="button"
              className={clsx(parentStyles.button__submit)}
              disabled={apiState.isLoading}
              data-testid="jobedit-header-approve"
              onClick={() => onFormAction('approved')}
            >
              Approve
            </button>
          </div>
        )}
        {canAuthorize && (
          <div className={parentStyles.button__group}>
            <button
              type="button"
              className={clsx(parentStyles.button__submit)}
              disabled={apiState.isLoading}
              data-testid="jobedit-header-authorize"
              onClick={() => onFormAction('authorized')}
            >
              Authorize
            </button>
          </div>
        )}
        {canExpedite && (
          <div className={parentStyles.button__group}>
            <button
              type="button"
              className={clsx(parentStyles.button__submit)}
              disabled={apiState.isLoading}
              data-testid="jobedit-header-expedite"
              onClick={() => onFormAction('expedite')}
            >
              Expedite
            </button>
          </div>
        )}
      </aside>
    </header>
  );
};

Header.defaultProps = {};

export default Header;
