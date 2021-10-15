import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import DesktopHeader from '../../../common/DesktopHeader';
import { BidApiResult } from '../hooks/useBidForm';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  apiState: BidApiResult;
  job: jobModel;
  isNewBid: boolean;
  bidLink: string;
  isOnline?: boolean;
  showSaveButton: boolean;
  onSubmit: (action: string) => void;
  canApprove: boolean;
  canApproveEnabled: boolean;
  canReject: boolean;
  canMarkIncomplete: boolean;
  canMarkComplete: boolean;
  canReopen: boolean;
}

const Header: FunctionComponent<JobsHeaderModel> = ({
  property,
  job,
  isNewBid,
  bidLink,
  isOnline,
  apiState,
  showSaveButton,
  onSubmit,
  canApproveEnabled,
  canReject,
  canMarkIncomplete,
  canMarkComplete,
  canReopen
}) => {
  const RightSide = () => (
    <>
      <div className={parentStyles.button__group}>
        <Link href={bidLink}>
          <a
            className={clsx(parentStyles.button__cancel)}
            data-testid="bidedit-header-cancel"
          >
            Cancel
          </a>
        </Link>
      </div>
      {!isNewBid && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__submit)}
            disabled={apiState.isLoading || !isOnline || !canApproveEnabled}
            data-testid="bidedit-header-approve"
            onClick={() => onSubmit('approved')}
          >
            Approve Bid
          </button>
        </div>
      )}

      {canMarkComplete && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__cancel, '-c-info')}
            disabled={apiState.isLoading || !isOnline}
            data-testid="bidedit-header-complete"
            onClick={() => onSubmit('complete')}
          >
            Complete
          </button>
        </div>
      )}
      {canMarkIncomplete && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__cancel, '-c-warning')}
            disabled={apiState.isLoading || !isOnline}
            data-testid="bidedit-header-incomplete"
            onClick={() => onSubmit('incomplete')}
          >
            Incomplete
          </button>
        </div>
      )}
      {canReject && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__cancel, '-c-alert')}
            disabled={apiState.isLoading || !isOnline}
            data-testid="bidedit-header-reject"
            onClick={() => onSubmit('rejected')}
          >
            Reject Bid
          </button>
        </div>
      )}
      {canReopen && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__cancel, '-c-info')}
            disabled={apiState.isLoading || !isOnline}
            data-testid="bidedit-header-reopen"
            onClick={() => onSubmit('reopen')}
          >
            Reopen
          </button>
        </div>
      )}
      {showSaveButton && (
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__submit)}
            disabled={apiState.isLoading || !isOnline}
            data-testid="bidedit-header-submit"
            onClick={() => onSubmit('save')}
          >
            Save
          </button>
        </div>
      )}
    </>
  );

  const propertyLink = `/properties/${property.id}/`;
  const jobLink = `/properties/${property.id}/jobs/`;
  const bidListLink = `/properties/${property.id}/jobs/${job.id}/bids/`;

  return (
    <DesktopHeader
      isColumnTitle
      headerTestId="bidedit-header"
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
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <Link href={bidListLink}>
              <a className={styles.header__propertyName}>Bids</a>
            </Link>
            {!isNewBid && (
              <span className={styles.header__breadcrumb}>
                &nbsp;&nbsp;/&nbsp;&nbsp;Edit
              </span>
            )}
          </div>
          <div
            data-testid="bidedit-header-name"
            className={styles.header__jobTitle}
          >
            {isNewBid ? 'New Bid' : job.title}
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
