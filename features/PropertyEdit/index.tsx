import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import PropertyMobileForm from './MobileForm/index';
import PropertyDesktopForm from './DesktopForm/index';
import MobileHeader from '../../common/MobileHeader/index';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  toggleNavOpen(): void;
  isStaging: boolean;
}

const PropertyEdit: FunctionComponent<Props> = ({
  toggleNavOpen,
  isOnline,
  isStaging
}) => {
  //   Mobile header save button
  const mobileHeaderActions = () => (
    <button data-testid="mobile-header-button" className={styles.saveButton}>
      Save
    </button>
  );
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    isMobileorTablet ? (
      <>
        <MobileHeader
          title="Property Edit"
          toggleNavOpen={toggleNavOpen}
          isOnline={isOnline}
          isStaging={isStaging}
          actions={mobileHeaderActions}
          testid="mobile-properties-header"
        />
        <PropertyMobileForm isOnline={isOnline} />
      </>
    ):(
      <PropertyDesktopForm isOnline={isOnline} />
    )
  );
};

export default PropertyEdit;
