import { FunctionComponent } from 'react';
import clsx from 'clsx';
import PhotoIcon from '../../../public/icons/sparkle/photo.svg';
import styles from '../styles.module.scss';

interface Props {
  enabled: boolean;
}

const AttachmentPhoto: FunctionComponent<Props> = ({ enabled }) => (
  <li
    className={clsx(
      styles.inspection__attachment__item,
      !enabled && styles['inspection__attachment__item--disabled']
    )}
    data-testid="attachment-photo"
    data-test={enabled ? '' : 'disabled'}
  >
    <PhotoIcon />
  </li>
);

AttachmentPhoto.defaultProps = {
  enabled: true
};

export default AttachmentPhoto;
