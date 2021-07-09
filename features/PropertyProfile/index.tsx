import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './styles.module.scss';
import MobileHeader from '../../common/MobileHeader';
import useProperty from '../../common/hooks/useProperty';
import usePropertyInspections from './hooks/usePropertyInspections';
import useYardiIntegration from './hooks/useYardiIntegration';
import useInspectionFilter from './hooks/useInspectionFilter';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import SortIcon from '../../public/icons/sparkle/sort.svg';
import AddIcon from '../../public/icons/ios/add.svg';
import FolderIcon from '../../public/icons/ios/folder.svg';
import {
  activeInspectionFilterName,
  getInspectionNoRecordText,
  nextInspectionsFilter
} from './utils/inspectionFiltering';
import Header from './Header';
import Inspection from './Inspection';
import Overview from './Overview';
import Grid from './Grid';
import DeleteInspectionPropmpt from './DeleteInspectionPrompt';

interface PropertiesModel {
  user: userModel;
  id: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const PropertyProfile: FunctionComponent<PropertiesModel> = ({
  user,
  id,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const router = useRouter();
  // TODO:
  // const [sortBy, setSortBy] = useSortBy();
  const [inspectionFilter, setInspectionFilter] = useState('');

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, id);

  // Fetch all data in template categories
  const { data: templateCategories } = useTemplateCategories(firestore);

  // Query property inspection records
  const { data: inspections } = usePropertyInspections(firestore, id);

  // Query property inspection records
  const { data: yardiAuthorizer } = useYardiIntegration(firestore);

  // Inspection filtration on based of applied filter
  const { filteredInspections } = useInspectionFilter(
    inspectionFilter,
    inspections
  );

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Queue and Delete Property
  const [isDeleteInspectionPromptVisible, setDeleteInspectionPromptVisible] =
    useState(false);

  const openInspectionDeletePrompt = () => {
    setDeleteInspectionPromptVisible(true);
  };
  const closeDeleteInspctionPrompt = () => {
    setDeleteInspectionPromptVisible(false);
  };

  // Loop through inspections

  // TODO: sorting options
  // const nextInspectionsSort = () => {
  //   const activeSortValue = sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first

  //   // Update sorting
  //   setSortBy(activeSortValue);
  // };

  // Activate next inspection fitler in series
  const onToggleNextInspectionFilter = () => {
    const activeSortValue = nextInspectionsFilter(inspectionFilter);

    // Update filter
    setInspectionFilter(activeSortValue);
  };

  const isYardiConfigured =
    property && property.code && Object.keys(yardiAuthorizer).length > 0;

  // Loading State
  if (!property) {
    return <p>Loading property</p>;
  }

  // Display text for when filtered inspection does not have any records
  const noFilteredInspectionText =
    inspectionFilter && filteredInspections.length === 0
      ? getInspectionNoRecordText(inspectionFilter)
      : '';

  const onCreateInspection = () => {
    router.push(`/properties/${id}/create-inspection`);
  };

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button className={headStyle.header__button} onClick={onCreateInspection}>
        <AddIcon />
      </button>

      <button
        className={headStyle.header__button}
        data-testid="mobile-property-profile-sort-by"
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title=""
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
          />
          <div className={styles.propertyProfile}>
            <Header
              property={property}
              isYardiConfigured={isYardiConfigured}
              isMobile
            />
            <div className={clsx(styles.propertyProfile__main)}>
              {noFilteredInspectionText ? (
                <h4
                  className={clsx(
                    styles.propertyProfile__noInspectionMessage,
                    '-c-gray-light'
                  )}
                >
                  {noFilteredInspectionText}
                </h4>
              ) : (
                <Inspection
                  inspections={
                    filteredInspections.length > 0 || inspectionFilter
                      ? filteredInspections
                      : inspections
                  }
                  templateCategories={templateCategories}
                />
              )}
            </div>
            <footer className={styles.propertyProfile__footer}>
              <button
                className={clsx(
                  styles.propertyProfile__filter__icon,
                  '-pl-sm',
                  '-pr-sm',
                  '-outline-width-none'
                )}
                data-testid="inspections-filter"
                onClick={onToggleNextInspectionFilter}
              >
                <SortIcon />
              </button>
              {inspectionFilter && (
                <span className="-fz-medium">
                  {activeInspectionFilterName(inspectionFilter)}
                </span>
              )}
            </footer>
          </div>
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.propertyProfile}>
          <Header property={property} isYardiConfigured={isYardiConfigured} />
          <Overview
            property={property}
            inspections={inspections}
            isYardiConfigured={isYardiConfigured}
            setInspectionFilter={setInspectionFilter}
          />
          {
            // eslint-disable-next-line no-nested-ternary
            noFilteredInspectionText ? (
              <h4
                className={clsx(
                  styles.propertyProfile__noInspectionMessage,
                  '-c-gray-light'
                )}
              >
                {noFilteredInspectionText}
              </h4>
            ) : Array.isArray(inspections) && inspections.length > 0 ? (
              <Grid
                user={user}
                inspections={
                  filteredInspections.length > 0 || inspectionFilter
                    ? filteredInspections
                    : inspections
                }
                templateCategories={templateCategories}
                openInspectionDeletePrompt={openInspectionDeletePrompt}
              />
            ) : (
              <p
                className={styles.propertyProfile__createInspectionLink}
                data-testid="create-inspection-link"
              >
                <Link href="/properties/dvSsHLv8cxAvIMKv9Gk0/create-inspection">
                  <a className="-td-underline">Create first inspection</a>
                </Link>
              </p>
            )
          }
        </div>
      )}
      <DeleteInspectionPropmpt
        isVisible={isDeleteInspectionPromptVisible}
        onClose={closeDeleteInspctionPrompt}
      />
    </>
  );
};

PropertyProfile.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default PropertyProfile;
