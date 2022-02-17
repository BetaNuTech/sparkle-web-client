import clsx from 'clsx';
import { FunctionComponent } from 'react';
import UserGroupIcon from '../../../../public/icons/sparkle/user-groups.svg';
import DeficientItemModel from '../../../../common/models/deficientItem';
import getResponsibilityGroup from '../../../../common/utils/deficientItem/getResponsibilityGroup';
import formStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
}

const DeficientItemEditFormResponsibilityGroupPill: FunctionComponent<Props> =
  ({ deficientItem, isVisible }) => {
    if (!isVisible) {
      return <></>;
    }
    return (
      <section
        className={clsx(formStyles.section, formStyles['section--twoColumn'])}
        data-testid="responsibility-group-pill"
      >
        <UserGroupIcon className={formStyles.icon} />
        <div className={clsx(formStyles.label, formStyles['label--pill'])}>
          <small className={formStyles.subHeading}>Responsibility Group</small>
          <h5
            className={clsx(
              formStyles.heading,
              formStyles['heading--pill'],
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
