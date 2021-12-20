/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PhotoIcon from '../../../public/icons/sparkle/photo.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
  selected: boolean;
  onClickPhotos(): void;
}

const AttachmentPhoto: FunctionComponent<Props> = ({
  enabled,
  selected,
  onClickPhotos
}) => (
  <li
    className={clsx(
      styles.inspection__attachment__item,
      !enabled && styles['inspection__attachment__item--disabled'],
      selected && styles['inspection__attachment__item--selected']
    )}
    data-testid="attachment-photo"
    data-test={enabled ? '' : 'disabled'}
    data-testselected={selected ? 'selected' : ''}
    onClick={onClickPhotos}
  >
    <PhotoIcon />
  </li>
);

AttachmentPhoto.defaultProps = {
  enabled: true,
  onClickPhotos: () => {} // eslint-disable-line
};

export default AttachmentPhoto;
