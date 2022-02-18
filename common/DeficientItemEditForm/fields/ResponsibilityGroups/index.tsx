import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import { deficientItemResponsibilityGroups } from '../../../../config/deficientItems';
import fieldStyles from '../styles.module.scss';
import getResponsibilityGroup from '../../../utils/deficientItem/getResponsibilityGroup';

interface Props {
  deficientItem: DeficientItemModel;
  updates: DeficientItemModel;
  onShowHistory(): void;
  onChange(evt: ChangeEvent<HTMLSelectElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  isBulkUpdate: boolean;
}

const DeficientItemEditFormResponsibilityGroups: FunctionComponent<Props> = ({
  deficientItem,
  updates,
  onShowHistory,
  onChange,
  isMobile,
  isVisible,
  isBulkUpdate
}) => {
  const showHeaderAction =
    deficientItem.responsibilityGroups && !isMobile && !isBulkUpdate;
  const showFooterAction = deficientItem.responsibilityGroups && isMobile;

  const currentResponsibilityGroupLabel = getResponsibilityGroup(
    deficientItem.currentResponsibilityGroup
  );

  if (!isVisible) {
    return <></>;
  }

  return (
    <section
      className={fieldStyles.section}
      data-testid="item-responsibility-group"
    >
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
          Responsibility Groups
        </h4>
        {showHeaderAction && (
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-responsibility-group-btn"
          >
            Show Previous
          </button>
        )}
      </header>
      <div
        className={clsx(
          fieldStyles.section__main,
          !deficientItem.currentResponsibilityGroup && '-p-none'
        )}
      >
        {deficientItem.currentResponsibilityGroup ? (
          <strong
            className={fieldStyles.strong}
            data-testid="item-responsibility-group-text"
          >
            {currentResponsibilityGroupLabel}
          </strong>
        ) : (
          <select
            className={clsx(
              fieldStyles.formInput,
              !updates?.currentResponsibilityGroup &&
                fieldStyles['formInput--empty']
            )}
            onChange={onChange}
            data-testid="item-responsibility-group-select"
            defaultValue={updates?.currentResponsibilityGroup || ''}
          >
            <option value="">NOT SET</option>
            {deficientItemResponsibilityGroups.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-responsibility-group-btn"
          >
            Show Previous Groups Responsible
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormResponsibilityGroups;
