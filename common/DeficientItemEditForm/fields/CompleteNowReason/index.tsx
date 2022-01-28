import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowCompleteNowReason(): void;
  onChangeCompleteNowReason(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  isEditable: boolean;
}

const DeficientItemEditFormCompleteNowReason: FunctionComponent<Props> = ({
  deficientItem,
  onShowCompleteNowReason,
  onChangeCompleteNowReason,
  isMobile,
  isVisible,
  isEditable
}) => {
  const showHeaderAction = deficientItem.completeNowReasons && !isMobile;
  const showFooterAction = deficientItem.completeNowReasons && isMobile;
  const showTextArea = !deficientItem.currentCompleteNowReason && isEditable;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section
      className={fieldStyles.section}
      data-testid="item-complete-now-reason"
    >
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Completed Details</h4>
        {showHeaderAction && (
          <button
            onClick={onShowCompleteNowReason}
            className={fieldStyles.textButton}
            data-testid="show-previous-complete-now-reason-btn"
          >
            Show Complete Now Reason(s)
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.section__main,
          !deficientItem.currentCompleteNowReason && '-p-none'
        )}
      >
        {showTextArea && (
          <textarea
            placeholder="Enter reason complete"
            className={clsx(
              fieldStyles.formInput,
              !deficientItem.currentCompleteNowReason &&
                fieldStyles['formInput--empty']
            )}
            onChange={onChangeCompleteNowReason}
            data-testid="item-complete-now-reason-textarea"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowCompleteNowReason}
            className={fieldStyles.textButton}
            data-testid="show-previous-complete-now-reason-btn"
          >
            Show Complete Now Reason(s)
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormCompleteNowReason;
