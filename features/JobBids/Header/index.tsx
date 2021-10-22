import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import useBidApprovedCompleted from '../../../common/hooks/useBidApprovedCompleted';
import utilDate from '../../../common/utils/date';
import utilString from '../../../common/utils/string';
import configBids from '../../../config/bids';
import AddIcon from '../../../public/icons/ios/add.svg';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import styles from './styles.module.scss';
import desktopHeaderStyles from '../../../common/DesktopHeader/styles.module.scss';
import useBidsCost from '../hooks/useBidsCost';

interface BidsHeaderModel {
  job: jobModel;
  property: propertyModel;
  bids: Array<bidModel>;
  bidStatus: string;
  colors: Record<string, string>;
  textColors: Record<string, string>;
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
  textColors,
  filterState,
  isOnline,
  changeFilterState,
  bidsRequired
}) => {
  const propertyLink = `/properties/${property.id}/`;
  const jobListLink = `/properties/${property.id}/jobs/`;
  const jobEditLink = `/properties/${property.id}/jobs/edit/${job.id}/`;
  const { approvedCompletedBid } = useBidApprovedCompleted(bids);
  const bidRange = approvedCompletedBid && useBidsCost(approvedCompletedBid);
  return (
    <>
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
        right={
          <div className={desktopHeaderStyles.header__controls}>
            {job.state === 'open' ? (
              <Link href={jobEditLink}>
                <a data-testid="job-bid-create-msg">
                  Approve Job to Create Bids
                </a>
              </Link>
            ) : (
              <>
                <Link href={jobEditLink}>
                  <a className={clsx(styles['header__controls--link'])}>
                    View Job
                  </a>
                </Link>
                <div>
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
                      className={
                        desktopHeaderStyles.header__controls__instructions
                      }
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
                </div>
              </>
            )}
          </div>
        }
        rightClass={styles.header__controls}
      />
      <div className={styles.header__overview}>
        {approvedCompletedBid && (
          <div className={styles.header__overview__bid} data-testid="bid-approved-completed">
            <header className={styles.header__overview__bid__header}>
              <aside className={styles['header__overview__bid__header--left']}>
                <label
                  className={clsx(
                    styles['header__overview__bid__header--title'],
                    textColors[
                      configBids.stateColors[approvedCompletedBid.state]
                    ]
                  )}
                  data-testid="bid-approved-completed-title"
                >
                  {utilString.titleize(approvedCompletedBid.state)}
                </label>
                {(approvedCompletedBid.vendorW9 ||
                  approvedCompletedBid.vendorInsurance ||
                  approvedCompletedBid.vendorLicense) && (
                  <div
                    className={
                      styles['header__overview__bid__header--complaince']
                    }
                  >
                    {approvedCompletedBid.vendorW9 && (
                      <label data-testid="bid-complaince-w9-approved">
                        <CheckmarkSimpleIcon />
                        <span>W9 Approved</span>
                      </label>
                    )}
                    {approvedCompletedBid.vendorInsurance && (
                      <label data-testid="bid-complaince-insurance-approved">
                        <CheckmarkSimpleIcon />
                        <span>Insurance Approved</span>
                      </label>
                    )}
                    {approvedCompletedBid.vendorLicense && (
                      <label data-testid="bid-complaince-license-approved">
                        <CheckmarkSimpleIcon />
                        <span>License Approved</span>
                      </label>
                    )}
                  </div>
                )}
              </aside>
              <Link
                href={`/properties/${property.id}/jobs/${job.id}/bids/${approvedCompletedBid.id}`}
              >
                <a>View Bid</a>
              </Link>
            </header>
            <div
              className={clsx(
                styles.header__overview__bid__border,
                colors[configBids.stateColors[approvedCompletedBid.state]]
              )}
            ></div>
            <div className={styles.header__overview__bid__info}>
              <h3 className={styles['header__overview__bid__info--vendor']}>
                {approvedCompletedBid.vendor}
              </h3>
              <span>Vendor details</span>
              <div className={styles['header__overview__bid__info--detail']}>
                {approvedCompletedBid.startAt > 0 && (
                  <div className={styles.header__overview__bid__info__box}>
                    <label>Start:</label>
                    <span>
                      {utilDate.toUserDateDisplay(approvedCompletedBid.startAt)}
                    </span>
                  </div>
                )}
                {approvedCompletedBid.completeAt > 0 && (
                  <div className={styles.header__overview__bid__info__box}>
                    <label>Complete:</label>
                    <span>
                      {utilDate.toUserDateDisplay(
                        approvedCompletedBid.completeAt
                      )}
                    </span>
                  </div>
                )}
                <div className={styles.header__overview__bid__info__box}>
                  <label>Cost:</label>
                  <span>{`$ ${bidRange}`}</span>
                </div>
                <div className={styles.header__overview__bid__info__box}>
                  <label>Scope:</label>
                  <span>{utilString.titleize(approvedCompletedBid.scope)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <MetaData
          bids={bids}
          bidStatus={bidStatus}
          filterState={filterState}
          colors={colors}
          changeFilterState={changeFilterState}
        />
      </div>
    </>
  );
};

Header.defaultProps = {};

export default Header;
