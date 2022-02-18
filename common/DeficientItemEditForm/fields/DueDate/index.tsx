import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';
import dateUtil from '../../../utils/date';

interface Props {
  deficientItem: DeficientItemModel;
  updates: DeficientItemModel;
  onShowHistory(): void;
  onChange(evt: ChangeEvent<HTMLInputElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  defaultDate: string;
  maxDate: string;
  isBulkUpdate: boolean;
}

const DeficientItemEditFormDueDate: FunctionComponent<Props> = ({
  deficientItem,
  updates,
  onShowHistory,
  onChange,
  isMobile,
  isVisible,
  defaultDate,
  maxDate,
  isBulkUpdate
}) => {
  const showHeaderAction = deficientItem.dueDates && !isMobile && !isBulkUpdate;
  const showFooterAction = deficientItem.dueDates && isMobile;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="item-due-date">
      <header
        className={clsx(
          fieldStyles.label,
          isBulkUpdate && '-br-bottom-none -mb-sm -p-none'
        )}
      >
        <h4
          className={clsx(
            fieldStyles.heading,
            isBulkUpdate && fieldStyles['heading--small'],
            isBulkUpdate && '-fw-bold'
          )}
        >
          Due Date
        </h4>
        {showHeaderAction && (
          <button
            onClick={onShowHistory}
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
              !updates?.currentDueDate && fieldStyles['formInput--empty'],
              '-mb-none'
            )}
            onChange={onChange}
            data-testid="item-due-date-input"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowHistory}
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
