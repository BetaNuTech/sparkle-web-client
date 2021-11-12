import clsx from 'clsx';
import { ChangeEventHandler, forwardRef, MutableRefObject } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import AttachmentList from '../../../../../common/AttachmentList';
import attachmentModel from '../../../../../common/models/attachment';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  isNewJob: boolean;
  isUploadingFile: boolean;
  isLoading: boolean;
  isJobComplete: boolean;
  scopeOfWork?: string;
  formState: FormState<FormInputs>;
  onUploadClick(): void;
  openAttachmentDeletePrompt(attachment: attachmentModel): void;
  inputFile: MutableRefObject<any>;
  onInputFileChange: ChangeEventHandler<HTMLInputElement>;
  jobAttachments: attachmentModel[];
}

const Scope = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(
  (
    {
      isNewJob,
      isUploadingFile,
      isLoading,
      scopeOfWork,
      isJobComplete,
      onUploadClick,
      jobAttachments,
      formState,
      inputFile,
      onInputFileChange,
      openAttachmentDeletePrompt,
      ...props
    },
    ref
  ) => {
    if (!isNewJob) {
      return (
        <div className={styles.jobNew__formGroup}>
          <div className={styles.jobNew__formSeparatedLabel}>
            <label htmlFor="jobScope">
              Scope of work <span>*</span>
            </label>
            <button
              type="button"
              className={styles.jobNew__formGroup__upload}
              onClick={onUploadClick}
              disabled={isUploadingFile}
            >
              Upload
              <span className={styles.jobNew__formGroup__upload__icon}>
                <AddIcon />
              </span>
              <input
                type="file"
                ref={inputFile}
                className={styles.jobNew__formGroup__file}
                onChange={onInputFileChange}
                data-testid="input-file-attachment"
              />
            </button>
          </div>
          <div className={styles.jobNew__formGroup__control}>
            <textarea
              id="jobScope"
              className={clsx(
                'form-control',
                styles.jobNew__formGroup__control__attachment
              )}
              rows={6}
              name="scopeOfWork"
              defaultValue={scopeOfWork}
              data-testid="job-form-scope"
              disabled={isLoading || isJobComplete}
              ref={ref}
              {...props}
            ></textarea>
            <div className={styles.jobNew__attachmentList}>
              {(jobAttachments || []).length > 0 && (
                <AttachmentList
                  id="sowAttachmentList"
                  attachments={jobAttachments}
                  onDelete={openAttachmentDeletePrompt}
                />
              )}
            </div>
            <ErrorLabel formName="scopeOfWork" errors={formState.errors} />
          </div>
        </div>
      );
    }
    return null;
  }
);

Scope.displayName = 'Scope';

export default Scope;
