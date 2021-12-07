import { forwardRef } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  defaultChecked: boolean;
  formState: FormState<FormInputs>;
  apiErrorVendorW9:string;
}

const W9Checkbox = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ defaultChecked, formState, apiErrorVendorW9, ...props }, ref) => (
  <div className={styles.form__group}>
    <label className={styles.form__group__labelAlign}>
      <input
        type="checkbox"
        name="vendorW9"
        defaultChecked={defaultChecked}
        ref={ref}
        {...props}
      />
      Vendor Has W9
    </label>
    <div className={styles.form__group__control}>
      <ErrorLabel formName="vendorW9" errors={formState.errors} message={apiErrorVendorW9} />
    </div>
  </div>
));

W9Checkbox.displayName = 'W9Checkbox';

export default W9Checkbox;
