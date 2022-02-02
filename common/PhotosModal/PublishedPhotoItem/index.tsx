/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import PhotoDataModel from '../../models/inspectionTemplateItemPhotoData';

import photoModalStyles from '../styles.module.scss';

interface Props {
  onClick(evt: MouseEvent<HTMLLIElement>): void;
  photoData: PhotoDataModel;
  isProcessingPhotos: boolean;
  onClickImage(photoData: PhotoDataModel): void;
}

const PublishedPhotoItem: FunctionComponent<Props> = ({
  photoData,
  onClick,
  isProcessingPhotos,
  onClickImage
}) => (
  <li
    className={clsx(
      photoModalStyles.list__item,
      isProcessingPhotos && '-cu-not-allowed'
    )}
    onClick={(evt) => !isProcessingPhotos && onClick(evt)}
  >
    <div
      className={photoModalStyles.image}
      onClick={() => !isProcessingPhotos && onClickImage(photoData)}
    >
      <img src={photoData.downloadURL} alt={photoData.caption} />
      {photoData.caption && (
        <div
          className={photoModalStyles.image__caption}
          data-testid="published-photo-item-caption"
        >
          {photoData.caption}
        </div>
      )}
    </div>
  </li>
);

export default PublishedPhotoItem;
