/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';
import styles from './styles.module.scss';

interface Props {
  photos: Array<photoDataModel>;
  onClick?(): void;
}

const MiniPreviewGallery: FunctionComponent<Props> = ({ photos, onClick }) => {
  const photosData = photos.slice(0, 4);

  if (photosData.length === 0) {
    return null;
  }
  const isOneRow = photosData.length === 1;

  return (
    <div className={styles.miniPreviewGallery}>
      <ul
        className={clsx(
          styles.miniPreviewGallery__list,
          isOneRow && styles['miniPreviewGallery__list--oneRow']
        )}
        data-testid="miniPreviewGallery-container"
      >
        {photosData.map((photo) => (
          <li
            key={photo.id}
            className={styles.miniPreviewGallery__item}
            data-testid="miniPreviewGallery-container-item"
            onClick={onClick}
          >
            <img
              className={styles.miniPreviewGallery__photo}
              src={photo.downloadURL}
              alt={photo.caption}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

MiniPreviewGallery.defaultProps = {
  photos: [],
  onClick: () => {} // eslint-disable-line
};

export default MiniPreviewGallery;
