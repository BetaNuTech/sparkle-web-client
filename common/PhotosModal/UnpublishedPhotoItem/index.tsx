/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import inspectionTemplateItemLocalPhotoData from '../../models/inspections/templateItemUnpublishedPhotoData';
import PhotoDataModel from '../../models/inspectionTemplateItemPhotoData';

import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  onClick(evt: MouseEvent<HTMLLIElement>): void;
  photoData: inspectionTemplateItemLocalPhotoData;
  isProcessingPhotos: boolean;
  onClickRemovePhoto(itemId: string): void;
  onClickImage(photoData: PhotoDataModel): void;
  onClickAddCaption(itemId: string): void;
}

const UnpublishedPhotoItem: FunctionComponent<Props> = ({
  photoData,
  onClick,
  isProcessingPhotos,
  onClickRemovePhoto,
  onClickImage,
  onClickAddCaption
}) => (
  <li
    className={clsx(
      parentStyles.list__item,
      isProcessingPhotos && '-cu-not-allowed'
    )}
    data-testid="photos-modal-unpublished-photo-list"
    onClick={onClick}
  >
    {!isProcessingPhotos && (
      <button
        className={styles.remove}
        onClick={() => onClickRemovePhoto(photoData.id)}
        data-testid="photos-modal-photos-remove"
      >
        ×
      </button>
    )}
    <div
      className={parentStyles.image}
      onClick={() =>
        !isProcessingPhotos &&
        onClickImage({
          downloadURL: photoData.photoData,
          ...photoData
        })
      }
    >
      <img src={photoData.photoData} alt={photoData.caption} />
      {photoData.caption && (
        <div className={parentStyles.image__caption}>{photoData.caption}</div>
      )}
    </div>
    {!photoData.caption && !isProcessingPhotos && (
      <button
        className={styles.captionAction}
        onClick={() => onClickAddCaption(photoData.id)}
        data-testid="photo-modal-photo-add-caption"
      >
        Add Caption
      </button>
    )}
  </li>
);

export default UnpublishedPhotoItem;
