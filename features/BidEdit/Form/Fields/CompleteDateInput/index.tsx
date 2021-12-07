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
  apiErrorCompleteAt:string;
}

const CompleteDateInput = forwardRef<
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
      apiErrorCompleteAt,
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
        <label htmlFor="bidVendor">
          Complete Date {isApprovedOrComplete && <span>*</span>}
        </label>
        <div className={styles.form__group__control}>
          <input
            id="bidCompleteAt"
            type="date"
            name="vendor"
            className={styles.form__input}
            defaultValue={defaultValue}
            data-testid="bid-form-complete-at"
            disabled={isLoading || isBidComplete}
            ref={ref}
            {...props}
          />
          <ErrorLabel
            formName="completeAt"
            errors={formState.errors}
            message={apiErrorCompleteAt}
          />
        </div>
      </div>
    </div>
  )
);

CompleteDateInput.displayName = 'CompleteDateInput';

export default CompleteDateInput;
