import { FunctionComponent } from 'react';
import ThumbsUpSimpleIcon from '../../../public/icons/sparkle/thumbs-up-simple.svg';
import ThumbsDownSimpleIcon from '../../../public/icons/sparkle/thumbs-down-simple.svg';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const TwoActionThumb: FunctionComponent<Props> = () => (
  <>
    <ul className={styles.inspection}>
      <li className={styles.inspection__input}>
        <ThumbsUpSimpleIcon />
      </li>
      <li className={styles.inspection__input}>
        <ThumbsDownSimpleIcon />
      </li>
    </ul>
  </>
);

TwoActionThumb.defaultProps = {};

export default TwoActionThumb;
