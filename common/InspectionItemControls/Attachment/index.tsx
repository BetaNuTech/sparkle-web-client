import { FunctionComponent } from 'react';
import AttachmentNotes from '../AttachmentNotes';
import AttachmentPhoto from '../AttachmentPhoto';
import styles from '../styles.module.scss';

interface Props {
  photos?: boolean;
  notes?: boolean;
}

const Photo: FunctionComponent<Props> = ({ photos, notes }) => (
  <ul className={styles.inspection__attachment}>
    <AttachmentNotes enabled={notes} />
    <AttachmentPhoto enabled={photos} />
  </ul>
);

Photo.defaultProps = {
  photos: false,
  notes: false
};

export default Photo;
