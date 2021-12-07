import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultValue: string;
  isLoading: boolean;
  isBidComplete: boolean;
  formState: FormState<FormInputs>;
  apiErrorVendor:string;
}

const VendorInput = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultValue, isLoading, isBidComplete, formState,apiErrorVendor, ...props }, ref) => (
  <div className={styles.form__group}>
    <label htmlFor="bidVendor">
      Vendor <span>*</span>
    </label>
    <div className={styles.form__group__control}>
      <input
        id="bidVendor"
        type="text"
        name="vendor"
        className={styles.form__input}
        defaultValue={defaultValue}
        data-testid="bid-form-vendor"
        disabled={isLoading || isBidComplete}
        ref={ref}
        {...props}
      />
      <ErrorLabel
        formName="vendor"
        errors={formState.errors}
        message={apiErrorVendor}
      />
    </div>
  </div>
));

VendorInput.displayName = 'VendorInput';

export default VendorInput;
