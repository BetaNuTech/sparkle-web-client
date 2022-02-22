import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState
} from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import PropertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import UserModel from '../../common/models/user';
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
import dateUtils from '../../common/utils/date';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  user: UserModel;
  property: PropertyModel;
  deficientItems: DeficientItemModel[];
  forceVisible?: boolean;
  sendNotification: userNotifications;
  toggleNavOpen?(): void;
}

const DeficientItemsList: FunctionComponent<Props> = ({
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

  const containerRef = useRef();

  usePreserveScrollPosition(`DIScroll-${property.id}`, containerRef, isMobile);

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [moveToStates, setMoveToStates] = useState(null);

  useEffect(() => {
    if (!searchParam) {
      setSearchQuery('');
    }
  }, [searchParam]);

  const onMoveToState = (currentState: string, nextState: string) => {
    setMoveToStates({ currentState, nextState });
  };

  const movingItems = selectedDeficiencies[moveToStates?.currentState] || [];

  const {
    updates,
    isSaving,
    updateState,
    updateCurrentReasonIncomplete,
    markAsDuplicate,
    updateCurrentDeferredDate,
    updateCurrentDueDate,
    updateCurrentPlanToFix,
    updateCurrentResponsibilityGroup,
    updateProgressNote,
    handlePermissionWarning,
    publish
  } = useUpdateItem(
    '',
    property.id,
    sendNotification,
    {} as DeficientItemLocalUpdates,
    {} as DeficientItemModel,
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

  const onChangeDeferredDate = (evt: ChangeEvent<HTMLInputElement>) => {
    updateCurrentDeferredDate(dateUtils.isoToTimestamp(evt.target.value));
  };

  const onChangePlanToFix = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentPlanToFix(evt.target.value);
  };

  const onChangeDueDate = (evt: ChangeEvent<HTMLInputElement>) => {
    updateCurrentDueDate(dateUtils.isoToTimestamp(evt.target.value));
  };

  const onChangeResponsibilityGroup = (evt: ChangeEvent<HTMLSelectElement>) => {
    updateCurrentResponsibilityGroup(evt.target.value);
  };

  const onChangeProgressNote = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateProgressNote(evt.target.value);
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

  const onCloseDuplicate = () => {
    markAsDuplicate();
    updateState('closed');
    publish();
  };

  const onConfirmDefer = async () => {
    updateState('deferred');
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
  };

  const onCloseBulkUpdateModal = () => {
    if (!isSaving) {
      setMoveToStates(null);
    }
  };

  const onUnpermittedPending = () => {
    handlePermissionWarning('pending');
  };

  const onUpdatePending = async () => {
    updateState('pending');
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
  };

  const onAddProgressNote = async () => {
    await publish();
    onClearGroupSelection(moveToStates.currentState);
    onCloseBulkUpdateModal();
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
        containerRef={containerRef}
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
        onChangeDeferredDate={onChangeDeferredDate}
        onChangePlanToFix={onChangePlanToFix}
        onChangeDueDate={onChangeDueDate}
        onChangeResponsibilityGroup={onChangeResponsibilityGroup}
        onChangeProgressNote={onChangeProgressNote}
        onGoBack={onGoBack}
        onUpdateIncomplete={onUpdateIncomplete}
        onConfirmDefer={onConfirmDefer}
        onCloseDI={onCloseDI}
        onCloseDuplicate={onCloseDuplicate}
        onUnpermittedPending={onUnpermittedPending}
        onUpdatePending={onUpdatePending}
        onAddProgressNote={onAddProgressNote}
      />
    </>
  );
};

DeficientItemsList.defaultProps = {
  isOnline: false,
  isStaging: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default DeficientItemsList;
