import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import { JobApiResult } from '../hooks/useJobForm';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  apiState: JobApiResult;
  job: jobModel;
  isOnline: boolean;
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
  isOnline,
  onFormAction
}) => {
  const propertyLink = `/properties/${property.id}/`;
  const jobLink = `/properties/${property.id}/jobs/`;

  const RightSide = () => (
    <>
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
    </>
  );

  return (
    <DesktopHeader
      headerTestId="jobedit-header"
      isColumnTitle
      title={
        <>
          <div className={styles.header__breadcrumb}>
            <Link href={propertyLink}>
              <a
                className={styles.header__propertyName}
              >{`${property.name}`}</a>
            </Link>
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <Link href={jobLink}>
              <a className={styles.header__propertyName}>Jobs</a>
            </Link>
            {!isNewJob && (
              <span className={styles.header__breadcrumb}>
                &nbsp;&nbsp;/&nbsp;&nbsp;Edit
              </span>
            )}
          </div>
          <div
            data-testid="jobedit-header-name"
            className={styles.header__jobTitle}
          >
            {isNewJob ? 'New Job' : job.title}
          </div>
        </>
      }
      isOnline={isOnline}
      right={<RightSide />}
      rightClass={styles.header__controls}
    />
  );
};

Header.defaultProps = {};

export default Header;
