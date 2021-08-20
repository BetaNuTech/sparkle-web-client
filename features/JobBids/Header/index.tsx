import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import configBids from '../../../config/bids';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface BidsHeaderModel {
  job: jobModel;
  property: propertyModel;
  bids: Array<bidModel>;
  bidStatus: string;
  colors: Record<string, string>;
  filterState?: string;
  changeFilterState?(state: string): void;
}

const MetaData: FunctionComponent<{
  bids?: Array<bidModel>;
  bidStatus: string;
  colors: Record<string, string>;
  filterState?: string;
  changeFilterState?(state: string): void;
}> = ({ bids, bidStatus, colors, filterState, changeFilterState }) => {
  const openBids = bids.filter((j) => j.state === 'open').length;
  const approvedBids = bids.filter((j) => j.state === 'approved').length;
  const rejectedBids = bids.filter((j) => j.state === 'rejected').length;
  const incompleteBids = bids.filter((j) => j.state === 'incomplete').length;
  return (
    <ul className={clsx(styles.header__overview__metadata, '-p-none')}>
      <li
        data-testid="bid-open-text"
        className={clsx(
          filterState && filterState !== 'open' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeFilterState('open')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configBids.stateColors.open]
            )}
            data-testid="bid-open"
          >
            {openBids}
          </span>
          <div>
            Open
            {bidStatus === 'loading' && (
              <small
                className={styles.header__overview__labelSub}
                data-testid="bid-open-loading"
              >
                loading...
              </small>
            )}
          </div>
        </button>
      </li>
      <li
        data-testid="bid-approved-text"
        className={clsx(
          filterState && filterState !== 'approved' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeFilterState('approved')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configBids.stateColors.approved]
            )}
            data-testid="bid-approved"
          >
            {approvedBids}
          </span>
          <div>
            Approved
            {bidStatus === 'loading' && (
              <small
                className={styles.header__overview__labelSub}
                data-testid="bid-approved-loading"
              >
                loading...
              </small>
            )}
          </div>
        </button>
      </li>
      <li
        data-testid="bid-rejected-text"
        className={clsx(
          filterState && filterState !== 'rejected' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeFilterState('rejected')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configBids.stateColors.rejected]
            )}
            data-testid="bid-rejected"
          >
            {rejectedBids}
          </span>
          <div>
            Rejected
            {bidStatus === 'loading' && (
              <small
                className={styles.header__overview__labelSub}
                data-testid="bid-rejected-loading"
              >
                loading...
              </small>
            )}
          </div>
        </button>
      </li>
      <li
        data-testid="bid-incomplete-text"
        className={clsx(
          filterState && filterState !== 'incomplete' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeFilterState('incomplete')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configBids.stateColors.incomplete]
            )}
            data-testid="bid-incomplete"
          >
            {incompleteBids}
          </span>
          <div>
            Incomplete
            {bidStatus === 'loading' && (
              <small
                className={styles.header__overview__labelSub}
                data-testid="bid-incomplete-loading"
              >
                loading...
              </small>
            )}
          </div>
        </button>
      </li>
    </ul>
  );
};

const Header: FunctionComponent<BidsHeaderModel> = ({
  job,
  property,
  bids,
  bidStatus,
  colors,
  filterState,
  changeFilterState
}) => {
  const backLink = `/properties/${property.id}/jobs`;
  return (
    <>
      <header className={styles.header} data-testid="bidlist-header">
        {/* Title And Create Button */}
        <aside className={styles.header__left}>
          <aside className={styles.header__main}>
            <Link href={backLink}>
              <a
                className={styles.header__backButton}
                data-testid="property-jobs-back"
              ></a>
            </Link>
            <h1 className={styles.header__title}>
              <span
                className={styles.header__propertyName}
              >{`${property.name}`}</span>
              <span>&nbsp;/ Jobs</span>
              <span className={styles.header__jobTitle}>
                &nbsp;/{` ${job.title}`}
              </span>
              <span>&nbsp;/ Bids</span>
            </h1>
          </aside>
        </aside>
      </header>
      <div className={clsx(styles.header, styles.header__bottom)}>
        <MetaData
          bids={bids}
          bidStatus={bidStatus}
          filterState={filterState}
          colors={colors}
          changeFilterState={changeFilterState}
        />

        <aside className={styles.header__controls}>
          <div className={styles.header__item}>
            <Link href={`/properties/${property.id}/jobs/${job.id}/bids/new`}>
              <a
                className={clsx(styles.header__item__createButton)}
                data-testid="job-bid-create"
              >
                Create New Bid
                <span className="iconAddButton">
                  <AddIcon />
                </span>
              </a>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
};

Header.defaultProps = {};

export default Header;
