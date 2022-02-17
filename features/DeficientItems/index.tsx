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
import BulkUpdateModal from './BulkUpdateModal';
import {
  canGoBackDeficientItem,
  canCloseDeficientItem,
  canDeferDeficientItem
} from '../../common/utils/userPermissions';

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
  user,
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
  const [moveToStates, setMoveToStates] = useState(null);

  useEffect(() => {
    if (!searchParam) {
      setSearchQuery('');
    }
  }, [searchParam]);

  const onMoveToState = (currentState: string, nextState: string) => {
    console.log(currentState, nextState); // eslint-disable-line no-console
    setMoveToStates({ currentState, nextState });
  };

  const movingItemsLength = (
    selectedDeficiencies[moveToStates?.currentState] || []
  ).length;

  const canGoBack = canGoBackDeficientItem(user);
  const canClose = canCloseDeficientItem(user);
  const canDefer = canDeferDeficientItem(user);

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
        onMoveToState={onMoveToState}
        canGoBack={canGoBack}
        canClose={canClose}
        canDefer={canDefer}
      />

      <BulkUpdateModal
        isVisible={Boolean(moveToStates)}
        onClose={() => setMoveToStates(null)}
        movingItemsLength={movingItemsLength}
        nextState={moveToStates?.nextState}
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
