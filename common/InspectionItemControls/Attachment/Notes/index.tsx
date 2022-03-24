/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import PageIcon from '../../../../public/icons/sparkle/page.svg';
import styles from '../../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClick(): void;
  canEdit: boolean;
  isRequired: boolean;
  onMouseDown(): void;
  isUpdatingTemplate: boolean;
}

const AttachmentNotes: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClick,
  canEdit,
  isRequired,
  onMouseDown,
  isUpdatingTemplate
}) => {
  const isClickEnabled = (enabled && canEdit) || selected;
  const clickHandler = isClickEnabled ? onClick : () => null; // Propagate or noop

  return (
    <li
      className={clsx(
        styles.inspection__attachment__item,
        !enabled && styles['inspection__attachment__item--disabled'],
        selected && styles['inspection__attachment__item--selected'],
        isRequired && styles['inspection__attachment__item--isRequired'],
        !canEdit &&
          !selected &&
          styles['inspection__attachment__item--isDisabled'],
        isUpdatingTemplate && '-cu-pointer'
      )}
      data-testid="attachment-note"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={clickHandler}
      onMouseDown={onMouseDown}
    >
      <PageIcon />
    </li>
  );
};

AttachmentNotes.defaultProps = {
  enabled: false,
  selected: false,
  isRequired: false,
  canEdit: false,
  onClick: () => {} // eslint-disable-line
};

export default AttachmentNotes;
