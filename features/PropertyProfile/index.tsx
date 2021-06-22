import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './styles.module.scss';
import { sorts } from '../Properties/utils/propertiesSorting';
import { useSortBy } from '../Properties/hooks/sorting';
import { MobileHeader } from '../Properties/MobileHeader';
import {fullProperty} from '../../__mocks__/properties';
import Header from './Header';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';

interface PropertiesModel {
  user: userModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const Properties: FunctionComponent<PropertiesModel> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const [sortBy, setSortBy] = useSortBy();
  const propertyProfile = {...fullProperty};

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });


  // Recalculate properties when properties or teams changes.

  // Loop through property
  // sorting options
  const nextPropertiesSort = () => {
    const activeSortValue = sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first

    // Update Property sort
    setSortBy(activeSortValue);
  };

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title=""
            toggleNavOpen={toggleNavOpen}
            nextPropertiesSort={nextPropertiesSort}
            isOnline={isOnline}
            isStaging={isStaging}
          />
          <div className={styles.propertyProfile}>
            <Header property={propertyProfile} isMobile />
          </div>
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.propertyProfile}>
          <Header property={propertyProfile} />
        </div>
      )}
    </>
  );
};

Properties.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default Properties;
