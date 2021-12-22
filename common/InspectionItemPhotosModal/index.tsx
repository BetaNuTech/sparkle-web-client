import clsx from 'clsx';
import {
  ChangeEvent,
  FunctionComponent,
  useRef,
  useState,
  MouseEvent
} from 'react';
import photoDataModel from '../models/inspectionTemplateItemPhotoData';
import unPublishedPhotoDataModel from '../models/inspections/templateItemUnpublishedPhotoData';
import Modal, { Props as ModalProps } from '../Modal';
import PhotoPreview from './PhotoPreview';
import baseStyles from '../Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  photosData: Record<string, photoDataModel>;
  unpublishedPhotosData: unPublishedPhotoDataModel[];
  title: string;
  onChangeFiles(files: Array<string>): void;
}

const PhotosModal: FunctionComponent<Props> = ({
  photosData,
  unpublishedPhotosData,
  onClose,
  title,
  onChangeFiles
}) => {
  const photosDataItems = Object.keys(photosData || {})
    .map((key) => ({
      id: key,
      ...photosData[key]
    }))
    // sort from newest to oldest photos data bases on UNIX timestamp based id
    .sort(({ id: aId }, { id: bId }) => Number(bId) - Number(aId));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoForPreview, setPhotoForPreview] = useState(null);

  const hasExistingPhotos =
    photosDataItems.length > 0 || unpublishedPhotosData.length > 0;

  // Promise to read file data into url
  const fileToDataURI = (file: File) =>
    // Read file as data URL
    new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });

  const onClickAddFiles = () => {
    fileInputRef?.current?.click();
  };

  // Publish all files data URL's to parent
  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Convert file list to an array
    const files = Array.from(event.target.files);

    // List of promises for file data URL's
    const filesToDataUris = files.map(async (file) => fileToDataURI(file));
    Promise.all(filesToDataUris).then((res: string[]) => onChangeFiles(res));
  };

  const onClickImage = (
    ev: MouseEvent<HTMLDivElement>,
    photoData: photoDataModel
  ) => {
    ev.stopPropagation();
    setPhotoForPreview(photoData);
  };

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

      <div className={clsx(baseStyles.modal__main, styles.PhotosModal__main)}>
        <div
          className={clsx(
            baseStyles.modal__main__content,
            styles.PhotosModal__content
          )}
          onClick={onClickAddFiles}
        >
          {hasExistingPhotos && (
            <ul
              className={styles.PhotosModal__photos__list}
              data-testid="photos-modal-photos"
            >
              {unpublishedPhotosData.map((item) => (
                <li
                  key={item.id}
                  className={styles.PhotosModal__photos__list__item}
                >
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
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*;capture=camera"
              multiple
              className={styles.PhotosModal__buttons__fileInput}
              onChange={onFileInputChange}
            />
            <button className={styles.PhotosModal__buttons__add}>
              Add Files
            </button>
          </div>
        </div>
        <PhotoPreview
          photoData={photoForPreview}
          onClose={() => setPhotoForPreview(null)}
        />
      </div>
    </div>
  );
};

PhotosModal.defaultProps = {
  unpublishedPhotosData: []
};

export default Modal(PhotosModal, false, styles.PhotosModal);
