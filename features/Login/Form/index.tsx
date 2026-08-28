import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { FormState, UseFormRegister } from 'react-hook-form';
import IOSLink from '../../../common/Login/IOSLink';
import LoginFormActions from './Actions';
import LoginFormFields from './Fields';
import GoogleIcon from './GoogleIcon';
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
  isGoogleLoading: boolean;
  hasLoginError: boolean;
  isValid: boolean;
  setIsVisibleNewUserPrompt(isVisible: boolean): void;
  onSubmit(): void;
  onGoogleSignIn(): void;
}

const LoginForm: FunctionComponent<Props> = ({
  register,
  formState,
  isForgotPasswordLoading,
  setIsVisibleForgotPasswordPrompt,
  passwordResetSent,
  isRedirecting,
  isLoading,
  isGoogleLoading,
  hasLoginError,
  isValid,
  setIsVisibleNewUserPrompt,
  onSubmit,
  onGoogleSignIn
}) => (
  <div className={styles.form}>
    <button
      type="button"
      className={clsx(
        styles.form__google,
        isGoogleLoading && styles['form__google--loading']
      )}
      onClick={onGoogleSignIn}
      disabled={isGoogleLoading || isRedirecting}
      data-testid="login-google-button"
    >
      <GoogleIcon />
      <span>{isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>

    <p className={styles.form__googleHint}>
      Use the Google account that matches your work email address.
    </p>

    <div className={styles.form__divider}>
      <span>or</span>
    </div>

    {/*
      A native disclosure rather than a conditionally rendered block. Keeping
      the inputs mounted is what preserves react-hook-form's registration, and
      therefore formState.isValid, which gates the submit button. Unmounting
      them would unregister the fields and leave the form permanently invalid.

      Forced open after a real failure so someone Google turned away is shown
      the alternative instead of a dead end.
    */}
    <details className={styles.form__disclosure} open={hasLoginError}>
      <summary
        className={styles.form__disclosure__summary}
        data-testid="login-password-disclosure"
      >
        Sign in with an email address and password instead
      </summary>

      <form onSubmit={onSubmit}>
        <LoginFormFields register={register} formState={formState} />
        <LoginFormActions
          isForgotPasswordLoading={isForgotPasswordLoading}
          setIsVisibleForgotPasswordPrompt={setIsVisibleForgotPasswordPrompt}
          passwordResetSent={passwordResetSent}
          isRedirecting={isRedirecting}
          isLoading={isLoading}
          isValid={isValid}
        />
      </form>
    </details>

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
  </div>
);
export default LoginForm;
