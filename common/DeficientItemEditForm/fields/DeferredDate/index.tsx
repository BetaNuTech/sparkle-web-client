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
  isBulkUpdate: boolean;
}

const DeficientItemEditFormDeferredDate: FunctionComponent<Props> = ({
  deficientItem,
  updates,
  onShowHistory,
  onChange,
  isMobile,
  isVisible,
  defaultDate,
  isBulkUpdate
}) => {
  const showHeaderAction =
    deficientItem.deferredDates && !isMobile && !isBulkUpdate;
  const showFooterAction = deficientItem.deferredDates && isMobile;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="item-deferred-date">
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
          Deferred Date
        </h4>
        {showHeaderAction && (
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-deferred-date-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.section__main,
          !deficientItem.currentDeferredDate && '-p-none'
        )}
      >
        {deficientItem.currentDeferredDate ? (
          <strong
            className={fieldStyles.strong}
            data-testid="item-deferred-date-text"
          >
            {dateUtil.toUserFullDateDisplay(deficientItem.currentDeferredDate)}{' '}
            at {dateUtil.toUserTimeDisplay(deficientItem.currentDeferredDate)}
          </strong>
        ) : (
          <input
            type="date"
            defaultValue={defaultDate}
            min={defaultDate}
            className={clsx(
              fieldStyles.formInput,
              !updates?.currentDeferredDate && fieldStyles['formInput--empty'],
              '-mb-none'
            )}
            onChange={onChange}
            data-testid="item-deferred-date-input"
          />
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-deferred-date-btn"
          >
            Show Previous Deferred Dates
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormDeferredDate;
