import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import BidSections from './BidSections';
import styles from './styles.module.scss';

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
  forceVisible
}) => {
  const newBidLink = `/properties/${propertyId}/jobs/${job.id}/bids/new`;
  const jobListLink = `/properties/${propertyId}/jobs/`;
  const propertyLink = `/properties/${propertyId}/`;

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
        <div className={styles.header__info__breadcrumb}>
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
        </div>
        <h1 className={styles.header__info__title}>{job.title}</h1>
      </div>
      <BidSections
        job={job}
        bids={bids}
        propertyId={propertyId}
        colors={colors}
        configBids={configBids}
        forceVisible={forceVisible}
      />
    </>
  );
};

MobileLayout.defaultProps = {
  forceVisible: false
};

export default MobileLayout;
