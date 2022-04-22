import { FunctionComponent } from 'react';

import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
  isForgotPasswordLoading: boolean;
  passwordResetSent: boolean;
  setIsVisibleForgotPasswordPrompt(isVisible: boolean): void;
  isRedirecting: boolean;
  isLoading: boolean;
  isValid: boolean;
}

const LoginFormActions: FunctionComponent<Props> = ({
  isForgotPasswordLoading,
  setIsVisibleForgotPasswordPrompt,
  passwordResetSent,
  isRedirecting,
  isLoading,
  isValid
}) => (
  <div className={styles.actions}>
    <button
      className={clsx(
        styles.actions__button,
        styles.actions__button__secondary,
        isForgotPasswordLoading && styles['actions__button--loading']
      )}
      type="button"
      disabled={passwordResetSent || isRedirecting || isForgotPasswordLoading}
      onClick={() => setIsVisibleForgotPasswordPrompt(true)}
    >
      {isForgotPasswordLoading ? (
        <span>Sending...</span>
      ) : (
        <span>
          {passwordResetSent ? 'Check Your Email' : 'Forgot Password'}
        </span>
      )}
    </button>
    <button
      className={clsx(
        styles.actions__button,
        styles.actions__button__primary,
        isLoading && styles['actions__button--loading']
      )}
      disabled={!isValid || isLoading || isRedirecting}
      type="submit"
    >
      {isLoading ? 'Sending...' : 'Log In'}
    </button>
  </div>
);

export default LoginFormActions;
