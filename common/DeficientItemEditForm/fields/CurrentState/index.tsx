import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../models/deficientItem';
import { deficientItemCurrentStateDescriptions } from '../../../../config/deficientItems';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowHistory(): void;
  isMobile: boolean;
}

const DeficientItemEditFormCurrentState: FunctionComponent<Props> = ({
  deficientItem,
  onShowHistory,
  isMobile
}) => (
  <section className={styles.field} data-testid="item-current-state">
    <header className={styles.field__label}>
      <h4 className={styles.field__label__heading}>Current State</h4>
      {deficientItem.stateHistory && !isMobile && (
        <button
          onClick={onShowHistory}
          className={styles.field__label__action}
          data-testid="show-history-button"
        >
          Show History
        </button>
      )}
    </header>
    <div className={styles.field__container}>
      <strong
        className={styles.field__currentState}
        data-testid="item-current-state-text"
      >
        <span className={styles['item__currentState--upperCase']}>
          {deficientItem.state === 'requires-action'
            ? 'New'
            : deficientItem.state}
        </span>
        {deficientItemCurrentStateDescriptions[deficientItem.state] &&
          ` - ${deficientItemCurrentStateDescriptions[deficientItem.state]}`}
      </strong>
    </div>
    {deficientItem.stateHistory && isMobile && (
      <footer className={styles.field__footer}>
        <button
          onClick={onShowHistory}
          className={styles.field__footer__action}
          data-testid="show-history-button"
        >
          Show State History
        </button>
      </footer>
    )}
  </section>
);

export default DeficientItemEditFormCurrentState;
