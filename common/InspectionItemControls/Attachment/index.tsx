import { FunctionComponent } from 'react';
import AttachmentNotes from '../AttachmentNotes';
import AttachmentPhoto from '../AttachmentPhoto';
import styles from '../styles.module.scss';

interface Props {
  photos?: boolean;
  notes?: boolean;
  inspectorNotes?: string;
  onClickAttachmentNotes(): void;
}

const Photo: FunctionComponent<Props> = ({
  photos,
  notes,
  inspectorNotes,
  onClickAttachmentNotes
}) => {
  const isSelected = Boolean(inspectorNotes);
  return (
    <ul className={styles.inspection__attachment}>
      <AttachmentNotes
        enabled={notes}
        onClickAttachmentNotes={onClickAttachmentNotes}
        selected={isSelected}
      />
      <AttachmentPhoto enabled={photos} />
    </ul>
  );
};

Photo.defaultProps = {
  photos: false,
  notes: false,
  onClickAttachmentNotes: () => {} // eslint-disable-line
};

export default Photo;
