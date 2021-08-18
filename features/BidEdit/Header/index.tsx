import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import OfflineDesktop from '../../../common/OfflineDesktop';
import jobModel from '../../../common/models/job';
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
  canApprove,
  // canApproveEnabled,
  canReject,
  canMarkIncomplete,
  canMarkComplete,
  canReopen
}) => (
  <header className={styles.header} data-testid="bidedit-header">
    {/* Title And Create Button */}
    <div className={styles.header__content}>
      <div className={styles.header__content__main}>
        <Link href={bidLink}>
          <a className={styles.header__backButton}></a>
        </Link>

        <h1 className={styles.header__content__main__title}>
          <span
            className={styles.header__propertyName}
          >{`${property.name}`}</span>
          <span>&nbsp;/ Jobs</span>
          <span className={styles.header__propertyName}>
            &nbsp;/ {`${job.title}`}
          </span>
          <span data-testid="bidedit-header-name">
            &nbsp;/ {isNewBid ? 'New' : 'Edit'}
          </span>
        </h1>
      </div>
    </div>

    <aside className={styles.header__controls}>
      {isOnline ? (
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
          {canApprove && (
            <div className={parentStyles.button__group}>
              <button
                type="button"
                className={clsx(parentStyles.button__submit)}
                disabled={apiState.isLoading || !isOnline}
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
      ) : (
        <OfflineDesktop />
      )}
    </aside>
  </header>
);

Header.defaultProps = {};

export default Header;
