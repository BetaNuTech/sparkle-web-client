import { FunctionComponent } from 'react';
import MobileHeader from '../../../common/MobileHeader';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import DesktopHeader from '../../../common/DesktopHeader';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';
import MobileSearchBar from '../../../common/MobileSearchBar';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  toggleNavOpen(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  toggleNavOpen
}) => {
  // Mobile Header right actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <LinkFeature
        href="/users/edit/new"
        legacyHref="/admin/users/add"
        featureEnabled={features.supportBetaUserEdit}
        className={headStyle.header__button}
      >
        <AddIcon />
      </LinkFeature>

      <button className={headStyle.header__button}>
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            toggleNavOpen={toggleNavOpen}
            isStaging={isStaging}
            title="Users"
            actions={mobileHeaderActions}
          />
          <MobileSearchBar
            searchQuery=""
            onChange={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
            onClearSearch={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
          />
          <div className={styles.sortInfoLine}>Sorted by Access Level</div>
        </>
      ) : (
        <DesktopHeader
          title={<span>Users</span>}
          isOnline={isOnline}
          isColumnTitle
        />
      )}
    </>
  );
};

export default Header;
