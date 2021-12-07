import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultChecked: boolean;
  formState: FormState<FormInputs>;
  apiErrorVendorLicense:string;
}

const LicenseCheckbox = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultChecked, formState, apiErrorVendorLicense, ...props }, ref) => (
  <div className={styles.form__group}>
    <label className={styles.form__group__labelAlign}>
      <input
        type="checkbox"
        name="vendorLicense"
        defaultChecked={defaultChecked}
        ref={ref}
        {...props}
      />
      Vendor has License
    </label>
    <div className={styles.form__group__control}>
      <ErrorLabel formName="vendorLicense" errors={formState.errors} message={apiErrorVendorLicense} />
    </div>
  </div>
));

LicenseCheckbox.displayName = 'LicenseCheckbox';

export default LicenseCheckbox;
