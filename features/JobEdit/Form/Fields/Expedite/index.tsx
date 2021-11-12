import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultValue: string;
  isLoading: boolean;
  isJobComplete: boolean;
  expediteReason: string;
  formState: FormState<FormInputs>;
}

const Expedite = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(
  (
    {
      defaultValue,
      isLoading,
      isJobComplete,
      formState,
      expediteReason,
      ...props
    },
    ref
  ) => {
    if (expediteReason) {
      return (
        <div className={styles.jobNew__formGroup}>
          <label htmlFor="jobExpediteReason">
            Expedite Reason <span>*</span>
          </label>
          <div className={styles.jobNew__formGroup__control}>
            <textarea
              id="jobExpediteReason"
              className="form-control"
              rows={3}
              name="expediteReason"
              defaultValue={defaultValue}
              data-testid="job-form-expedite-reason"
              disabled={isLoading || isJobComplete}
              ref={ref}
              {...props}
            ></textarea>
            <ErrorLabel formName="expediteReason" errors={formState.errors} />
          </div>
        </div>
      );
    }
    return null;
  }
);

Expedite.displayName = 'Expedite';

export default Expedite;
