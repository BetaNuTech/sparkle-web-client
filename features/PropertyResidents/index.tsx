import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import ResidentModel from '../../common/models/yardi/resident';
import OccupantModel from '../../common/models/yardi/occupant';
import PropertyModel from '../../common/models/property';
import ResidenceList from './List';
import Header from './Header';
import breakpoints from '../../config/breakpoints';
import SearchBar from '../../common/SearchBar';
import styles from './styles.module.scss';
import useSearching from '../../common/hooks/useSearching';
import search from '../../common/utils/search';

const queryAttrs = [
  'email',
  'eviction',
  'firstName',
  'homeNumber',
  'lastName',
  'lastNote',
  'leaseFrom',
  'leaseSqFt',
  'leaseTo',
  'leaseUnit',
  'middleName',
  'mobileNumber',
  'moveIn',
  'paymentPlan',
  'paymentPlanDelinquent',
  'status',
  'totalCharges',
  'totalOwed',
  'yardiStatus',
  'sortLeaseUnit',
  'sortLeaseUnit'
];

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  residents: ResidentModel[];
  occupants: OccupantModel[];
  property: PropertyModel;
}

const PropertyResidents: FunctionComponent<Props> = ({
  isStaging,
  isOnline,
  residents,
  property,
  forceVisible
}) => {
  // create indexes for resident's occupant
  const residentsForFilter = residents.map((resident) => {
    const indexes = search.createSearchIndex(
      resident.occupants || [],
      queryAttrs
    );

    return { ...resident, occupantsString: Object.values(indexes).join(' ') };
  });

  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(residentsForFilter, [...queryAttrs, 'occupantsString']);

  const filteredResidents = filteredItems.map((item) => item as ResidentModel);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    <>
      <Header
        property={property}
        isMobile={isMobile}
        isStaging={isStaging}
        isOnline={isOnline}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
      <div className={styles.container}>
        {!isMobile && (
          <SearchBar
            searchQuery={searchValue}
            onSearchKeyDown={onSearchKeyDown}
            onClearSearch={onClearSearch}
          />
        )}

        <ResidenceList
          residents={filteredResidents}
          isMobile={isMobile}
          forceVisible={forceVisible}
        />
        {searchValue && (
          <div className={styles.action}>
            <button className={styles.action__clear} onClick={onClearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyResidents;
