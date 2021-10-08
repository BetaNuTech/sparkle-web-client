import { FunctionComponent } from 'react';
import clsx from 'clsx';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../public/icons/sparkle/cancel-simple.svg';
import CautionSimpleIcon from '../../../public/icons/sparkle/caution-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  selectedValue?: number;
}

const ThreeActionCheckExclamation: FunctionComponent<Props> = ({
  selected,
  selectedValue
}) => (
  <>
    <ul className={styles.inspection}>
      <li
        className={clsx(
          styles.inspection__input,
          selected &&
            selectedValue === 0 &&
            styles['inspection__input--selected']
        )}
        data-testid="control-icon-checkmark"
        data-test={selected && selectedValue === 0 ? 'selected' : ''}
      >
        <CheckmarkSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          selected &&
            selectedValue === 1 &&
            styles['inspection__input--selectedOk']
        )}
        data-testid="control-icon-caution"
        data-test={selected && selectedValue === 1 ? 'selected' : ''}
      >
        <CautionSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          selected &&
            selectedValue === 2 &&
            styles['inspection__input--selectedError']
        )}
        data-testid="control-icon-cancel"
        data-test={selected && selectedValue === 2 ? 'selected' : ''}
      >
        <CancelSimpleIcon />
      </li>
    </ul>
  </>
);

ThreeActionCheckExclamation.defaultProps = {};

export default ThreeActionCheckExclamation;
