import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Modal from '../../../../common/Modal/index';
import modalStyles from '../../../../common/Modal/styles.module.scss';
import yardiWorkOrderAttachment, {
  WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
} from '../../../../common/models/yardi/workOrderAttachment';
import useWorkOrderAttachments from '../../hooks/useWorkOrderAttachments';
import {
  formatAttachmentDate,
  formatFileSize,
  isImageAttachment,
  revokeFileUrl,
  toFileUrl
} from '../../utils/attachments';
import styles from '../styles.module.scss';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  propertyId: string;
  workOrderId: string;
  canUpload: boolean;
  sendNotification: userNotifications;
  onLoaded?(count: number): void;
}

// File types offered by the picker; Yardi
// has the final say and rejects inline
export const ACCEPTED_FILE_TYPES = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt';

interface Preview {
  attachment: yardiWorkOrderAttachment;
  url: string;
}

const PreviewContent: FunctionComponent<any> = ({
  attachment,
  url,
  onClose
}) => {
  // Yardi stores whatever it was given, so
  // an "image" may not decode; say so and
  // leave the download as the way to see it
  const [isBroken, setIsBroken] = useState(false);

  return (
    <>
      <header className={modalStyles.modalPrompt__header}>
        <h5 className={modalStyles.modalPrompt__heading}>
          {attachment.description || attachment.name}
        </h5>
      </header>
      <div className={modalStyles.modalPrompt__main}>
        <div className={modalStyles.modalPrompt__main__content}>
          {isBroken ? (
            <p
              className={styles.attachments__status}
              data-testid="work-order-attachment-preview-broken"
            >
              This file could not be displayed as an image. Download it to open
              it in another app.
            </p>
          ) : (
            <img
              src={url}
              alt={attachment.description || attachment.name}
              className={styles.attachments__preview}
              onError={() => setIsBroken(true)}
              data-testid="work-order-attachment-preview"
            />
          )}
        </div>
        <footer className={modalStyles.modalPrompt__main__footer}>
          <a
            href={url}
            download={attachment.name}
            className={clsx(
              'button',
              'gray',
              modalStyles.modal__mainFooterbutton
            )}
            data-testid="work-order-attachment-download"
          >
            Download
          </a>
          <button
            type="button"
            className={clsx(
              'button',
              'primary',
              modalStyles.modal__mainFooterbutton
            )}
            onClick={onClose}
            data-testid="work-order-attachment-preview-close"
          >
            Close
          </button>
        </footer>
      </div>
    </>
  );
};

// The shared prompt sits beside the slide
// nav, which pushes it off narrow screens,
// so the preview takes the whole width
const PreviewModal = Modal(PreviewContent, true, styles.attachments__modal);

// Rendered at the body so the layout's
// transformed wrappers cannot become the
// containing block of the fixed modal
const PreviewPortal: FunctionComponent<any> = (props) =>
  typeof document === 'undefined'
    ? null
    : createPortal(<PreviewModal {...props} />, document.body);

// Save a fetched file through the
// browser's download handling
const triggerDownload = (url: string, name: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => revokeFileUrl(url), 1000);
};

// Files stored on a work order in Yardi,
// shown or downloaded on demand, with an
// upload form when writes are enabled
const WorkOrderAttachments: FunctionComponent<Props> = ({
  propertyId,
  workOrderId,
  canUpload,
  sendNotification,
  onLoaded
}) => {
  const {
    status,
    data,
    error,
    loadAttachment,
    upload,
    isUploading,
    uploadErrors,
    generalUploadErrors,
    clearUploadErrors
  } = useWorkOrderAttachments(sendNotification, propertyId, workOrderId);

  const [isAdding, setIsAdding] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [openingName, setOpeningName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  // Let the page know how many files there
  // are, so its header can show the paperclip
  // as soon as the first upload lands
  useEffect(() => {
    if (status === 'success' && onLoaded) onLoaded(data.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data]);

  const onFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const [picked] = Array.from(evt.target.files || []);
    setFile(picked || null);
    clearUploadErrors();
  };

  const resetForm = () => {
    setFile(null);
    setDescription('');
    if (fileInput.current) fileInput.current.value = '';
    if (cameraInput.current) cameraInput.current.value = '';
    clearUploadErrors();
  };

  const onCancelAdd = () => {
    resetForm();
    setIsAdding(false);
  };

  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    const uploaded = await upload(file, description);
    if (uploaded) {
      resetForm();
      setIsAdding(false);
    }
  };

  const onOpen = async (attachment: yardiWorkOrderAttachment) => {
    setOpeningName(attachment.name);
    const loaded = await loadAttachment(attachment.name);
    setOpeningName('');
    if (!loaded) return;

    const url = toFileUrl(loaded);
    if (isImageAttachment(loaded)) {
      setPreview({ attachment: loaded, url });
    } else {
      triggerDownload(url, loaded.name);
    }
  };

  const onClosePreview = () => {
    if (preview) revokeFileUrl(preview.url);
    setPreview(null);
  };

  return (
    <section
      className={styles.attachments}
      data-testid="work-order-attachments"
    >
      <div className={styles.attachments__header}>
        <h3 className={styles.form__heading}>Attachments</h3>
        {canUpload && !isAdding && (
          <button
            type="button"
            className={styles.field__link}
            onClick={() => setIsAdding(true)}
            data-testid="work-order-attachment-add"
          >
            Add attachment
          </button>
        )}
      </div>

      {canUpload && isAdding && (
        <form
          className={styles.attachments__form}
          onSubmit={onSubmit}
          data-testid="work-order-attachment-form"
        >
          <div
            className={clsx(
              styles.field,
              uploadErrors.file && styles['field--invalid']
            )}
          >
            <label
              className={styles.field__label}
              htmlFor="work-order-attachment-file"
            >
              File <span className={styles.field__required}>*</span>
            </label>
            <input
              id="work-order-attachment-file"
              ref={fileInput}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              className={styles.field__input}
              disabled={isUploading}
              onChange={onFileChange}
              data-testid="work-order-attachment-file"
            />
            {/* Phones open the camera straight away
                for this input, so photos can be taken
                on the spot without the file chooser */}
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className={styles.attachments__hiddenInput}
              disabled={isUploading}
              onChange={onFileChange}
              tabIndex={-1}
              aria-hidden="true"
              data-testid="work-order-attachment-camera"
            />
            <button
              type="button"
              className={styles.field__link}
              disabled={isUploading}
              onClick={() => cameraInput.current && cameraInput.current.click()}
              data-testid="work-order-attachment-take-photo"
            >
              Take photo
            </button>
            {file && !uploadErrors.file && (
              <span
                className={styles.field__hint}
                data-testid="work-order-attachment-picked"
              >
                {file.name} · {formatFileSize(file.size)}
              </span>
            )}
            {!file && !uploadErrors.file && (
              <span className={styles.field__hint}>
                Photos are resized before upload; documents up to 6 MB
              </span>
            )}
            {uploadErrors.file && (
              <span
                className={styles.field__error}
                data-testid="work-order-attachment-error-file"
              >
                {uploadErrors.file}
              </span>
            )}
          </div>

          <div
            className={clsx(
              styles.field,
              uploadErrors.description && styles['field--invalid']
            )}
          >
            <label
              className={styles.field__label}
              htmlFor="work-order-attachment-description"
            >
              Description
            </label>
            <input
              id="work-order-attachment-description"
              type="text"
              className={styles.field__input}
              value={description}
              maxLength={WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH}
              placeholder="What the file shows (optional)"
              disabled={isUploading}
              onChange={(evt) => setDescription(evt.target.value)}
              data-testid="work-order-attachment-description"
            />
            {uploadErrors.description && (
              <span
                className={styles.field__error}
                data-testid="work-order-attachment-error-description"
              >
                {uploadErrors.description}
              </span>
            )}
          </div>

          {generalUploadErrors.length > 0 && (
            <ul
              className={styles.attachments__errors}
              data-testid="work-order-attachment-errors"
            >
              {generalUploadErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}

          <div className={styles.attachments__actions}>
            <button
              type="button"
              className={styles['action--secondary']}
              disabled={isUploading}
              onClick={onCancelAdd}
              data-testid="work-order-attachment-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.action}
              disabled={isUploading || !file}
              data-testid="work-order-attachment-upload"
            >
              {isUploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      )}

      {status === 'loading' && (
        <p
          className={styles.attachments__status}
          data-testid="work-order-attachments-loading"
        >
          Loading attachments…
        </p>
      )}

      {status === 'error' && (
        <p className={styles.notice} data-testid="work-order-attachments-error">
          {error}
        </p>
      )}

      {status === 'success' && data.length === 0 && (
        <p
          className={styles.attachments__status}
          data-testid="work-order-attachments-empty"
        >
          No attachments
        </p>
      )}

      {data.length > 0 && (
        <ul className={styles.attachments__list}>
          {data.map((attachment) => {
            const isImage = isImageAttachment(attachment);
            const isOpening = openingName === attachment.name;
            const meta = [
              `${attachment.extension || ''}`.toUpperCase(),
              formatFileSize(attachment.size),
              formatAttachmentDate(attachment.createdAt)
            ]
              .filter(Boolean)
              .join(' · ');
            let openLabel = isImage ? 'View' : 'Download';
            if (isOpening) openLabel = 'Loading…';

            return (
              <li
                key={attachment.id || attachment.name}
                className={styles.attachments__item}
                data-testid="work-order-attachment"
              >
                <div className={styles.attachments__info}>
                  <span
                    className={styles.attachments__name}
                    data-testid="work-order-attachment-name"
                  >
                    {attachment.description || attachment.name}
                  </span>
                  {attachment.description && (
                    <span className={styles.attachments__meta}>
                      {attachment.name}
                    </span>
                  )}
                  <span
                    className={styles.attachments__meta}
                    data-testid="work-order-attachment-meta"
                  >
                    {meta}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles['action--secondary']}
                  disabled={Boolean(openingName)}
                  onClick={() => onOpen(attachment)}
                  data-testid="work-order-attachment-open"
                >
                  {openLabel}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <PreviewPortal
        isVisible={Boolean(preview)}
        onClose={onClosePreview}
        attachment={preview?.attachment}
        url={preview?.url}
      />
    </section>
  );
};

WorkOrderAttachments.defaultProps = {
  onLoaded: () => null
};

export default WorkOrderAttachments;
