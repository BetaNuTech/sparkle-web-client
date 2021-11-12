import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultValue: string;
  isLoading: boolean;
  isJobComplete: boolean;
  isApprovedOrAuthorized: boolean;
  formState: FormState<FormInputs>;
}

const Need = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(
  (
    {
      defaultValue,
      isLoading,
      isJobComplete,
      formState,
      isApprovedOrAuthorized,
      ...props
    },
    ref
  ) => (
    <div className={styles.jobNew__formGroup}>
      <label htmlFor="jobDescription">
        Need {isApprovedOrAuthorized && <span>*</span>}
      </label>
      <div className={styles.jobNew__formGroup__control}>
        <textarea
          id="jobDescription"
          className="form-control"
          rows={4}
          name="need"
          defaultValue={defaultValue}
          data-testid="job-form-description"
          disabled={isLoading || isJobComplete}
          ref={ref}
          {...props}
        ></textarea>
        <ErrorLabel formName="need" errors={formState.errors} />
      </div>
    </div>
  )
);

Need.displayName = 'Need';

export default Need;
