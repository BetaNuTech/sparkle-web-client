import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  jobCount: number;
  propertyId: string;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  jobCount,
  propertyId
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
        title={`Jobs (${jobCount})`}
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
      />
    </>
  );
};

export default MobileLayout;
