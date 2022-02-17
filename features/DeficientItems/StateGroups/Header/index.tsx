import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import MoveToDropDown from './MoveToDropdown';
import styles from './styles.module.scss';

interface Props {
  state: string;
  itemCount: number;
  onGroupSelection(state: string, evt: ChangeEvent<HTMLInputElement>): void;
  checked: boolean;
  isMobile: boolean;
  selectedCount: number;
  onMoveToState(currentState: string, nextState: string): void;
  canGoBack: boolean;
  canClose: boolean;
  canDefer: boolean;
}

const DeficientItemsStateGroupsHeader: FunctionComponent<Props> = ({
  state,
  itemCount,
  onGroupSelection,
  checked,
  isMobile,
  selectedCount,
  onMoveToState,
  canGoBack,
  canClose,
  canDefer
}) => {
  let title = '';

  switch (state) {
    case 'completed':
      title = 'Completed - Follow Up Required';
      break;
    case 'incomplete':
      title = 'Incomplete - Follow Up Required';
      break;
    case 'overdue':
      title = `Past Due Date - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'requires-action':
      title = `NEW - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'go-back':
      title = `Go Back - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'requires-progress-update':
      title = `Pending - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'deferred':
      title = 'Deferred';
      break;
    case 'pending':
      title = 'Pending';
      break;
    case 'closed':
      title = 'Closed';
      break;

    default:
      title = state;
      break;
  }
  const hasBulkUpdate = !isMobile && state !== 'closed';
  const showSelectedCount = !isMobile && Boolean(selectedCount);
  return (
    <h3
      data-testid="state-item-title"
      className={clsx(styles.container, styles[`container--${state}`])}
    >
      {hasBulkUpdate && (
        <input
          className="-mr"
          type="checkbox"
          onChange={(evt) => onGroupSelection(state, evt)}
          checked={checked}
        />
      )}
      <span>{title}</span> {/* NOTE: span removes cascading base form styles */}
      {showSelectedCount && (
        <label
          className={styles.selectedCount}
          data-testid="selected-items-count"
        >
          {selectedCount} Selected
        </label>
      )}
      {hasBulkUpdate && (
        <MoveToDropDown
          currentState={state}
          isEnabled={Boolean(selectedCount)}
          onClick={onMoveToState}
          canGoBack={canGoBack}
          canClose={canClose}
          canDefer={canDefer}
        />
      )}
    </h3>
  );
};

export default DeficientItemsStateGroupsHeader;
