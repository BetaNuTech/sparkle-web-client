import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
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
}

const Header: FunctionComponent<JobsHeaderModel> = ({
  property,
  job,
  isNewBid,
  bidLink,
  isOnline,
  apiState,
  showSaveButton,
  onSubmit
}) => {
  const router = useRouter();

  return (
    <header className={styles.header} data-testid="bidedit-header">
      {/* Title And Create Button */}
      <aside className={styles.header__left}>
        <aside className={styles.header__main}>
          <button
            type="button"
            className={styles.header__backButton}
            onClick={() => router.back()}
          ></button>
          <h1 className={styles.header__title}>
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
        </aside>
      </aside>
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
            {showSaveButton && (
              <div className={parentStyles.button__group}>
                <button
                  type="button"
                  className={clsx(parentStyles.button__submit)}
                  disabled={apiState.isLoading}
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
};

Header.defaultProps = {};

export default Header;
