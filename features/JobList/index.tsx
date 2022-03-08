import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './styles.module.scss';
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import useSearching from '../../common/hooks/useSearching';
import useFilterState from '../../common/hooks/useFilterState';
import configJobs from '../../config/jobs';
import breakpoints from '../../config/breakpoints';
import useJobSorting from './hooks/useJobSorting';
import Header from './Header';
import MobileLayout from './MobileLayout';
import Grid from './Grid';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';

interface Props {
  user: userModel;
  property: propertyModel;
  jobs: Array<jobModel>;
  jobStatus: string;
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

const textColors = {
  primary: '-c-primary',
  secondary: '-c-secondary',
  gray: '-c-gray-light',
  green: '-c-sea-green',
  info: '-c-info',
  alert: '-c-alert',
  orange: '-c-orange',
  purple: '-c-quaternary'
};

const JobList: FunctionComponent<Props> = ({
  property,
  jobs,
  jobStatus,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible
}) => {
  // Job filter by state
  const { stateItems, filterState, changeFilterState } = useFilterState(jobs);

  // Job search setup
  const {
    onSearchKeyDown,
    filteredItems,
    searchParam,
    searchValue,
    onClearSearch
  } = useSearching(stateItems, ['title', 'type']);
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

  const scrollElementRef = useRef();

  usePreserveScrollPosition(
    `PropertyJobsScroll-${property.id}`,
    scrollElementRef,
    isMobileorTablet
  );

  return (
    <>
      {isMobileorTablet && (
        <MobileLayout
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          property={property}
          jobs={sortedJobs}
          propertyId={property.id}
          colors={colors}
          configJobs={configJobs}
          onSortChange={onMobileSortChange}
          sortBy={sortBy}
          onSearchKeyDown={onSearchKeyDown}
          onClearSearch={onClearSearch}
          searchParam={searchParam}
          searchQuery={searchValue}
          forceVisible={forceVisible}
          scrollElementRef={scrollElementRef}
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
            propertyId={property.id}
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            onSearchKeyDown={onSearchKeyDown}
            searchParam={searchParam}
            searchQuery={searchValue}
            onClearSearch={onClearSearch}
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

export { colors, textColors };
export default JobList;
