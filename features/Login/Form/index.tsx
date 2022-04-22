import { FunctionComponent } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import IOSLink from '../../../common/Login/IOSLink';
import LoginFormActions from './Actions';
import LoginFormFields from './Fields';
import { FormInputs } from './FormInputs';
import styles from './styles.module.scss';

interface Props {
  register: UseFormRegister<FormInputs>;
  formState: FormState<FormInputs>;
  isForgotPasswordLoading: boolean;
  passwordResetSent: boolean;
  setIsVisibleForgotPasswordPrompt(isVisible: boolean): void;
  isRedirecting: boolean;
  isLoading: boolean;
  isValid: boolean;
  setIsVisibleNewUserPrompt(isVisible: boolean): void;
  onSubmit(): void;
}

const LoginForm: FunctionComponent<Props> = ({
  register,
  formState,
  isForgotPasswordLoading,
  setIsVisibleForgotPasswordPrompt,
  passwordResetSent,
  isRedirecting,
  isLoading,
  isValid,
  setIsVisibleNewUserPrompt,
  onSubmit
}) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <LoginFormFields register={register} formState={formState} />
    <LoginFormActions
      isForgotPasswordLoading={isForgotPasswordLoading}
      setIsVisibleForgotPasswordPrompt={setIsVisibleForgotPasswordPrompt}
      passwordResetSent={passwordResetSent}
      isRedirecting={isRedirecting}
      isLoading={isLoading}
      isValid={isValid}
    />

    <img
      src="/img/sapphire-large.png"
      alt="login"
      className={styles.form__loginImg}
    />
    <button
      type="button"
      className={styles.form__promptButton}
      onClick={() => setIsVisibleNewUserPrompt(true)}
    >
      New User?
    </button>

    <div className="-ta-center -mt">
      <div className="-fz-small -mb-sm">Using iOS device?</div>
      <IOSLink />
    </div>
  </form>
);
export default LoginForm;
