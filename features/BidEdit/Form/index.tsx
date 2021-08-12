import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import getConfig from 'next/config';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import utilString from '../../../common/utils/string';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import bidsConfig from '../../../config/bids';
import Header from '../Header';
import styles from '../styles.module.scss';

interface Props {
  property: propertyModel;
  job: jobModel;
  bid: bidModel;
  isNewBid: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

interface LayoutProps {
  isMobile: boolean;
  job: jobModel;
  bid: bidModel;
  isNewBid: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({
  isMobile,
  job,
  bid,
  isNewBid
}) => {
  const nextState = !isNewBid && bidsConfig.nextState[bid.state];
  return (
    <div className={styles.form__grid}>
      {!isNewBid && (
        <>
          {isMobile && (
            <h1
              data-testid="bid-form-title-mobile"
              className={styles.mobileTitle}
            >
              {job.title}
            </h1>
          )}
          <div className={styles.bid__info}>
            <div className={styles.bid__info__box}>
              <p>Bid Status{!isMobile && <> :&nbsp;</>}</p>
              <h3 data-testid="bid-form-edit-state">
                {utilString.titleize(bid.state)}
              </h3>
            </div>
            {nextState && (
              <div className={styles.bid__info__box}>
                <p>Requires{!isMobile && <> :&nbsp;</>}</p>
                <h3 data-testid="bid-form-edit-nextstatus">{nextState}</h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const JobForm: FunctionComponent<Props> = ({
  property,
  job,
  bid,
  isNewBid,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });
  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';
  const bidLink = `${basePath}/properties/${property.id}/jobs/${job.id}/bids`;

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <div
        className={clsx(
          headStyle.header__button,
          headStyle['header__button--dropdown'],
          styles.bidNew__header__icon
        )}
      ></div>
    </>
  );

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title={isNewBid ? 'Create New Bid' : `${property.name} Job Bid`}
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.bidNew__header}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            isNewBid={isNewBid}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          <Header
            property={property}
            job={job}
            isNewBid={isNewBid}
            bidLink={bidLink}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            isNewBid={isNewBid}
          />
        </div>
      )}
    </>
  );
};

export default JobForm;
