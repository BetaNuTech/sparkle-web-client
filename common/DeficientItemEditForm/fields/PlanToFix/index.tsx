import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  updates: DeficientItemModel;
  onShowPlanToFix(): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
}

const DeficientItemEditFormPlanToFix: FunctionComponent<Props> = ({
  deficientItem,
  updates,
  onShowPlanToFix,
  onChangePlanToFix,
  isMobile,
  isVisible
}) => {
  const showHeaderAction = deficientItem.plansToFix && !isMobile;
  const showFooterAction = deficientItem.plansToFix && isMobile;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="item-plan-to-fix">
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
          fieldStyles.section__main,
          !deficientItem.currentPlanToFix && '-p-none'
        )}
      >
        {deficientItem.currentPlanToFix ? (
          <strong
            className={fieldStyles.richText}
            data-testid="item-plan-to-fix-text"
          >
            {deficientItem?.currentPlanToFix}
          </strong>
        ) : (
          <textarea
            placeholder="NOT SET"
            className={clsx(
              fieldStyles.formInput,
              !updates?.currentPlanToFix &&
                fieldStyles['formInput--empty']
            )}
            defaultValue={updates?.currentPlanToFix || ''}
            onChange={onChangePlanToFix}
            data-testid="item-plan-to-fix-textarea"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
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
