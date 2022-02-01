import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import clsx from 'clsx';
import Link from 'next/link';
import features from '../../config/features';
import LinkFeature from '../../common/LinkFeature';
import MobileHeader from '../../common/MobileHeader';
import LoadingHud from '../../common/LoadingHud';
import { canAccessJobs } from '../../common/utils/userPermissions';
import useInspectionSorting from './hooks/useInspectionSorting';
import useInspectionFilter from './hooks/useInspectionFilter';
import { activeInspectionSortFilter } from './utils/inspectionSorting';
import useDeleteInspection from './hooks/useDeleteInspection';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
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
import propertyModel from '../../common/models/property';
import templateCategoryModel from '../../common/models/templateCategory';
import inspectionModel from '../../common/models/inspection';

interface Props {
  user: userModel;
  id: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  property: propertyModel;
  templateCategories: templateCategoryModel[];
  inspections: inspectionModel[];
  yardiAuthorizer: any;
}

const PropertyProfile: FunctionComponent<Props> = ({
  user,
  id,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible,
  property,
  templateCategories,
  inspections,
  yardiAuthorizer
}) => {
  const firestore = useFirestore();
  const [inspectionFilter, setInspectionFilter] = useState('');

  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

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

  // Queue and Delete Inspection
  const [isDeleteInspectionPromptVisible, setDeleteInspectionPromptVisible] =
    useState(false);
  const { queueInspectionForDelete, confirmInspectionDelete } =
    useDeleteInspection(firestore, sendNotification, user);
  const openInspectionDeletePrompt = (inspection: inspectionModel) => {
    queueInspectionForDelete(inspection);
    setDeleteInspectionPromptVisible(true);
  };
  const closeDeleteInspctionPrompt = () => {
    setDeleteInspectionPromptVisible(false);
    queueInspectionForDelete(null);
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
            title={property.name}
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
            />
            <div
              className={clsx(styles.subHeader)}
              data-testid="property-profile-mobile-subHeader"
            >
              Sorted by {`${activeInspectionSortFilter(sortBy)}`}
            </div>
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
                  openInspectionDeletePrompt={openInspectionDeletePrompt}
                  templateCategories={templateCategories}
                  propertyId={id}
                  forceVisible={forceVisible}
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
                forceVisible={forceVisible}
              />
            ) : (
              <p
                className={styles.propertyProfile__createInspectionLink}
                data-testid="create-inspection-link"
              >
                <Link href={`/properties/${id}/create-inspection`}>
                  <a className="-td-underline">Create first inspection</a>
                </Link>
              </p>
            )
          }
        </div>
      )}
      <DeleteInspectionPropmpt
        onConfirm={confirmInspectionDelete}
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
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default PropertyProfile;
