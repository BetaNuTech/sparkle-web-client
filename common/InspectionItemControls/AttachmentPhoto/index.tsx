/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PhotoIcon from '../../../public/icons/sparkle/photo.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickPhotos(): void;
  isDisabled: boolean;
  isRequired: boolean;
}

const AttachmentPhoto: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickPhotos,
  isDisabled,
  isRequired
}) => {
  const onClick = () => {
    if ((enabled && !isDisabled) || selected) {
      onClickPhotos();
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
      data-testid="attachment-photo"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={onClick}
    >
      <PhotoIcon />
    </li>
  );
};

AttachmentPhoto.defaultProps = {
  enabled: true,
  onClickPhotos: () => {} // eslint-disable-line
};

export default AttachmentPhoto;
