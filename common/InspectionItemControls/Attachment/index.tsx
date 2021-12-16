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
  photosData: Record<string, photoDataModel>;
}

const Photo: FunctionComponent<Props> = ({
  photos,
  notes,
  inspectorNotes,
  onClickAttachmentNotes,
  photosData
}) => {
  const isSelectedNotes = Boolean(inspectorNotes);
  const isSelectedPhotos = Object.keys(photosData || {}).length > 0;

  return (
    <ul className={styles.inspection__attachment}>
      <AttachmentNotes
        enabled={notes}
        onClickAttachmentNotes={onClickAttachmentNotes}
        selected={isSelectedNotes}
      />
      <AttachmentPhoto
        enabled={photos}
        selected={isSelectedPhotos}
      />
    </ul>
  );
};

Photo.defaultProps = {
  photos: false,
  notes: false,
  onClickAttachmentNotes: () => {} // eslint-disable-line
};

export default Photo;
