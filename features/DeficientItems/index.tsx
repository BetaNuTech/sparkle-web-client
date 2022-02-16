import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import utilArray from '../../common/utils/array';
import StateGroups from './StateGroups';
import Header from './Header';
import useSearching from '../../common/hooks/useSearching';
import useSorting from './hooks/useSorting';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  user: userModel;
  property: propertyModel;
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
  toggleNavOpen?(): void;
}

const DeficientItems: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  deficientItems,
  property,
  forceVisible,
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

  const { onSearchKeyDown, filteredItems, searchParam, onClearSearch } =
    useSearching(sortedDeficientItems, [
      'itemTitle',
      'sectionTitle',
      'sectionSubTitle'
    ]);

  const filteredDeficientItems = filteredItems.map(
    (item) => item as deficientItemModel
  );

  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    if (!searchParam) {
      setSearchQuery('');
    }
  }, [searchParam]);

  // Grouping of deficient items by state
  const deficientItemsByState = useMemo(
    () =>
      utilArray.groupBy<string, deficientItemModel>(
        filteredDeficientItems,
        (item) => item.state
      ),
    [filteredDeficientItems]
  );

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
