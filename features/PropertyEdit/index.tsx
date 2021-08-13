import { FunctionComponent } from 'react';
import PropertyForm from './Form/index';
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

  return (
    <>
      <MobileHeader
        title="Property Edit"
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-properties-header"
      />

      <PropertyForm isOnline={isOnline} />
    </>
  );
};

export default PropertyEdit;
