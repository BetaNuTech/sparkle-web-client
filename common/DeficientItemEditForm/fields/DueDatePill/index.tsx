import clsx from 'clsx';
import { FunctionComponent } from 'react';
import HourGlassIcon from '../../../../public/icons/sparkle/hour-glass.svg';
import DeficientItemModel from '../../../models/deficientItem';
import dateUtils from '../../../utils/date';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
}

const DeficientItemEditFormDueDatePill: FunctionComponent<Props> = ({
  deficientItem,
  isVisible
}) => {
  if (!isVisible) {
    return <></>;
  }
  return (
    <section
      className={clsx(
        fieldStyles.section,
        fieldStyles['section--pill'],
        fieldStyles['section--twoColumn']
      )}
      data-testid="due-date-pill"
    >
      <HourGlassIcon className={fieldStyles.icon} />
      <div className={clsx(fieldStyles.label, fieldStyles['label--pill'])}>
        <small className={fieldStyles.subHeading}>Due Date</small>
        <h5
          className={clsx(
            fieldStyles.heading,
            fieldStyles['heading--pill'],
            '-fw-bold'
          )}
          data-testid="due-date-pill-date"
        >
          {dateUtils.toUserDateDisplayWithFullYear(
            deficientItem.currentDueDate
          )}
        </h5>
      </div>
    </section>
  );
};

export default DeficientItemEditFormDueDatePill;
