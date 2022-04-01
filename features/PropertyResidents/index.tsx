import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ResidentModel from '../../common/models/yardi/resident';
import OccupantModel from '../../common/models/yardi/occupant';
import PropertyModel from '../../common/models/property';
import ResidenceList from './List';
import Header from './Header';
import breakpoints from '../../config/breakpoints';
import SearchBar, { ClearSearchAction } from '../../common/SearchBar';
import styles from './styles.module.scss';
import useSearchingAndSorting from './hooks/useSearchingAndSorting';
import ContactModal from '../../common/Yardi/ContactModal';

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
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const [selectedResident, setSelectedResident] = useState(null);
  const onClickResident = (resident: ResidentModel) => {
    setSelectedResident(resident);
  };
  // Sort properties
  const {
    sortDir,
    sortBy,
    userFacingSortBy,
    nextResidentsSort,
    onSortChange,
    onSortDirChange,
    searchValue,
    onClearSearch,
    onSearchKeyDown,
    filteredResidents,
    onFilterByStatus,
    onNextResidentFilterByStatus,
    activeFilter
  } = useSearchingAndSorting(residents, 'asc');

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
        sortDir={sortDir}
        sortBy={sortBy}
        userFacingSortBy={userFacingSortBy}
        nextResidentsSort={nextResidentsSort}
        onSortChange={onSortChange}
        onSortDirChange={onSortDirChange}
        onFilterByStatus={onFilterByStatus}
        onNextResidentFilterByStatus={onNextResidentFilterByStatus}
        activeFilter={activeFilter}
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
          onClickResident={onClickResident}
          activeFilter={activeFilter}
          searchValue={searchValue}
        />
        <ClearSearchAction
          searchQuery={searchValue}
          onClearSearch={onClearSearch}
        />
      </div>
      <ContactModal
        isVisible={Boolean(selectedResident)}
        onClose={() => setSelectedResident(null)}
        data={selectedResident}
        type="resident"
      />
    </>
  );
};

export default PropertyResidents;
