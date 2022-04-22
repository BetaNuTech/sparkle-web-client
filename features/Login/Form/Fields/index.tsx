import { FunctionComponent } from 'react';

import clsx from 'clsx';

import { FormState, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.scss';
import ErrorLabel from '../../../../common/ErrorLabel';
import regexPattern from '../../../../common/utils/regexPattern';
import { FormInputs } from '../FormInputs';

interface Props {
  register: UseFormRegister<FormInputs>;
  formState: FormState<FormInputs>;
}

const LoginFormFields: FunctionComponent<Props> = ({ register, formState }) => (
  <div className={styles.fields}>
    <input
      type="text"
      name="email"
      className={clsx(styles.fields__input, styles.fields__input__open)}
      id="email"
      placeholder="Email"
      {...register('email', {
        required: 'Please enter an email address',
        pattern: {
          value: regexPattern.email,
          message: 'Wrong email format'
        }
      })}
    />
    <ErrorLabel formName="email" errors={formState.errors} />
    <input
      type="password"
      name="password"
      className={clsx(styles.fields__input, styles.fields__input__close)}
      id="password"
      placeholder="Password"
      {...register('password', {
        required: 'Please enter password',
        minLength: {
          value: 6,
          message: 'Minimum password length is 6'
        }
      })}
    />
    <ErrorLabel formName="password" errors={formState.errors} />
  </div>
);

export default LoginFormFields;
