import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultValue: number;
  isLoading: boolean;
  isBidComplete: boolean;
  formState: FormState<FormInputs>;
  isApprovedOrComplete: boolean;
  apiErrorStartAt:string;
}

const StartDateInput = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(
  (
    {
      defaultValue,
      isLoading,
      isBidComplete,
      formState,
      isApprovedOrComplete,
      apiErrorStartAt,
      ...props
    },
    ref
  ) => (
    <div
      className={clsx(
        styles.form__row__cell,
        styles['form__row__cell--twoColumns']
      )}
    >
      <div className={styles.form__group}>
        <label htmlFor="bidStartAt">
          Start Date {isApprovedOrComplete && <span>*</span>}
        </label>
        <div className={styles.form__group__control}>
          <input
            id="bidStartAt"
            type="date"
            name="startAt"
            className={styles.form__input}
            defaultValue={defaultValue}
            data-testid="bid-form-start-at"
            disabled={isLoading || isBidComplete}
            ref={ref}
            {...props}
          />
          <ErrorLabel
            formName="startAt"
            errors={formState.errors}
            message={apiErrorStartAt}
          />
        </div>
      </div>
    </div>
  )
);

StartDateInput.displayName = 'StartDateInput';

export default StartDateInput;
