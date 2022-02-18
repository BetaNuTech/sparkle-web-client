import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
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
import useUpdateItem from '../../common/hooks/deficientItems/useUpdateItem';
import DeficientItemLocalUpdates from '../../common/models/deficientItems/unpublishedUpdates';
import DeficientItem from '../../common/models/deficientItem';

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
    onClearGroupSelection,
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

  const movingItems = selectedDeficiencies[moveToStates?.currentState] || [];

  const {
    updates,
    isSaving,
    updateState,
    updateCurrentReasonIncomplete,
    publish
  } = useUpdateItem(
    '',
    property.id,
    sendNotification,
    {} as DeficientItemLocalUpdates,
    {} as DeficientItem,
    user,
    true,
    movingItems
  );

  const canGoBack = canGoBackDeficientItem(user);
  const canClose = canCloseDeficientItem(user);
  const canDefer = canDeferDeficientItem(user);

  const onChangeReasonIncomplete = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentReasonIncomplete(evt.target.value);
  };

  const onGoBack = async () => {
    updateState('go-back');
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
  };

  const onUpdateIncomplete = async () => {
    updateState('incomplete');
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
  };

  const onCloseDI = async () => {
    updateState('closed');
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
  };

  const onCloseBulkUpdateModal = () => {
    if (!isSaving) {
      setMoveToStates(null);
    }
  };

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
        onClose={onCloseBulkUpdateModal}
        movingItems={movingItems}
        nextState={moveToStates?.nextState}
        deficientItems={deficientItems}
        user={user}
        isOnline={isOnline}
        updates={updates}
        isSaving={isSaving}
        onChangeReasonIncomplete={onChangeReasonIncomplete}
        onGoBack={onGoBack}
        onUpdateIncomplete={onUpdateIncomplete}
        onCloseDI={onCloseDI}
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
