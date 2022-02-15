import clsx from 'clsx';
import { FunctionComponent } from 'react';
import UserGroupIcon from '../../../../public/icons/sparkle/user-groups.svg';
import DeficientItemModel from '../../../models/deficientItem';
import getResponsibilityGroup from '../../../utils/deficientItem/getResponsibilityGroup';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
}

const DeficientItemEditFormResponsibilityGroupPill: FunctionComponent<
  Props
> = ({ deficientItem, isVisible }) => {
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
      data-testid="responsibility-group-pill"
    >
      <UserGroupIcon className={fieldStyles.icon} />
      <div className={clsx(fieldStyles.label, fieldStyles['label--pill'])}>
        <small className={fieldStyles.subHeading}>Responsibility Group</small>
        <h5
          className={clsx(
            fieldStyles.heading,
            fieldStyles['heading--pill'],
            '-fw-bold'
          )}
          data-testid="responsibility-group-pill-text"
        >
          {getResponsibilityGroup(deficientItem.currentResponsibilityGroup)}
        </h5>
      </div>
    </section>
  );
};

export default DeficientItemEditFormResponsibilityGroupPill;
