import { FunctionComponent, MouseEvent } from 'react';
import PhotoDataModel from '../../models/inspectionTemplateItemPhotoData';
import DeficientItemCompletedPhoto from '../../models/deficientItems/deficientItemCompletedPhoto';
import dateUtils from '../../utils/date';
import PublishedPhotoItem from '../PublishedPhotoItem';

import styles from '../styles.module.scss';

interface Props {
  onClickPhotoItem(evt: MouseEvent<HTMLElement>): void;
  // photoData: PhotoDataModel;
  isProcessingPhotos: boolean;
  onClickImage(photoData: PhotoDataModel): void;
  completedPhotos: DeficientItemCompletedPhoto;
}

const CompletedPhotoList: FunctionComponent<Props> = ({
  // photoData,
  onClickPhotoItem,
  isProcessingPhotos,
  onClickImage,
  completedPhotos
}) => {
  // flatten and sort completed photos
  const completedPhotoItems = Object.keys(completedPhotos || {})
    .map((key) => ({
      id: key,
      ...completedPhotos[key]
    }))
    // sort photos from newest to oldest
    .sort(
      ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
        Number(bCreatedAt) - Number(aCreatedAt)
    );

  // Group completed photos by start date
  const completedPhotoItemsGroup = completedPhotoItems.reduce((group, item) => {
    const { startDate } = item;
    group[startDate] = group[startDate] ?? [];
    group[startDate].push(item);
    return group;
  }, {});

  // Sorting object keys to decending order
  // so it will show most recent group on top
  const completedPhotoGroupKeys = Object.keys(completedPhotoItemsGroup)
    .sort()
    .reverse();

  if (completedPhotoGroupKeys.length < 1) {
    return <></>;
  }

  return (
    <>
      {completedPhotoGroupKeys.map((key) => {
        const completedPhotosList = completedPhotoItemsGroup[key];
        return (
          <div
            onClick={onClickPhotoItem}
            key={key}
            data-testid="completed-photos-group"
          >
            <h5 className={styles.groupHeading}>
              COMPLETED: {dateUtils.toUserFullDateDisplay(Number(key))} at{' '}
              {dateUtils.toUserTimeDisplay(Number(key))}
            </h5>
            <ul className={styles.list}>
              {completedPhotosList.map((item) => (
                <PublishedPhotoItem
                  key={item.id}
                  photoData={item}
                  onClick={onClickPhotoItem}
                  isProcessingPhotos={isProcessingPhotos}
                  onClickImage={onClickImage}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default CompletedPhotoList;
