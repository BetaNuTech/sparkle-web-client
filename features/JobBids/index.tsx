import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import { useMediaQuery } from 'react-responsive';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import useJobBids from '../../common/hooks/useJobBids';
import useFilterState from '../../common/hooks/useFilterState';
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
  forceVisible?: boolean;
}

const colors = {
  primary: '-bgc-primary',
  secondary: '-bgc-secondary',
  gray: '-bgc-gray-light',
  info: '-bgc-info',
  alert: '-bgc-alert',
  orange: '-bgc-orange',
  purple: '-bgc-quaternary'
};

const JobBids: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const { data: job } = useJob(firestore, jobId);

  // Fetch all jobs for property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status: bidStatus, data: bids } = useJobBids(firestore, jobId);

  // Bid filter by state
  const { stateItems, filterState, changeFilterState } = useFilterState(bids);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Job sorting setup
  const { sortedBids, sortBy, sortDir, onSortChange } = useBidSorting(
    stateItems,
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
          forceVisible={forceVisible}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <>
          <Header
            property={property}
            bids={bids}
            bidStatus={bidStatus}
            job={job}
            filterState={filterState}
            colors={colors}
            changeFilterState={changeFilterState}
            isOnline={isOnline}
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
            filterState={filterState}
            forceVisible={forceVisible}
          />
        </>
      )}
    </>
  );
};

JobBids.defaultProps = {
  forceVisible: false
};

export { colors };
export default JobBids;
