import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import clsx from 'clsx';
import Link from 'next/link';
import features from '../../config/features';
import LinkFeature from '../../common/LinkFeature';
import MobileHeader from '../../common/MobileHeader';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import { canAccessJobs } from '../../common/utils/userPermissions';
import usePropertyInspections from './hooks/usePropertyInspections';
import useInspectionSorting from './hooks/useInspectionSorting';
import useYardiIntegration from './hooks/useYardiIntegration';
import useInspectionFilter from './hooks/useInspectionFilter';
import { activeInspectionSortFilter } from './utils/inspectionSorting';
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
import styles from './styles.module.scss';

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

  const {
    sortedInspections,
    sortBy,
    sortDir,
    onMobileSortChange,
    onSortChange
  } = useInspectionSorting(inspectionFilter, filteredInspections, inspections);

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
    return <LoadingHud title="Loading Property" />;
  }

  // Display text for when filtered inspection does not have any records
  const noFilteredInspectionText =
    inspectionFilter && filteredInspections.length === 0
      ? getInspectionNoRecordText(inspectionFilter)
      : '';

  // Check if user can access jobs
  const canUserAccessJob = canAccessJobs(user, property.id);

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <LinkFeature
        href={`/properties/${id}/create-inspection`}
        className={headStyle.header__button}
        featureEnabled={features.supportBetaPropertyInspectionCreate}
      >
        <AddIcon />
      </LinkFeature>

      <button
        className={headStyle.header__button}
        data-testid="mobile-property-profile-sort-by"
        onClick={onMobileSortChange}
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
              canUserAccessJob={canUserAccessJob}
              property={property}
              isYardiConfigured={isYardiConfigured}
              isMobile
              sortBy={sortBy}
              activeInspectionSortFilter={activeInspectionSortFilter}
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
                  inspections={sortedInspections}
                  templateCategories={templateCategories}
                  propertyId={id}
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
          <Header
            canUserAccessJob={canUserAccessJob}
            property={property}
            isYardiConfigured={isYardiConfigured}
          />
          <Overview
            canUserAccessJob={canUserAccessJob}
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
                propertyId={id}
                inspections={sortedInspections}
                templateCategories={templateCategories}
                openInspectionDeletePrompt={openInspectionDeletePrompt}
                onSortChange={onSortChange}
                sortBy={sortBy}
                sortDir={sortDir}
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
