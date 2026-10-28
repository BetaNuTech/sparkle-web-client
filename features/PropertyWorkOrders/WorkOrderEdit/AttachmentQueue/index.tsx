import { ChangeEvent, FunctionComponent, useRef } from 'react';
import { WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH } from '../../../../common/models/yardi/workOrderAttachment';
import { QueuedAttachment } from '../../utils/pendingAttachments';
import { formatFileSize } from '../../utils/attachments';
import { ACCEPTED_FILE_TYPES } from '../Attachments';
import styles from '../styles.module.scss';

interface Props {
  items: QueuedAttachment[];
  isDisabled?: boolean;
  onAdd(files: File[]): void;
  onRemove(id: string): void;
  onDescriptionChange(id: string, description: string): void;
}

// Photos and files picked while creating a
// work order; they upload once it exists
const AttachmentQueue: FunctionComponent<Props> = ({
  items,
  isDisabled,
  onAdd,
  onRemove,
  onDescriptionChange
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const onFilesChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(evt.target.files || []);
    if (picked.length) onAdd(picked);
    // Allow picking the same file again
    // eslint-disable-next-line no-param-reassign
    evt.target.value = '';
  };

  return (
    <section
      className={styles.form__section}
      data-testid="work-order-attachment-queue"
    >
      <h3 className={styles.form__heading}>Photos &amp; files</h3>
      <p className={styles.attachments__status}>
        Added to the work order right after it is created
      </p>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        multiple
        className={styles.attachments__hiddenInput}
        disabled={isDisabled}
        onChange={onFilesChange}
        tabIndex={-1}
        data-testid="work-order-queue-file"
      />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.attachments__hiddenInput}
        disabled={isDisabled}
        onChange={onFilesChange}
        tabIndex={-1}
        aria-hidden="true"
        data-testid="work-order-queue-camera"
      />
      <div className={styles.attachments__pickers}>
        <button
          type="button"
          className={styles['attachments__button--primary']}
          disabled={isDisabled}
          onClick={() => cameraInput.current && cameraInput.current.click()}
          data-testid="work-order-queue-take-photo"
        >
          Take photo
        </button>
        <button
          type="button"
          className={styles.attachments__button}
          disabled={isDisabled}
          onClick={() => fileInput.current && fileInput.current.click()}
          data-testid="work-order-queue-choose"
        >
          Choose files
        </button>
      </div>

      {items.length > 0 && (
        <ul className={styles.attachments__queue}>
          {items.map((item) => (
            <li
              key={item.id}
              className={styles.attachments__queueItem}
              data-testid="work-order-queue-item"
            >
              <div className={styles.attachments__queueFile}>
                <span
                  className={styles.attachments__name}
                  data-testid="work-order-queue-item-name"
                >
                  {item.file.name}
                </span>
                <span className={styles.attachments__meta}>
                  {formatFileSize(item.file.size)}
                </span>
              </div>
              <input
                type="text"
                className={styles.field__input}
                value={item.description}
                maxLength={WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH}
                placeholder="What it shows (optional)"
                disabled={isDisabled}
                onChange={(evt) =>
                  onDescriptionChange(item.id, evt.target.value)
                }
                aria-label={`Description for ${item.file.name}`}
                data-testid="work-order-queue-item-description"
              />
              <button
                type="button"
                className={styles.attachments__button}
                disabled={isDisabled}
                onClick={() => onRemove(item.id)}
                data-testid="work-order-queue-item-remove"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

AttachmentQueue.defaultProps = {
  isDisabled: false
};

export default AttachmentQueue;
