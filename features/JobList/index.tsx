import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import styles from './styles.module.scss';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import jobModel from '../../common/models/job';
import useSearching from '../../common/hooks/useSearching';
import useFilterState from '../../common/hooks/useFilterState';
import configJobs from '../../config/jobs';
import breakpoints from '../../config/breakpoints';
import usePropertyJobs from './hooks/usePropertyJobs';
import useJobSorting from './hooks/useJobSorting';
import Header from './Header';
import MobileLayout from './MobileLayout';
import Grid from './Grid';

interface Props {
  user: userModel;
  propertyId: string;
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
  green: '-bgc-sea-green',
  info: '-bgc-info',
  alert: '-bgc-alert',
  orange: '-bgc-orange',
  purple: '-bgc-quaternary'
};

const JobList: FunctionComponent<Props> = ({
  propertyId,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch all jobs for property
  const { status: jobStatus, data: jobs } = usePropertyJobs(
    firestore,
    propertyId
  );

  // Job filter by state
  const { stateItems, filterState, changeFilterState } = useFilterState(jobs);

  // Job search setup
  const { onSearchKeyDown, filteredItems, searchParam } = useSearching(
    stateItems,
    ['title', 'type']
  );
  const filteredJobs = filteredItems.map((itm) => itm as jobModel);

  // Job sorting setup
  const { sortedJobs, sortBy, sortDir, onMobileSortChange, onSortChange } =
    useJobSorting(searchParam, filteredJobs, jobs);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Loading State
  if (!property) {
    return <LoadingHud title="Loading Jobs" />;
  }

  return (
    <>
      {isMobileorTablet && (
        <MobileLayout
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          property={property}
          jobs={sortedJobs}
          propertyId={propertyId}
          colors={colors}
          configJobs={configJobs}
          onSortChange={onMobileSortChange}
          sortBy={sortBy}
          onSearchKeyDown={onSearchKeyDown}
          searchParam={searchParam}
          forceVisible={forceVisible}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.properties__container}>
          <Header
            property={property}
            jobs={jobs}
            jobStatus={jobStatus}
            filterState={filterState}
            changeJobFilterState={changeFilterState}
            colors={colors}
            isOnline={isOnline}
          />
          <Grid
            jobs={sortedJobs}
            propertyId={propertyId}
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            onSearchKeyDown={onSearchKeyDown}
            searchParam={searchParam}
            colors={colors}
            configJobs={configJobs}
            filterState={filterState}
            forceVisible={forceVisible}
          />
        </div>
      )}
    </>
  );
};

JobList.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export { colors };
export default JobList;
