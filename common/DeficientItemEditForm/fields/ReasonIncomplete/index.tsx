import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowReasonIncomplete(): void;
  onChangeReasonIncomplete(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
}

const DeficientItemEditFormReasonIncomplete: FunctionComponent<Props> = ({
  deficientItem,
  onShowReasonIncomplete,
  onChangeReasonIncomplete,
  isMobile,
  isVisible
}) => {
  const showHeaderAction = deficientItem.reasonsIncomplete && !isMobile;
  const showFooterAction = deficientItem.reasonsIncomplete && isMobile;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section
      className={fieldStyles.section}
      data-testid="item-reason-incomplete"
    >
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Reason Incomplete</h4>
        {showHeaderAction && (
          <button
            onClick={onShowReasonIncomplete}
            className={fieldStyles.textButton}
            data-testid="show-previous-reason-incomplete-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.section__main,
          !deficientItem.currentReasonIncomplete && '-p-none'
        )}
      >
        {deficientItem.currentReasonIncomplete ? (
          <strong
            className={fieldStyles.richText}
            data-testid="item-reason-incomplete-text"
          >
            {deficientItem.currentReasonIncomplete}
          </strong>
        ) : (
          <textarea
            placeholder="NOT SET"
            className={clsx(
              fieldStyles.formInput,
              !deficientItem.currentReasonIncomplete &&
                fieldStyles['formInput--empty']
            )}
            onChange={onChangeReasonIncomplete}
            data-testid="item-reason-incomplete-textarea"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowReasonIncomplete}
            className={fieldStyles.textButton}
            data-testid="show-previous-reason-incomplete-btn"
          >
            Show Previous Reason(s) Incomplete
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormReasonIncomplete;
