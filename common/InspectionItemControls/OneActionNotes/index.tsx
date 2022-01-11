/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import NoteSimpleIcon from '../../../public/icons/sparkle/note-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  onClickOneActionNotes?: (any) => any;
  selected: boolean;
}

const OneActionNotes: FunctionComponent<Props> = ({
  onClickOneActionNotes,
  selected
}) => (
  <ul className={styles.inspection}>
    <li
      className={clsx(
        styles.inspection__input,
        selected && styles['inspection__input--selected']
      )}
      data-testid="one-action-notes"
      onClick={onClickOneActionNotes}
    >
      <NoteSimpleIcon />
    </li>
  </ul>
);

OneActionNotes.defaultProps = {};

export default OneActionNotes;
