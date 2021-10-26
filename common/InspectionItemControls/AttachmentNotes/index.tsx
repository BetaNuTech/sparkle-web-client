import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PageIcon from '../../../public/icons/sparkle/page.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
}

const AttachmentNotes: FunctionComponent<Props> = ({ enabled }) => (
  <li
    className={clsx(
      styles.inspection__attachment__item,
      !enabled && styles['inspection__attachment__item--disabled']
    )}
    data-testid="attachment-note"
    data-test={enabled ? '' : 'disabled'}
  >
    <PageIcon />
  </li>
);

AttachmentNotes.defaultProps = {
  enabled: true
};

export default AttachmentNotes;
