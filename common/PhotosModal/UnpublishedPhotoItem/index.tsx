/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, memo, MouseEvent } from 'react';
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
  onRender(string): void;
  canRender: boolean;
}

const UnpublishedPhotoItem: FunctionComponent<Props> = ({
  photoData,
  onClick,
  isProcessingPhotos,
  onClickRemovePhoto,
  onClickImage,
  onClickAddCaption,
  onRender,
  canRender
}) => (
  <li
    className={clsx(
      parentStyles.list__item,
      isProcessingPhotos && '-cu-not-allowed'
    )}
    data-testid="photos-modal-unpublished-photo-list"
    onClick={onClick}
  >
    {!isProcessingPhotos && canRender && (
      <button
        className={styles.remove}
        onClick={() => onClickRemovePhoto(photoData.id)}
        data-testid="photos-modal-photos-remove"
      >
        ×
      </button>
    )}
    <div
      className={clsx(parentStyles.image, !canRender && styles.loading)}
      onClick={() =>
        !isProcessingPhotos &&
        onClickImage({
          downloadURL: photoData.photoData,
          ...photoData
        })
      }
    >
      {canRender && (
        <img
          src={photoData?.photoData}
          alt={photoData.caption}
          onLoad={() => onRender(photoData.id)}
          data-testid="photos-modal-unpublished-photo-list-image"
        />
      )}
      {photoData.caption && (
        <div className={parentStyles.image__caption}>{photoData.caption}</div>
      )}
    </div>
    {!photoData.caption && !isProcessingPhotos && canRender && (
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

export default memo(UnpublishedPhotoItem);
