import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ASimpleIcon from '../../../public/icons/sparkle/a-simple.svg';
import BSimpleIcon from '../../../public/icons/sparkle/b-simple.svg';
import CSimpleIcon from '../../../public/icons/sparkle/c-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  selectedValue?: number;
}

const ThreeActionAbc: FunctionComponent<Props> = ({
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
        data-testid="control-icon-a"
        data-test={selected && selectedValue === 0 ? 'selected' : ''}
      >
        <ASimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          selected &&
            selectedValue === 1 &&
            styles['inspection__input--selectedOk']
        )}
        data-testid="control-icon-b"
        data-test={selected && selectedValue === 1 ? 'selected' : ''}
      >
        <BSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          selected &&
            selectedValue === 2 &&
            styles['inspection__input--selectedError']
        )}
        data-testid="control-icon-c"
        data-test={selected && selectedValue === 2 ? 'selected' : ''}
      >
        <CSimpleIcon />
      </li>
    </ul>
  </>
);

ThreeActionAbc.defaultProps = {};

export default ThreeActionAbc;
