import { FunctionComponent, useEffect, useState } from 'react';
import PhotoDataModel from '../../models/inspectionTemplateItemPhotoData';
import Notes from './Notes';
import Photos from './Photos';
import styles from '../styles.module.scss';

interface Props {
  photos?: boolean;
  notes?: boolean;
  inspectorNotes?: string;
  onClickAttachmentNotes?(): void;
  onClickPhotos?(): void;
  photosData?: Record<string, PhotoDataModel>;
  unPublishedPhotosDataCount?: number;
  isDeficient?: boolean;
  canEdit: boolean;
  onMouseDownNotes?(): void;
  onMouseDownAttachment?(): void;
}

const Attachment: FunctionComponent<Props> = ({
  photos,
  notes,
  inspectorNotes,
  onClickAttachmentNotes,
  onClickPhotos,
  photosData,
  unPublishedPhotosDataCount,
  isDeficient,
  canEdit,
  onMouseDownNotes,
  onMouseDownAttachment
}) => {
  const isSelectedNotes = Boolean(inspectorNotes);
  const isSelectedPhotos =
    Object.keys(photosData || {}).length > 0 || unPublishedPhotosDataCount > 0;
  const isNoteRequired = isDeficient && !isSelectedNotes && notes;
  const isPhotoRequired = isDeficient && !isSelectedPhotos && photos;

  // Same as above but syncronized on the
  // top of every second to keep animations
  // from all flashing at disjointed times
  const [isSyncronizedNoteRequired, setIsSyncronizedNoteRequired] =
    useState(false);
  const [isSyncronizedPhotoRequired, setIsSyncronizedPhotoRequired] =
    useState(false);

  useEffect(() => {
    if (!isNoteRequired) {
      setIsSyncronizedNoteRequired(false);
    }

    if (!isPhotoRequired) {
      setIsSyncronizedPhotoRequired(false);
    }

    // Set required at top
    // of next UNIX second
    const now = Date.now();
    const nextSecond = Math.ceil(now / 1000) * 1000;
    const timeout = nextSecond - now;
    const timeoutId = setTimeout(() => {
      setIsSyncronizedNoteRequired(isNoteRequired);
      setIsSyncronizedPhotoRequired(isPhotoRequired);
    }, timeout);

    // clearing timeout
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNoteRequired, isPhotoRequired]);

  return (
    <ul className={styles.inspection__attachment}>
      <Notes
        enabled={notes}
        onClick={onClickAttachmentNotes}
        selected={isSelectedNotes}
        canEdit={canEdit}
        isRequired={isSyncronizedNoteRequired}
        onMouseDown={onMouseDownNotes}
      />
      <Photos
        enabled={photos}
        onClick={onClickPhotos}
        selected={isSelectedPhotos}
        canEdit={canEdit}
        isRequired={isSyncronizedPhotoRequired}
        onMouseDown={onMouseDownAttachment}
      />
    </ul>
  );
};

Attachment.defaultProps = {
  photos: false,
  notes: false,
  canEdit: false,
  isDeficient: false,
  onClickAttachmentNotes: () => {}, // eslint-disable-line
  onMouseDownNotes: () => {}, // eslint-disable-line
  onMouseDownAttachment: () => {}, // eslint-disable-line
  unPublishedPhotosDataCount: 0
};

export default Attachment;
