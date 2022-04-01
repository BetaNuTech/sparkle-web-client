import { ChangeEvent, FunctionComponent, RefObject } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import { activeJobSortFilter } from '../utils/jobSorting';
import JobSections from './JobSections';
import MobileSearchBar from '../../../common/MobileSearchBar';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  property: propertyModel;
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string> | any>;
  onSortChange?(): void;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
  sortBy?: string;
  searchParam?: string;
  searchQuery?: string;
  forceVisible?: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  property,
  jobs,
  propertyId,
  colors,
  configJobs,
  onSortChange,
  onSearchKeyDown,
  onClearSearch,
  sortBy,
  searchParam,
  searchQuery,
  forceVisible,
  scrollElementRef
}) => {
  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button
        className={headStyle.header__button}
        onClick={onSortChange}
        data-testid="mobile-header-sort"
      >
        <FolderIcon />
      </button>
      <Link href={`/properties/${propertyId}/jobs/edit/new`}>
        <a className={clsx(headStyle.header__button)}>
          <AddIcon />
        </a>
      </Link>
    </>
  );

  return (
    <>
      <MobileHeader
        title={`Jobs (${jobs.length})`}
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-joblist-header"
      />
      <MobileSearchBar
        searchQuery={searchQuery}
        onChange={onSearchKeyDown}
        onClearSearch={onClearSearch}
        placeholder={`Search ${property.name} Jobs`}
        data-testid="job-search-box"
      />

      <aside
        className={styles.mobileJobList__sortInfoLine}
        data-testid="mobile-sort-text"
      >
        Sorted by {activeJobSortFilter(sortBy)}
      </aside>
      <JobSections
        jobs={jobs}
        propertyId={propertyId}
        colors={colors}
        configJobs={configJobs}
        searchParam={searchParam}
        forceVisible={forceVisible}
        scrollElementRef={scrollElementRef}
        onClearSearch={onClearSearch}
      />
    </>
  );
};

MobileLayout.defaultProps = {
  forceVisible: false
};

export default MobileLayout;
