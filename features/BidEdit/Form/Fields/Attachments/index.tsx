import { ChangeEvent, FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import AttachmentList from '../../../../../common/AttachmentList';
import attachmentModel from '../../../../../common/models/attachment';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import styles from '../../../styles.module.scss';

interface Props {
  isUploadingFile: boolean;
  onFileChange(ev: ChangeEvent<HTMLInputElement>);
  attachments: Array<attachmentModel>;
  openAttachmentDeletePrompt(attachment: attachmentModel): void;
  isNewBid: boolean;
}

const Attachments: FunctionComponent<Props> = ({
  isUploadingFile,
  onFileChange,
  attachments,
  openAttachmentDeletePrompt,
  isNewBid
}) => {
  const inputFile = useRef(null);

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  if (isNewBid) {
    return null;
  }
  return (
    <div className={clsx(styles.form__group, '-mt-lg')}>
      <div className={styles.form__formSeparatedLabel}>
        <label htmlFor="bidVendorDetails">Attachments</label>
        <button
          type="button"
          className={styles.form__upload}
          onClick={onUploadClick}
          disabled={isUploadingFile}
          data-testid="input-file-attachment-upload"
        >
          Upload
          <span className={styles.form__upload__icon}>
            <AddIcon />
          </span>
          <input
            type="file"
            ref={inputFile}
            className={styles.form__formInput}
            onChange={onFileChange}
            data-testid="input-file-attachment"
          />
        </button>
      </div>
      <AttachmentList
        attachments={attachments}
        onDelete={openAttachmentDeletePrompt}
      />
    </div>
  );
};

Attachments.displayName = 'Attachments';

export default Attachments;
