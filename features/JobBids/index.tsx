import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import { useMediaQuery } from 'react-responsive';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import useJobBids from '../../common/hooks/useJobBids';
import configBids from '../../config/bids';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import useBidSorting from './hooks/useBidSorting';
import MobileLayout from './MobileLayout';
import Header from './Header';
import Grid from './Grid';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const colors = {
  primary: '-bgc-primary',
  secondary: '-bgc-secondary',
  gray: '-bgc-gray-light',
  info: '-bgc-info',
  alert: '-bgc-alert',
  orange: '-bgc-orange'
};

const JobBids: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const { data: job } = useJob(firestore, jobId);

  // Fetch all jobs for property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status: bidStatus, data: bids } = useJobBids(firestore, jobId);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Job sorting setup
  const { sortedBids, sortBy, sortDir, onSortChange } = useBidSorting(
    bids,
    isMobileorTablet
  );

  // Loading State
  if (!property || !job) {
    return <LoadingHud title="Loading Bids" />;
  }

  return (
    <>
      {isMobileorTablet && (
        <MobileLayout
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          property={property}
          job={job}
          bids={sortedBids}
          propertyId={propertyId}
          colors={colors}
          configBids={configBids}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div>
          <Header
            property={property}
            bids={bids}
            bidStatus={bidStatus}
            job={job}
          />
          <Grid
            job={job}
            bids={sortedBids}
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            propertyId={propertyId}
            colors={colors}
            configBids={configBids}
          />
        </div>
      )}
    </>
  );
};

JobBids.defaultProps = {};

export { colors };
export default JobBids;
