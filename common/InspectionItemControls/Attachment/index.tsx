import { FunctionComponent } from 'react';
import photoDataModel from '../../models/inspectionTemplateItemPhotoData';
import AttachmentNotes from '../AttachmentNotes';
import AttachmentPhoto from '../AttachmentPhoto';
import styles from '../styles.module.scss';

interface Props {
  photos?: boolean;
  notes?: boolean;
  inspectorNotes?: string;
  onClickAttachmentNotes?(): void;
  onClickPhotos?(): void;
  photosData: Record<string, photoDataModel>;
  unPublishedPhotosDataCount: number;
}

const Photo: FunctionComponent<Props> = ({
  photos,
  notes,
  inspectorNotes,
  onClickAttachmentNotes,
  onClickPhotos,
  photosData,
  unPublishedPhotosDataCount
}) => {
  const isSelectedNotes = Boolean(inspectorNotes);
  const isSelectedPhotos =
    Object.keys(photosData || {}).length > 0 || unPublishedPhotosDataCount > 0;

  return (
    <ul className={styles.inspection__attachment}>
      <AttachmentNotes
        enabled={notes}
        onClickAttachmentNotes={onClickAttachmentNotes}
        selected={isSelectedNotes}
      />
      <AttachmentPhoto
        enabled={photos}
        onClickPhotos={onClickPhotos}
        selected={isSelectedPhotos}
      />
    </ul>
  );
};

Photo.defaultProps = {
  photos: false,
  notes: false,
  onClickAttachmentNotes: () => {}, // eslint-disable-line
  unPublishedPhotosDataCount: 0
};

export default Photo;
