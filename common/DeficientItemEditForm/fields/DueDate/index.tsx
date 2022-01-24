import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';
import dateUtil from '../../../utils/date';

interface Props {
  deficientItem: DeficientItemModel;
  onShowDueDates(): void;
  onChangeDueDate(evt: ChangeEvent<HTMLInputElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  defaultDate: string;
  maxDate: string;
}

const DeficientItemEditFormDueDate: FunctionComponent<Props> = ({
  deficientItem,
  onShowDueDates,
  onChangeDueDate,
  isMobile,
  isVisible,
  defaultDate,
  maxDate
}) => {
  const showHeaderAction = deficientItem.dueDates && !isMobile;
  const showFooterAction = deficientItem.dueDates && isMobile;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="item-due-date">
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Due Date</h4>
        {showHeaderAction && (
          <button
            onClick={onShowDueDates}
            className={fieldStyles.textButton}
            data-testid="show-previous-due-date-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.section__main,
          !deficientItem.currentDueDate && '-p-none'
        )}
      >
        {deficientItem.currentDueDate ? (
          <strong
            className={fieldStyles.strong}
            data-testid="item-due-date-text"
          >
            {dateUtil.toUserFullDateDisplay(deficientItem.currentDueDate)} at{' '}
            {dateUtil.toUserTimeDisplay(deficientItem.currentDueDate)}
          </strong>
        ) : (
          <input
            type="date"
            defaultValue={defaultDate}
            min={defaultDate}
            max={maxDate}
            className={clsx(
              fieldStyles.formInput,
              !deficientItem.currentDueDate && fieldStyles['formInput--empty'],
              '-mb-none'
            )}
            onChange={onChangeDueDate}
            data-testid="item-due-date-input"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowDueDates}
            className={fieldStyles.textButton}
            data-testid="show-previous-due-date-btn"
          >
            Show Previous Due Dates
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormDueDate;
