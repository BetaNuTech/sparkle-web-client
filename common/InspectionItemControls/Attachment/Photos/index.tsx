/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import PhotoIcon from '../../../../public/icons/sparkle/photo.svg';
import styles from '../../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClick(): void;
  canEdit: boolean;
  isRequired: boolean;
  onMouseDown(): void;
}

const AttachmentPhoto: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClick,
  canEdit,
  isRequired,
  onMouseDown
}) => {
  const isClickEnabled = (enabled && canEdit) || selected;
  const clickHandler = isClickEnabled ? onClick : () => null; // propagate or noop

  return (
    <li
      className={clsx(
        styles.inspection__attachment__item,
        !enabled && styles['inspection__attachment__item--disabled'],
        selected && styles['inspection__attachment__item--selected'],
        isRequired && styles['inspection__attachment__item--isRequired'],
        !canEdit &&
          !selected &&
          styles['inspection__attachment__item--isDisabled']
      )}
      data-testid="attachment-photo"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={clickHandler}
      onMouseDown={onMouseDown}
    >
      <PhotoIcon />
    </li>
  );
};

AttachmentPhoto.defaultProps = {
  enabled: false,
  selected: false,
  isRequired: false,
  canEdit: false,
  onClick: () => {} // eslint-disable-line
};

export default AttachmentPhoto;
