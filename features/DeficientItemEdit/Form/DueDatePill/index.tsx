import clsx from 'clsx';
import { FunctionComponent } from 'react';
import HourGlassIcon from '../../../../public/icons/sparkle/hour-glass.svg';
import DeficientItemModel from '../../../../common/models/deficientItem';
import dateUtils from '../../../../common/utils/date';
import formStyles from '../styles.module.scss';

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
      className={clsx(formStyles.section, formStyles['section--twoColumn'])}
      data-testid="due-date-pill"
    >
      <HourGlassIcon className={formStyles.icon} />
      <div className={clsx(formStyles.label, formStyles['label--pill'])}>
        <small className={formStyles.subHeading}>Due Date</small>
        <h5
          className={clsx(
            formStyles.heading,
            formStyles['heading--pill'],
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
