import { FunctionComponent, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import StateGroups from './StateGroups';
import Header from './Header';
import useSorting from './hooks/useSorting';
import useSelectionsAndSearch from './hooks/useSelectionsAndSearch';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  user: userModel;
  property: propertyModel;
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
  sendNotification: userNotifications;
  toggleNavOpen?(): void;
}

const DeficientItems: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  deficientItems,
  property,
  forceVisible,
  sendNotification,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Sort properties
  const {
    sortedDeficientItems,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextDeficientItemSort,
    onSortChange,
    onSortDirChange
  } = useSorting(deficientItems, isMobile ? 'asc' : 'desc');

  const {
    selectedDeficiencies,
    onGroupSelection,
    onSelectDeficiency,
    onSearchKeyDown,
    deficientItemsByState,
    searchParam,
    onClearSearch
  } = useSelectionsAndSearch(
    sortedDeficientItems,
    property.id,
    sendNotification
  );

  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    if (!searchParam) {
      setSearchQuery('');
    }
  }, [searchParam]);

  return (
    <>
      <Header
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        sortBy={sortBy}
        sortDir={sortDir}
        nextDeficientItemSort={nextDeficientItemSort}
        userFacingSortBy={userFacingSortBy}
        onSortChange={onSortChange}
        onSortDirChange={onSortDirChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        toggleNavOpen={toggleNavOpen}
      />
      <StateGroups
        deficientItemsByState={deficientItemsByState}
        forceVisible={forceVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        isMobile={isMobile}
        onGroupSelection={onGroupSelection}
        onSelectDeficiency={onSelectDeficiency}
        selectedDeficiencies={selectedDeficiencies}
      />
    </>
  );
};

DeficientItems.defaultProps = {
  isOnline: false,
  isStaging: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default DeficientItems;
