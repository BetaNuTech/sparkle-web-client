/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, useState, MouseEvent, useCallback } from 'react';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';
import unPublishedPhotoDataModel from '../models/inspections/templateItemUnpublishedPhotoData';
import Modal, { Props as ModalProps } from '../Modal';
import IndexedDBStorage from '../IndexedDBStorage';
import PhotoPreview from './PhotoPreview';
import baseStyles from '../Modal/styles.module.scss';
import styles from './styles.module.scss';

type userNotifications = (message: string, options?: any) => any;

interface Props extends ModalProps {
  onClose: () => void;
  photosData: Record<string, photoDataModel>;
  unpublishedPhotosData: unPublishedPhotoDataModel[];
  onChangeFiles(files: Record<string, string | number>): Promise<void>;
  onAddCaption(unpublishedPhotoId: string, captionText: string): void;
  onRemovePhoto(unpublishedPhotoId: string): void;
  sendNotification: userNotifications;
  disabled?: boolean;
  title?: string;
  subTitle?: string;
}

const PhotosModal: FunctionComponent<Props> = ({
  photosData,
  unpublishedPhotosData,
  onClose,
  onChangeFiles,
  onAddCaption,
  onRemovePhoto,
  sendNotification,
  disabled,
  title,
  subTitle
}) => {
  const photosDataItems = Object.keys(photosData || {})
    .map((key) => ({
      id: key,
      ...photosData[key]
    }))
    // sort from newest to oldest photos data bases on UNIX timestamp based id
    .sort(({ id: aId }, { id: bId }) => Number(bId) - Number(aId));

  const [photoForPreview, setPhotoForPreview] = useState(null);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const [processingPhotosCount, setProcessingPhotosCount] = useState(0);
  const [storedPhotosCount, setStoredPhotosCount] = useState(0);

  const hasExistingPhotos =
    photosDataItems.length > 0 || unpublishedPhotosData.length > 0;

  // Promise to read file data into url
  const fileToDataURI = (file: File): Promise<string> =>
    // Read file as data URL
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(`${fileReader.result}`);
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
    setIsProcessingPhotos(true);

    const proccessErrors = [];
    const storageErrors = [];
    const filesDataUri = [];
    let processedCounter = files.length;
    setProcessingPhotosCount(processedCounter);

    // Convert file ito file data URL's one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const dataUri = await fileToDataURI(file);
        filesDataUri.push({ dataUri, size: file.size });
      } catch (err) {
        proccessErrors.push(err);
      }

      // Update processed file count
      processedCounter -= 1;
      setProcessingPhotosCount(processedCounter);
    }

    if (proccessErrors.length > 0) {
      const multiple = proccessErrors.length > 1;
      sendNotification(
        `${
          multiple ? 'Some files' : 'One file'
        } could not be processed, please try again or add ${
          multiple ? 'different files' : 'a different file'
        }`,
        {
          type: 'error'
        }
      );
    }

    let storedCounter = filesDataUri.length;
    setStoredPhotosCount(storedCounter);

    // Save each file to local DB
    // eslint-disable-next-line no-restricted-syntax
    for (const file of filesDataUri) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await onChangeFiles(file);
      } catch (err) {
        storageErrors.push(err);
      }

      // Update stored file count
      storedCounter -= 1;
      setStoredPhotosCount(storedCounter);
    }

    if (storageErrors.length > 0) {
      const multiple = storageErrors.length > 1;
      sendNotification(
        `${
          multiple ? 'Some files' : 'One file'
        } could not be stored locally, please try again or add ${
          multiple ? 'different files' : 'a different file'
        }`,
        {
          type: 'error'
        }
      );
    }

    setIsProcessingPhotos(false);
  };

  const onClickImage = (photoData: photoDataModel) => {
    setPhotoForPreview(photoData);
  };

  const onClickAddCaption = (unPublishedPhotoId: string) => {
    // eslint-disable-next-line no-alert
    const captionText = window.prompt('Enter your caption');
    if (captionText) {
      onAddCaption(unPublishedPhotoId, captionText);
    }
  };

  const onClickRemovePhoto = (photoId: string) => {
    onRemovePhoto(photoId);
  };

  const onClosePreview = (
    evt: MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    evt.stopPropagation();
    setPhotoForPreview(null);
  };

  const onClickPhotoItem = (evt: MouseEvent<HTMLLIElement>) => {
    evt.stopPropagation();
  };

  // show in app error based on
  // rejected files type and size
  const processRejectedFiles = (rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      let hasSizeError = false;
      const rejectedFileTypes = [];

      rejectedFiles.forEach((rejectedFile: FileRejection) => {
        if (
          rejectedFile.errors.some(
            (error: FileError) => error.code === 'file-too-large'
          )
        ) {
          hasSizeError = true;
        }
        if (
          rejectedFile.errors.some(
            (error: FileError) => error.code === 'file-invalid-type'
          )
        ) {
          rejectedFileTypes.push(rejectedFile?.file?.type || '');
        }
      });

      Array.from(new Set<string>(rejectedFileTypes)).map((type: string) =>
        sendNotification(
          `File format ${type.toUpperCase()} is not supported, please try a different file`,
          {
            type: 'error'
          }
        )
      );

      if (hasSizeError) {
        sendNotification('Photos larger than 10mb is not supported', {
          type: 'error'
        });
      }
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (disabled) return;
    processAcceptedFiles(acceptedFiles);
    processRejectedFiles(rejectedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disableClick =
    disabled || Boolean(photoForPreview) || isProcessingPhotos;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/gif, image/jpeg ,capture=camera',
    noClick: disableClick,
    // maximum file upload limit 9.9MB
    maxSize: 9900000
  });

  const disableUpload = (isDragActive && disabled) || isProcessingPhotos;

  return (
    <div className={styles.PhotosModal} data-testid="photos-modal">
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>{title}</h4>
        {subTitle && <h5>{subTitle}</h5>}
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
          disableUpload && styles['PhotosModal__main--disabled']
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
                  className={clsx(
                    styles.PhotosModal__photos__list__item,
                    isProcessingPhotos && '-cu-not-allowed'
                  )}
                  data-testid="photos-modal-unpublished-photo-list"
                  onClick={onClickPhotoItem}
                >
                  {!isProcessingPhotos && (
                    <button
                      className={styles.PhotosModal__photos__list__item__remove}
                      onClick={() => onClickRemovePhoto(item.id)}
                      data-testid="photos-modal-photos-remove"
                    >
                      ×
                    </button>
                  )}
                  <div
                    className={styles.PhotosModal__photos__list__item__image}
                    onClick={() =>
                      !isProcessingPhotos &&
                      onClickImage({
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
                  {!item.caption && !isProcessingPhotos && (
                    <button
                      className={
                        styles.PhotosModal__photos__list__item__caption
                      }
                      onClick={() => onClickAddCaption(item.id)}
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
                  className={clsx(
                    styles.PhotosModal__photos__list__item,
                    isProcessingPhotos && '-cu-not-allowed'
                  )}
                  onClick={(evt) =>
                    !isProcessingPhotos && onClickPhotoItem(evt)
                  }
                >
                  <div
                    className={styles.PhotosModal__photos__list__item__image}
                    onClick={() => !isProcessingPhotos && onClickImage(item)}
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
            {!disabled && (
              <button
                className={clsx(
                  styles.PhotosModal__buttons__add,
                  isProcessingPhotos &&
                    styles['PhotosModal__buttons__add--isProcessing']
                )}
                disabled={isProcessingPhotos}
              >
                {isProcessingPhotos &&
                  (processingPhotosCount
                    ? `Processing ${processingPhotosCount} files`
                    : `Storing ${storedPhotosCount} files locally`)}

                {!isProcessingPhotos && 'Add Files'}
              </button>
            )}
          </div>
        </div>
        <PhotoPreview photoData={photoForPreview} onClose={onClosePreview} />
      </div>
      <IndexedDBStorage hiddenUntil={75} />
    </div>
  );
};

PhotosModal.defaultProps = {
  unpublishedPhotosData: [],
  disabled: false,
  title: 'Uploads'
};

export default Modal(PhotosModal, false, styles.PhotosModal);
