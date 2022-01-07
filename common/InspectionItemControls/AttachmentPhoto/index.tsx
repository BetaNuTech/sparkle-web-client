/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PhotoIcon from '../../../public/icons/sparkle/photo.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickPhotos(): void;
  isDeficient: boolean;
}

const AttachmentPhoto: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickPhotos,
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
      data-testid="attachment-photo"
      data-test={enabled ? '' : 'disabled'}
      data-testselected={selected ? 'selected' : ''}
      data-testdeficient={isRequired ? 'deficient' : ''}
      onClick={onClickPhotos}
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
