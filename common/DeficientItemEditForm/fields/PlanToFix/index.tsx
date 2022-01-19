import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import DeficientItemModel from '../../../models/deficientItem';

import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowPlanToFix(): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
}

const DeficientItemEditFormPlanToFix: FunctionComponent<Props> = ({
  deficientItem,
  onShowPlanToFix,
  onChangePlanToFix,
  isMobile,
  isVisible
}) => {
  const showHeaderAction = deficientItem.plansToFix && !isMobile;
  const showFooterAction = deficientItem.plansToFix && isMobile;

  if (!isVisible) {
    return null;
  }

  return (
    <section className={styles.item} data-testid="item-plan-to-fix">
      <header className={styles.field__label}>
        <h4 className={styles.field__label__heading}>Plan To Fix</h4>
        {showHeaderAction && (
          <button
            onClick={onShowPlanToFix}
            className={styles.field__label__action}
            data-testid="show-previous-plan-to-fix-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          styles.field__container,
          !deficientItem.currentPlanToFix && '-p-none'
        )}
      >
        {deficientItem.currentPlanToFix ? (
          <strong
            className={styles.field__richText}
            data-testid="item-plan-to-fix-text"
          >
            {deficientItem.currentPlanToFix}
          </strong>
        ) : (
          <textarea
            placeholder="NOT SET"
            className={clsx(
              styles.field__formField,
              !deficientItem.currentPlanToFix &&
                styles['field__formField--empty']
            )}
            onChange={onChangePlanToFix}
            data-testid="item-plan-to-fix-textarea"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={styles.field__footer}>
          <button
            onClick={onShowPlanToFix}
            className={styles.field__footer__action}
            data-testid="show-previous-plan-to-fix-btn"
          >
            Show Previous Plan to Fix
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormPlanToFix;
