import { FunctionComponent } from 'react';
import NoteSimpleIcon from '../../../public/icons/sparkle/note-simple.svg';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const OneActionNotes: FunctionComponent<Props> = () => (
  <ul className={styles.inspection}>
    <li className={styles.inspection__input}>
      <NoteSimpleIcon />
    </li>
  </ul>
);

OneActionNotes.defaultProps = {};

export default OneActionNotes;
