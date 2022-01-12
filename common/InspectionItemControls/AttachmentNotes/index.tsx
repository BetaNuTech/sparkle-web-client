/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PageIcon from '../../../public/icons/sparkle/page.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickAttachmentNotes(): void;
  isDisabled: boolean;
  isRequired: boolean;
}

const AttachmentNotes: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickAttachmentNotes,
  isDisabled,
  isRequired
}) => {
  const onClick = () => {
    if ((enabled && !isDisabled) || selected) {
      onClickAttachmentNotes();
    }
  };

  return (
    <li
      className={clsx(
        styles.inspection__attachment__item,
        !enabled && styles['inspection__attachment__item--disabled'],
        selected && styles['inspection__attachment__item--selected'],
        isRequired && styles['inspection__attachment__item--isRequired'],
        isDisabled &&
          !selected &&
          styles['inspection__attachment__item--isDisabled']
      )}
      data-testid="attachment-note"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={onClick}
    >
      <PageIcon />
    </li>
  );
};

AttachmentNotes.defaultProps = {
  enabled: true,
  isRequired: false,
  isDisabled: false,
  onClickAttachmentNotes: () => {} // eslint-disable-line
};

export default AttachmentNotes;
