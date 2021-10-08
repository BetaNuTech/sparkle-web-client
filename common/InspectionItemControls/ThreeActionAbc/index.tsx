import { FunctionComponent } from 'react';
import ASimpleIcon from '../../../public/icons/sparkle/a-simple.svg';
import BSimpleIcon from '../../../public/icons/sparkle/b-simple.svg';
import CSimpleIcon from '../../../public/icons/sparkle/c-simple.svg';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const ThreeActionAbc: FunctionComponent<Props> = () => (
  <>
    <ul className={styles.inspection}>
      <li className={styles.inspection__input}>
        <ASimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <BSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <CSimpleIcon />
      </li>
    </ul>
  </>
);

ThreeActionAbc.defaultProps = {};

export default ThreeActionAbc;
