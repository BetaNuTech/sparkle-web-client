import { FunctionComponent } from 'react';
import clsx from 'clsx';
import getConfig from 'next/config';
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
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  job,
  bids,
  propertyId,
  colors,
  configBids
}) => {
  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';

  const newBidLink = `${basePath}/properties/${propertyId}/jobs/${job.id}/bids/new`;

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <Link href={newBidLink}>
        <a className={clsx(headStyle.header__button)}>
          <AddIcon />
        </a>
      </Link>
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
      <h1 data-testid="bid-job-title-mobile" className={styles.mobileTitle}>
        {job.title}
      </h1>
      <BidSections
        job={job}
        bids={bids}
        propertyId={propertyId}
        colors={colors}
        configBids={configBids}
      />
    </>
  );
};

export default MobileLayout;
