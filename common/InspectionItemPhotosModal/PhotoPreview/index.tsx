import clsx from 'clsx';
import { FunctionComponent } from 'react';
import photoDataModel from '../../models/inspectionTemplateItemPhotoData';

import baseStyles from '../../Modal/styles.module.scss';
import styles from '../styles.module.scss';

interface Props {
  onClose: () => void;
  photoData: photoDataModel;
}

const PhotoPreview: FunctionComponent<Props> = ({ photoData, onClose }) => {
  const showPreview = Boolean(photoData);
  if (!showPreview) {
    return null;
  }
  return (
    <div
      className={styles.PhotosModal__preview}
      data-testid="photos-modal-preview"
    >
      <div
        className={styles.PhotosModal__preview__overlay}
        onClick={onClose}
      ></div>
      <button
        onClick={onClose}
        className={clsx(
          baseStyles.modal__closeButton,
          styles.PhotosModal__preview__close
        )}
        data-testid="photos-modal-preview-close"
      >
        Close
      </button>
      <img
        src={photoData.downloadURL}
        alt={photoData.caption}
        className={styles.PhotosModal__preview__image}
        data-testid="photos-modal-preview-image"
      />
      <div
        className={styles.PhotosModal__preview__caption}
        data-testid="photos-modal-preview-caption"
      >
        {photoData.caption}
      </div>
    </div>
  );
};

export default PhotoPreview;
