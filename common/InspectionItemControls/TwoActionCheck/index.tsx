import { FunctionComponent } from 'react';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../public/icons/sparkle/cancel-simple.svg';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const TwoActionCheck: FunctionComponent<Props> = () => (
  <>
    <ul className={styles.inspection}>
      <li className={styles.inspection__input}>
        <CheckmarkSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <CancelSimpleIcon />
      </li>
    </ul>
  </>
);

TwoActionCheck.defaultProps = {};

export default TwoActionCheck;
