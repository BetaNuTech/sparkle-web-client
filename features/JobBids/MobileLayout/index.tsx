import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import MobileHeader from '../../../common/MobileHeader';
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
  property,
  job,
  bids,
  propertyId,
  colors,
  configBids
}) => (
  <>
    <MobileHeader
      title={`Bids (${bids.length})`}
      toggleNavOpen={toggleNavOpen}
      isOnline={isOnline}
      isStaging={isStaging}
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

export default MobileLayout;
