/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PageIcon from '../../../public/icons/sparkle/page.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickAttachmentNotes(): void;
  isDeficient: boolean;
}

const AttachmentNotes: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickAttachmentNotes,
  isDeficient
}) => {
  const isRequired = isDeficient && !selected && enabled;
  return (
    <li
      className={clsx(
        styles.inspection__attachment__item,
        !enabled && styles['inspection__attachment__item--disabled'],
        selected && styles['inspection__attachment__item--selected'],
        isRequired && styles['inspection__attachment__item--isRequired']
      )}
      data-testid="attachment-note"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={onClickAttachmentNotes}
    >
      <PageIcon />
    </li>
  );
};

AttachmentNotes.defaultProps = {
  enabled: true,
  onClickAttachmentNotes: () => {} // eslint-disable-line
};

export default AttachmentNotes;
