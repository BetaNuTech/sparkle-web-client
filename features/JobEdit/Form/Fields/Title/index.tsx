import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultValue: string;
  isLoading: boolean;
  isJobComplete: boolean;
  formState: FormState<FormInputs>;
}

const JobTitle = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultValue, isLoading, isJobComplete, formState, ...props }, ref) => (
  <div className={styles.jobNew__formGroup}>
    <label htmlFor="jobTitle">
      Title <span>*</span>
    </label>
    <div className={styles.jobNew__formGroup__control}>
      <input
        id="jobTitle"
        type="text"
        name="title"
        className={styles.jobNew__input}
        defaultValue={defaultValue}
        data-testid="job-form-title"
        ref={ref}
        disabled={isLoading || isJobComplete}
        {...props}
      />
      <ErrorLabel formName="title" errors={formState.errors} />
    </div>
  </div>
));

JobTitle.displayName = 'JobTitle';

export default JobTitle;
