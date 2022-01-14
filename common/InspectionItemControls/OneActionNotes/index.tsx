/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import NoteSimpleIcon from '../../../public/icons/sparkle/note-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  onClick: (any) => void;
  selected: boolean;
}

const OneActionNotes: FunctionComponent<Props> = ({ onClick, selected }) => (
  <ul className={styles.inspection}>
    <li
      className={clsx(
        styles.inspection__input,
        selected && styles['inspection__input--selected']
      )}
      data-testid="one-action-notes"
      onClick={onClick}
    >
      <NoteSimpleIcon />
    </li>
  </ul>
);

OneActionNotes.defaultProps = {
  selected: false,
  onClick: () => null
};

export default OneActionNotes;
