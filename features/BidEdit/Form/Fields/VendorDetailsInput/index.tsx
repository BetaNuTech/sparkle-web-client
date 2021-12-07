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
}

const VendorDetailsInput = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultValue, isLoading, isBidComplete, formState, ...props }, ref) => (
  <div className={styles.form__group}>
    <label htmlFor="bidVendorDetails">Vendor Details</label>
    <div className={styles.form__group__control}>
      <textarea
        id="bidVendorDetails"
        className="form-control"
        rows={7}
        name="vendorDetails"
        defaultValue={defaultValue}
        data-testid="bid-form-vendor-details"
        disabled={isLoading || isBidComplete}
        ref={ref}
        {...props}
      ></textarea>
      <ErrorLabel formName="need" errors={formState.errors} />
    </div>
  </div>
));

VendorDetailsInput.displayName = 'VendorDetailsInput';

export default VendorDetailsInput;
