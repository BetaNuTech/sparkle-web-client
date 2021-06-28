import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { sorts } from '../Properties/utils/propertiesSorting';
import { useSortBy } from '../Properties/hooks/sorting';
import { MobileHeader } from '../Properties/MobileHeader';
import { fullProperty } from '../../__mocks__/properties';
import inspectionsMock from '../../__mocks__/inspections';
import templateCategoriesMock from '../../__mocks__/templateCategories';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import SortIcon from '../../public/icons/sparkle/sort.svg';
import Header from './Header';
import Inspection from './Inspection';
import Overview from './Overview';

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
  const propertyProfile = { ...fullProperty };

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
  // TODO: Add logic to check code and yardiAuthorizer
  const isYardiConfigured = propertyProfile.code && true;

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
            <Header
              property={propertyProfile}
              isYardiConfigured={isYardiConfigured}
              isMobile
            />
            <div
              className={clsx(
                styles.propertyProfile__main,
                styles.stickyBoundingBox
              )}
            >
              <Inspection
                inspections={inspectionsMock}
                templateCategories={templateCategoriesMock}
              />
            </div>
            <footer className={styles['spk-footer']}>
              <button
                className={clsx(
                  styles['spk-non-button'],
                  styles['-pl-sm'],
                  styles['-pr-sm'],
                  styles['-outline-width-none']
                )}
              >
                <SortIcon />
              </button>
            </footer>
          </div>
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.propertyProfile}>
          <Header
            property={propertyProfile}
            isYardiConfigured={isYardiConfigured}
          />
          <Overview
            property={propertyProfile}
            inspections={inspectionsMock}
            isYardiConfigured={isYardiConfigured}
          />
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
