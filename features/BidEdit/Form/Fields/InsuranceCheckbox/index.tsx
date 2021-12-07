import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultChecked: boolean;
  formState: FormState<FormInputs>;
  apiErrorVendorInsurance:string;
}

const InsuranceCheckbox = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultChecked, formState, apiErrorVendorInsurance, ...props }, ref) => (
  <div className={styles.form__group}>
    <label className={styles.form__group__labelAlign}>
      <input
        type="checkbox"
        name="vendorInsurance"
        defaultChecked={defaultChecked}
        ref={ref}
        {...props}
      />
      Vendor Has Insurance
    </label>
    <div className={styles.form__group__control}>
      <ErrorLabel formName="vendorInsurance" errors={formState.errors} message={apiErrorVendorInsurance} />
    </div>
  </div>
));

InsuranceCheckbox.displayName = 'InsuranceCheckbox';

export default InsuranceCheckbox;
