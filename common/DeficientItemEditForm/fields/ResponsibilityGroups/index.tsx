import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import { deficientItemResponsibilityGroups } from '../../../../config/deficientItems';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowResponsibilityGroups(): void;
  onChangeResponsibilityGroup(evt: ChangeEvent<HTMLSelectElement>): void;
  isMobile: boolean;
  isVisible: boolean;
}

const DeficientItemEditFormResponsibilityGroups: FunctionComponent<Props> = ({
  deficientItem,
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup,
  isMobile,
  isVisible
}) => {
  const showHeaderAction = deficientItem.responsibilityGroups && !isMobile;
  const showFooterAction = deficientItem.responsibilityGroups && isMobile;

  const currentResponsibilityGroupLabel = (
    deficientItemResponsibilityGroups.find(
      (item) => item.value === deficientItem.currentResponsibilityGroup
    ) || {}
  ).label;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section
      className={fieldStyles.section}
      data-testid="item-responsibility-group"
    >
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Responsibility Groups</h4>
        {showHeaderAction && (
          <button
            onClick={onShowResponsibilityGroups}
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
              !deficientItem.currentResponsibilityGroup &&
                fieldStyles['formInput--empty']
            )}
            onChange={onChangeResponsibilityGroup}
            data-testid="item-responsibility-group-select"
            defaultValue=""
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
            onClick={onShowResponsibilityGroups}
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