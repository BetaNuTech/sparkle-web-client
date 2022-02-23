import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import useFilterState from '../../common/hooks/useFilterState';
import configBids from '../../config/bids';
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import breakpoints from '../../config/breakpoints';
import useBidSorting from './hooks/useBidSorting';
import MobileLayout from './MobileLayout';
import Header from './Header';
import Grid from './Grid';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';

interface Props {
  user: userModel;
  property: propertyModel;
  job: jobModel;
  bids: Array<bidModel>;
  bidStatus: string;
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

const textColors = {
  primary: '-c-primary',
  secondary: '-c-secondary',
  gray: '-c-gray-light',
  info: '-c-info',
  alert: '-c-alert',
  orange: '-c-orange',
  purple: '-c-quaternary'
};

const JobBids: FunctionComponent<Props> = ({
  property,
  job,
  bids,
  bidStatus,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible
}) => {
  // Bid filter by state
  const { stateItems, filterState, changeFilterState } = useFilterState(bids);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const scrollElementRef = useRef();

  usePreserveScrollPosition(
    `BidScroll-${job.id}`,
    scrollElementRef,
    isMobileorTablet
  );

  // Job sorting setup
  const { sortedBids, sortBy, sortDir, onSortChange } = useBidSorting(
    stateItems,
    isMobileorTablet
  );

  const bidsRequired = job.minBids - bids.length;

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
          propertyId={property.id}
          colors={colors}
          configBids={configBids}
          forceVisible={forceVisible}
          bidsRequired={bidsRequired}
          scrollElementRef={scrollElementRef}
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
            textColors={textColors}
            changeFilterState={changeFilterState}
            isOnline={isOnline}
            bidsRequired={bidsRequired}
          />
          <Grid
            job={job}
            bids={sortedBids}
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            propertyId={property.id}
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

export { colors, textColors };
export default JobBids;
