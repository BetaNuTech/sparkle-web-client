import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import configBids from '../../../config/bids';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';
import desktopHeaderStyles from '../../../common/DesktopHeader/styles.module.scss';

interface BidsHeaderModel {
  job: jobModel;
  property: propertyModel;
  bids: Array<bidModel>;
  bidStatus: string;
  colors: Record<string, string>;
  filterState?: string;
  isOnline: boolean;
  changeFilterState?(state: string): void;
  bidsRequired?: number;
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
  isOnline,
  changeFilterState,
  bidsRequired
}) => {
  const propertyLink = `/properties/${property.id}/`;
  const jobListLink = `/properties/${property.id}/jobs/`;
  const jobEditLink = `/properties/${property.id}/jobs/edit/${job.id}/`;
  return (
    <DesktopHeader
      headerTestId="bidlist-header"
      isColumnTitle
      headerClass={styles.header__padding}
      title={
        <>
          <div className={styles.header__breadcrumb}>
            <Link href={propertyLink}>
              <a
                className={styles.header__propertyName}
              >{`${property.name}`}</a>
            </Link>
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <Link href={jobListLink}>
              <a className={styles.header__propertyName}>Jobs</a>
            </Link>
            <span className={styles.header__breadcrumb}>
              &nbsp;&nbsp;/&nbsp;&nbsp;Bids
            </span>
          </div>
          <div
            data-testid="bidlist-header-name"
            className={styles.header__jobTitle}
          >
            {job.title}
          </div>
        </>
      }
      isOnline={isOnline}
      nextLine={
        <MetaData
          bids={bids}
          bidStatus={bidStatus}
          filterState={filterState}
          colors={colors}
          changeFilterState={changeFilterState}
        />
      }
      nextLineRight={
        <div className={desktopHeaderStyles.header__controls__column}>
          {job.state === 'open' ? (
            <Link href={jobEditLink}>
              <a data-testid="job-bid-create-msg">Approve Job to Create Bids</a>
            </Link>
          ) : (
            <>
              <div className={styles.header__item}>
                <Link
                  href={`/properties/${property.id}/jobs/${job.id}/bids/new`}
                >
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
              {bidsRequired > 0 ? (
                <span
                  className={desktopHeaderStyles.header__controls__instructions}
                  data-testid="bids-required"
                >
                  {`+${bidsRequired} bid${
                    bidsRequired > 1 ? 's' : ''
                  } required`}
                </span>
              ) : (
                <span
                  className={clsx(
                    desktopHeaderStyles.header__controls__instructions,
                    desktopHeaderStyles[
                      'header__controls__instructions--satisfied'
                    ]
                  )}
                  data-testid="bids-requirement-met"
                >
                  (Bid requirements met)
                </span>
              )}
            </>
          )}
        </div>
      }
    />
  );
};

Header.defaultProps = {};

export default Header;
