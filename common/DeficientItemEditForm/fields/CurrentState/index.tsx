import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../models/deficientItem';
import { deficientItemCurrentStateDescriptions } from '../../../../config/deficientItems';

import fieldStyles from '../styles.module.scss';

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
  <section className={fieldStyles.section} data-testid="item-current-state">
    <header className={fieldStyles.label}>
      <h4 className={fieldStyles.heading}>Current State</h4>
      {deficientItem.stateHistory && !isMobile && (
        <button
          onClick={onShowHistory}
          className={fieldStyles.textButton}
          data-testid="show-history-button"
        >
          Show History
        </button>
      )}
    </header>
    <div className={fieldStyles.section__main}>
      <strong
        className={fieldStyles.strong}
        data-testid="item-current-state-text"
      >
        <span className="-tt-uppercase">
          {deficientItem.state === 'requires-action'
            ? 'New'
            : deficientItem.state}
        </span>
        {deficientItemCurrentStateDescriptions[deficientItem.state] &&
          ` - ${deficientItemCurrentStateDescriptions[deficientItem.state]}`}
      </strong>
    </div>
    {deficientItem.stateHistory && isMobile && (
      <footer className={fieldStyles.section__footer}>
        <button
          onClick={onShowHistory}
          className={fieldStyles.textButton}
          data-testid="show-history-button"
        >
          Show State History
        </button>
      </footer>
    )}
  </section>
);

export default DeficientItemEditFormCurrentState;
