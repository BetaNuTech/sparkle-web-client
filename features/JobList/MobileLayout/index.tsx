import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import jobModel from '../../../common/models/job';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import JobSections from './JobSections';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  jobs,
  propertyId,
  colors,
  configJobs
}) => {
  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button className={headStyle.header__button}>
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
      <aside className={styles.mobileJobList__sortInfoLine}>
        Sorted by Last Updated
      </aside>
      <JobSections
        jobs={jobs}
        propertyId={propertyId}
        colors={colors}
        configJobs={configJobs}
      />
    </>
  );
};

export default MobileLayout;
