import { FunctionComponent } from 'react';
import OneSimpleIcon from '../../../public/icons/sparkle/one-simple.svg';
import TwoSimpleIcon from '../../../public/icons/sparkle/two-simple.svg';
import ThreeSimpleIcon from '../../../public/icons/sparkle/three-simple.svg';
import FourSimpleIcon from '../../../public/icons/sparkle/four-simple.svg';
import FiveSimpleIcon from '../../../public/icons/sparkle/five-simple.svg';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const FiveActionOneToFive: FunctionComponent<Props> = () => (
  <>
    <ul className={styles.inspection}>
      <li className={styles.inspection__input}>
        <OneSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <TwoSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <ThreeSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <FourSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <FiveSimpleIcon />
      </li>
    </ul>
  </>
);

FiveActionOneToFive.defaultProps = {};

export default FiveActionOneToFive;
