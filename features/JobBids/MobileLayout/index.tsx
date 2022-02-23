import { FunctionComponent, RefObject } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import utilDate from '../../../common/utils/date';
import utilString from '../../../common/utils/string';
import BidSections from './BidSections';
import styles from './styles.module.scss';
import sectionStyle from './BidSections/styles.module.scss';
import useBidApprovedCompleted from '../../../common/hooks/useBidApprovedCompleted';
import useBidsCost from '../hooks/useBidsCost';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  property: propertyModel;
  job: jobModel;
  bids: Array<bidModel>;
  propertyId: string;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
  forceVisible?: boolean;
  bidsRequired?: number;
  scrollElementRef: RefObject<HTMLDivElement>;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  job,
  bids,
  property,
  propertyId,
  colors,
  configBids,
  forceVisible,
  bidsRequired,
  scrollElementRef
}) => {
  const newBidLink = `/properties/${propertyId}/jobs/${job.id}/bids/new`;
  const jobListLink = `/properties/${propertyId}/jobs/`;
  const jobEditLink = `/properties/${propertyId}/jobs/edit/${job.id}/`;
  const propertyLink = `/properties/${propertyId}/`;

  const { approvedCompletedBid } = useBidApprovedCompleted(bids);
  const bidRange = approvedCompletedBid && useBidsCost(approvedCompletedBid);

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {['open', 'complete'].includes(job.state) ? null : (
        <Link href={newBidLink}>
          <a className={clsx(headStyle.header__button)}>
            <AddIcon />
          </a>
        </Link>
      )}
    </>
  );
  return (
    <>
      <MobileHeader
        title={`Bids (${bids.length})`}
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-bidlist-header"
      />
      <div className={styles.header__info__main}>
        <div className={styles.header__info__main__top}>
          <nav className={styles.header__info__breadcrumb}>
            <Link href={propertyLink}>
              <a
                className={styles.header__info__breadcrumb__text}
              >{`${property.name}`}</a>
            </Link>
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <Link href={jobListLink}>
              <a className={styles.header__info__breadcrumb__text}>Jobs</a>
            </Link>
            <span className={styles.header__info__breadcrumb}>
              &nbsp;&nbsp;/&nbsp;&nbsp;Bids
            </span>
          </nav>
          {bidsRequired > 0 ? (
            <span
              className={styles.header__sideMeta}
              data-testid="bids-required"
            >
              {`+${bidsRequired} bid${bidsRequired > 1 ? 's' : ''} required`}
            </span>
          ) : (
            <span
              className={clsx(
                styles.header__sideMeta,
                styles['header__sideMeta--satisfied']
              )}
              data-testid="bids-requirement-met"
            >
              (Bid requirements met)
            </span>
          )}
        </div>
        <div
          className={clsx(
            styles.header__info__main__top,
            styles['header__info__main__top--verticalAlign']
          )}
        >
          <h1 className={styles.header__info__title}>{job.title}</h1>
          <Link href={jobEditLink}>
            <a className={styles.header__info__link}>View Job</a>
          </Link>
        </div>
      </div>
      {approvedCompletedBid && (
        <div
          className={sectionStyle.bidList__selected}
          data-testid="bid-approved-completed"
        >
          <header
            className={clsx(
              sectionStyle.bidList__box__header,
              colors[configBids.stateColors[approvedCompletedBid.state]]
            )}
            data-testid="bid-approved-completed-title"
          >
            {approvedCompletedBid.state}
          </header>
          <div className={sectionStyle.bidList__record}>
            <Link
              href={`/properties/${propertyId}/jobs/${job.id}/bids/${approvedCompletedBid.id}`}
            >
              <a
                className={clsx(
                  sectionStyle['bidList__record__link--selected']
                )}
              >
                <div className={clsx(sectionStyle.bidList__record__link)}>
                  <div>
                    <h3
                      className={sectionStyle.bidList__record__title}
                      data-testid="mobile-row-bid-title"
                    >
                      {approvedCompletedBid.vendor}
                    </h3>
                    {approvedCompletedBid.startAt > 0 && (
                      <div>
                        <strong className="-c-black">Start:</strong>{' '}
                        <span
                          className="-c-gray-light"
                          data-testid="mobile-row-bid-starat"
                        >
                          {utilDate.toUserDateDisplay(
                            approvedCompletedBid.startAt
                          )}
                        </span>
                      </div>
                    )}
                    {approvedCompletedBid.completeAt > 0 && (
                      <div data-testid="bid-completed-time">
                        <strong className="-c-black">Complete:</strong>{' '}
                        <span
                          className="-c-gray-light"
                          data-testid="mobile-row-bid-completeat"
                        >
                          {utilDate.toUserDateDisplay(
                            approvedCompletedBid.completeAt
                          )}
                        </span>
                      </div>
                    )}
                    <div>
                      <strong className="-c-black">Scope:</strong>{' '}
                      <span
                        className="-c-gray-light"
                        data-testid="mobile-row-bid-scope"
                      >
                        {utilString.titleize(approvedCompletedBid.scope)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={clsx(sectionStyle.bidList__record__range)}
                      data-testid="mobile-row-bid-range"
                    >
                      {`$ ${bidRange}`}
                    </span>
                  </div>
                </div>

                {(approvedCompletedBid.vendorW9 ||
                  approvedCompletedBid.vendorInsurance ||
                  approvedCompletedBid.vendorLicense) && (
                  <div
                    className={sectionStyle['bidList__selected--complaince']}
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
              </a>
            </Link>
          </div>
        </div>
      )}
      <BidSections
        job={job}
        bids={bids}
        propertyId={propertyId}
        colors={colors}
        configBids={configBids}
        forceVisible={forceVisible}
        scrollElementRef={scrollElementRef}
      />
    </>
  );
};

MobileLayout.defaultProps = {
  forceVisible: false
};

export default MobileLayout;
