import { FunctionComponent, useEffect, useState } from 'react';
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
  isDeficient: boolean;
  isDisabled: boolean;
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
  isDisabled
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
      <AttachmentNotes
        enabled={notes}
        onClickAttachmentNotes={onClickAttachmentNotes}
        selected={isSelectedNotes}
        isDisabled={isDisabled}
        isRequired={isSyncronizedNoteRequired}
      />
      <AttachmentPhoto
        enabled={photos}
        onClickPhotos={onClickPhotos}
        selected={isSelectedPhotos}
        isDisabled={isDisabled}
        isRequired={isSyncronizedPhotoRequired}
      />
    </ul>
  );
};

Attachment.defaultProps = {
  photos: false,
  notes: false,
  onClickAttachmentNotes: () => {}, // eslint-disable-line
  unPublishedPhotosDataCount: 0
};

export default Attachment;
