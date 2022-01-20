import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

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
    <section className={fieldStyles.item} data-testid="item-plan-to-fix">
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Plan To Fix</h4>
        {showHeaderAction && (
          <button
            onClick={onShowPlanToFix}
            className={fieldStyles.textButton}
            data-testid="show-previous-plan-to-fix-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.field__main,
          !deficientItem.currentPlanToFix && '-p-none'
        )}
      >
        {deficientItem.currentPlanToFix ? (
          <strong
            className={fieldStyles.richText}
            data-testid="item-plan-to-fix-text"
          >
            {deficientItem.currentPlanToFix}
          </strong>
        ) : (
          <textarea
            placeholder="NOT SET"
            className={clsx(
              fieldStyles.field__textarea,
              !deficientItem.currentPlanToFix &&
                fieldStyles['field__textarea--empty']
            )}
            onChange={onChangePlanToFix}
            data-testid="item-plan-to-fix-textarea"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.field__footer}>
          <button
            onClick={onShowPlanToFix}
            className={fieldStyles.textButton}
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
