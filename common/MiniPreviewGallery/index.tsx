import { FunctionComponent } from 'react';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';
import styles from './styles.module.scss';

interface Props {
  photos: Array<photoDataModel>;
}

const MiniPreviewGallery: FunctionComponent<Props> = ({ photos }) => {
  const photosData = photos.slice(0, 4);

  if (photosData.length === 0) {
    return null;
  }

  return (
    <div className={styles.miniPreviewGallery}>
      <ul
        className={styles.miniPreviewGallery__list}
        data-testid="miniPreviewGallery-container"
      >
        {photosData.map((photo) => (
          <li
            key={photo.id}
            className={styles.miniPreviewGallery__item}
            data-testid="miniPreviewGallery-container-item"
          >
            <img className={styles.miniPreviewGallery__photo} src={photo.downloadURL} alt={photo.caption} />
          </li>
        ))}
      </ul>
    </div>
  );
};

MiniPreviewGallery.defaultProps = {
  photos: []
};

export default MiniPreviewGallery;
