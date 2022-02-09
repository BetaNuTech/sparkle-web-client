/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, useState, MouseEvent, useCallback } from 'react';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';
import unPublishedPhotoDataModel from '../models/inspections/templateItemUnpublishedPhotoData';
import DeficientItemCompletedPhoto from '../models/deficientItems/deficientItemCompletedPhoto';
import Modal, { Props as ModalProps } from '../Modal';

import IndexedDBStorage from '../IndexedDBStorage';
import PhotoPreview from './PhotoPreview';
import UnpublishedPhotoItem from './UnpublishedPhotoItem';
import PublishedPhotoItem from './PublishedPhotoItem';
import CompletedPhotosList from './CompletedPhotosList';

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
  completedPhotos?: DeficientItemCompletedPhoto;
  showCompletedList?: boolean;
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
  subTitle,
  completedPhotos,
  showCompletedList
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

  const onClickPhotoItem = (evt: MouseEvent<HTMLElement>) => {
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
    <div className={styles.photosModal} data-testid="photos-modal">
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
          styles.photosModal__main,
          isDragActive && styles['photosModal__main--dragging'],
          disableUpload && styles['photosModal__main--disabled']
        )}
        data-testid="inspection-item-photos-dropzone"
        {...getRootProps()}
      >
        <div
          className={clsx(
            baseStyles.modal__main__content,
            styles.photosModal__content
          )}
        >
          {showCompletedList && !disabled && (
            <h5 className={styles.groupHeading}>New Completed Photo(s)</h5>
          )}
          <input {...getInputProps()} />
          {hasExistingPhotos && (
            <ul className={styles.list} data-testid="photos-modal-photos">
              {unpublishedPhotosData.map((item) => (
                <UnpublishedPhotoItem
                  key={item.id}
                  photoData={item}
                  onClick={onClickPhotoItem}
                  isProcessingPhotos={isProcessingPhotos}
                  onClickRemovePhoto={onClickRemovePhoto}
                  onClickImage={onClickImage}
                  onClickAddCaption={onClickAddCaption}
                />
              ))}
              {photosDataItems.map((item) => (
                <PublishedPhotoItem
                  key={item.id}
                  photoData={item}
                  onClick={onClickPhotoItem}
                  isProcessingPhotos={isProcessingPhotos}
                  onClickImage={onClickImage}
                />
              ))}
            </ul>
          )}
          {!disabled && (
            <div
              className={clsx(
                styles.actionWrapper,
                !hasExistingPhotos &&
                  !completedPhotos &&
                  styles['actionWrapper--noPhotos']
              )}
            >
              <button
                className={clsx(
                  styles.addAction,
                  isProcessingPhotos && styles['addAction--isProcessing']
                )}
                disabled={isProcessingPhotos}
              >
                {isProcessingPhotos &&
                  (processingPhotosCount
                    ? `Processing ${processingPhotosCount} files`
                    : `Storing ${storedPhotosCount} files locally`)}

                {!isProcessingPhotos && 'Add Files'}
              </button>
            </div>
          )}

          {showCompletedList && (
            <CompletedPhotosList
              completedPhotos={completedPhotos}
              onClickPhotoItem={onClickPhotoItem}
              isProcessingPhotos={isProcessingPhotos}
              onClickImage={onClickImage}
            />
          )}
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
  title: 'Uploads',
  showCompletedList: false
};

export default Modal(PhotosModal, false, styles.photosModal);
