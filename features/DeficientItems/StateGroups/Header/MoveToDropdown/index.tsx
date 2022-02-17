/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Fragment, FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { deficientItemTransitions } from '../../../../../config/deficientItems';
import utilString from '../../../../../common/utils/string';

interface Props {
  currentState: string;
  onClick(currentState: string, nextState: string): void;
  isEnabled: boolean;
  canGoBack: boolean;
  canClose: boolean;
  canDefer: boolean;
}

type DeficientItemTransitionsType = {
  label?: string;
  value: string;
};

const MoveToDropDown: FunctionComponent<Props> = ({
  currentState,
  isEnabled,
  onClick,
  canGoBack,
  canClose,
  canDefer
}) => {
  // filter state transition options
  // based on users permissions
  const stateTransitionOptions = (
    deficientItemTransitions[currentState] || []
  ).filter((item: DeficientItemTransitionsType) => {
    if (
      (item.value === 'go-back' && !canGoBack) ||
      (item.value === 'deferred' && !canDefer) ||
      (item.value === 'closed' && !canClose)
    ) {
      return false;
    }
    return true;
  });

  if (stateTransitionOptions.length < 1) {
    return <></>;
  }

  return (
    <div
      className={clsx(
        styles.dropdown,
        isEnabled && styles['dropdown--enabled']
      )}
      tabIndex={1} // eslint-disable-line
    >
      <h6 className={clsx(styles.label, isEnabled && styles['label--enabled'])}>
        Move To
      </h6>
      <ul className={styles.dropdownList}>
        {stateTransitionOptions.map((state: DeficientItemTransitionsType) => (
          <li
            className={styles.dropdownItem}
            onClick={() => onClick(currentState, state.value)}
            data-testid="move-to-item"
            key={currentState + state.value}
          >
            <span
              className={clsx(
                styles.dropdownItemIcon,
                styles[`dropdownItemIcon--${state.value}`]
              )}
            ></span>
            {utilString.titleize(utilString.dedash(state.label || state.value))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoveToDropDown;
