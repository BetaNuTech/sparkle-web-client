/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PageIcon from '../../../public/icons/sparkle/page.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickAttachmentNotes(): void;
}

const AttachmentNotes: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickAttachmentNotes
}) => (
  <li
    className={clsx(
      styles.inspection__attachment__item,
      !enabled && styles['inspection__attachment__item--disabled'],
      selected && styles['inspection__attachment__item--selected']
    )}
    data-testid="attachment-note"
    data-test={enabled ? '' : 'disabled'}
    data-testselected={selected ? 'selected' : ''}
    onClick={onClickAttachmentNotes}
  >
    <PageIcon />
  </li>
);

AttachmentNotes.defaultProps = {
  enabled: true,
  onClickAttachmentNotes: () => {} // eslint-disable-line
};

export default AttachmentNotes;
