import clsx from 'clsx';
import { FunctionComponent, useState, MouseEvent, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';

import unPublishedPhotoDataModel from '../models/inspections/templateItemUnpublishedPhotoData';
import Modal, { Props as ModalProps } from '../Modal';
import PhotoPreview from './PhotoPreview';
import baseStyles from '../Modal/styles.module.scss';
import styles from './styles.module.scss';

type userNotifications = (message: string, options?: any) => any;

interface Props extends ModalProps {
  onClose: () => void;
  photosData: Record<string, photoDataModel>;
  unpublishedPhotosData: unPublishedPhotoDataModel[];
  title: string;
  onChangeFiles(files: Array<string>): void;
  onAddCaption(unpublishedPhotoId: string, captionText: string): void;
  onRemovePhoto(unpublishedPhotoId: string): void;
  sendNotification: userNotifications;
  disabled?: boolean;
}

const PhotosModal: FunctionComponent<Props> = ({
  photosData,
  unpublishedPhotosData,
  onClose,
  title,
  onChangeFiles,
  onAddCaption,
  onRemovePhoto,
  sendNotification,
  disabled
}) => {
  const photosDataItems = Object.keys(photosData || {})
    .map((key) => ({
      id: key,
      ...photosData[key]
    }))
    // sort from newest to oldest photos data bases on UNIX timestamp based id
    .sort(({ id: aId }, { id: bId }) => Number(bId) - Number(aId));

  const [photoForPreview, setPhotoForPreview] = useState(null);

  const hasExistingPhotos =
    photosDataItems.length > 0 || unpublishedPhotosData.length > 0;

  // Promise to read file data into url
  const fileToDataURI = (file: File) =>
    // Read file as data URL
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = () =>
        reject(
          new Error(
            `File ${file.name} could not be saved, please try again or use a different file`
          )
        );
      fileReader.readAsDataURL(file);
    });

  // Publish all files data URL's to parent
  const processAcceptedFiles = async (files: Array<File>) => {
    // List of promises for file data URL's
    const filesToDataUris = files.map(async (file) => fileToDataURI(file));
    Promise.all(filesToDataUris)
      .then((res: string[]) => onChangeFiles(res))
      .catch((err: Error) =>
        sendNotification(err.message, {
          type: 'error'
        })
      );
  };

  const onClickImage = (
    ev: MouseEvent<HTMLDivElement>,
    photoData: photoDataModel
  ) => {
    ev.stopPropagation();
    setPhotoForPreview(photoData);
  };

  const onClickAddCaption = (
    ev: MouseEvent<HTMLButtonElement>,
    unPublishedPhotoId: string
  ) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-alert
    const captionText = window.prompt('Enter your caption');
    if (captionText) {
      onAddCaption(unPublishedPhotoId, captionText);
    }
  };

  const onClickRemovePhoto = (
    ev: MouseEvent<HTMLButtonElement>,
    photoId: string
  ) => {
    ev.stopPropagation();
    onRemovePhoto(photoId);
  };

  const onClosePreview = (
    ev: MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    ev.stopPropagation();
    setPhotoForPreview(null);
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (disabled) return;
    processAcceptedFiles(acceptedFiles);

    if (rejectedFiles.length > 0) {
      const rejectedFileTypes = Array.from(
        new Set<string>(
          rejectedFiles.map(
            (rejectedFile: FileRejection) =>
              rejectedFile?.file?.type?.split('/')[1] || ''
          )
        )
      ) as Array<string>;

      rejectedFileTypes.map((type: string) =>
        sendNotification(
          `File format ${type.toUpperCase()} is not supported, please try a different file`,
          {
            type: 'error'
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,capture=camera',
    noClick: disabled
  });

  return (
    <div className={styles.PhotosModal} data-testid="photos-modal">
      <header
        className={clsx(baseStyles.modal__header, styles.PhotosModal__header)}
      >
        <h4 className={baseStyles.modal__heading}>Uploads</h4>
        <h5>{title}</h5>
      </header>

      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="photos-modal-close"
      >
        ×
      </button>

      <div
        className={clsx(
          baseStyles.modal__main,
          styles.PhotosModal__main,
          isDragActive && styles['PhotosModal__main--dragging'],
          isDragActive && disabled && styles['PhotosModal__main--disabled']
        )}
        data-testid="inspection-item-photos-dropzone"
        {...getRootProps()}
      >
        <div
          className={clsx(
            baseStyles.modal__main__content,
            styles.PhotosModal__content
          )}
        >
          <input {...getInputProps()} />
          {hasExistingPhotos && (
            <ul
              className={styles.PhotosModal__photos__list}
              data-testid="photos-modal-photos"
            >
              {unpublishedPhotosData.map((item) => (
                <li
                  key={item.id}
                  className={styles.PhotosModal__photos__list__item}
                  data-testid="photos-modal-unpublished-photo-list"
                >
                  <button
                    className={styles.PhotosModal__photos__list__item__remove}
                    onClick={(ev) => onClickRemovePhoto(ev, item.id)}
                    data-testid="photos-modal-photos-remove"
                  >
                    ×
                  </button>
                  <div
                    className={styles.PhotosModal__photos__list__item__image}
                    onClick={(ev) =>
                      onClickImage(ev, {
                        downloadURL: item.photoData,
                        ...item
                      })
                    }
                  >
                    <img src={item.photoData} alt={item.caption} />
                    {item.caption && (
                      <div
                        className={
                          styles.PhotosModal__photos__list__item__image__caption
                        }
                      >
                        {item.caption}
                      </div>
                    )}
                  </div>
                  {!item.caption && (
                    <button
                      className={
                        styles.PhotosModal__photos__list__item__caption
                      }
                      onClick={(ev) => onClickAddCaption(ev, item.id)}
                      data-testid="photo-modal-photo-add-caption"
                    >
                      Add Caption
                    </button>
                  )}
                </li>
              ))}
              {photosDataItems.map((item) => (
                <li
                  key={item.id}
                  className={styles.PhotosModal__photos__list__item}
                >
                  <div
                    className={styles.PhotosModal__photos__list__item__image}
                    onClick={(ev) => onClickImage(ev, item)}
                  >
                    <img src={item.downloadURL} alt={item.caption} />
                    {item.caption && (
                      <div
                        className={
                          styles.PhotosModal__photos__list__item__image__caption
                        }
                      >
                        {item.caption}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div
            className={clsx(
              styles.PhotosModal__buttons,
              !hasExistingPhotos && styles['PhotosModal__buttons--noPhotos']
            )}
          >
            <button
              className={styles.PhotosModal__buttons__add}
              disabled={disabled}
            >
              Add Files
            </button>
          </div>
        </div>
        <PhotoPreview photoData={photoForPreview} onClose={onClosePreview} />
      </div>
    </div>
  );
};

PhotosModal.defaultProps = {
  unpublishedPhotosData: [],
  disabled: false
};

export default Modal(PhotosModal, false, styles.PhotosModal);
