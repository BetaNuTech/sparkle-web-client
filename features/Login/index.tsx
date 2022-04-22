import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import ErrorLabel from '../../common/ErrorLabel';
import regexPattern from '../../common/utils/regexPattern';
import SparkleLogo from '../../public/icons/sparkle/logo.svg';
import BlueStoneLogo from '../../public/icons/sparkle/bluestone-logo.svg';
import AppleLogo from '../../public/icons/sparkle/apple-logo.svg';

import styles from './styles.module.scss';
import NewUserPrompt from './NewUserPrompt';
import ForgotPasswordPrompt from './ForgotPasswordPrompt';
import useLogin from './hooks/useLogin';
import LoginHeader from '../../common/Login/Header';
import LoginFooter from '../../common/Login/Footer';
import IOSLink from '../../common/Login/IOSLink';

type FormInputs = {
  email: string;
  password: string;
};

interface Props {
  isStaging?: boolean;
}

const LoginForm: FunctionComponent<Props> = ({ isStaging }) => {
  // User notifications setup
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { signIn, forgotPassword, isLoading, passwordResetSent } =
    useLogin(sendNotification);
  const [isVisibleNewUserPrompt, setIsVisibleNewUserPrompt] = useState(false);
  const [isVisibleForgotPasswordPrompt, setIsVisibleForgotPasswordPrompt] =
    useState(false);

  const { register, handleSubmit, formState, getValues } = useForm<FormInputs>({
    mode: 'all'
  });

  const onSubmit = (data: FormInputs) => {
    signIn(data.email, data.password);
  };

  const onForgotPassword = (data: FormInputs) => {
    forgotPassword(data.email);
    setIsVisibleForgotPasswordPrompt(false);
  };

  const { isValid } = formState;

  const email = getValues('email');

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.main}>
          <LoginHeader isStaging={isStaging} />

          <div className={styles.form}>
            <div className={styles.form__fields}>
              <input
                type="text"
                name="email"
                className={clsx(styles.form__input, styles.form__input__open)}
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
                className={clsx(styles.form__input, styles.form__input__close)}
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
              <div className={styles.form__actions}>
                <button
                  className={clsx(
                    styles.form__button,
                    styles.form__button__secondary
                  )}
                  type="button"
                  disabled={passwordResetSent}
                  onClick={() => setIsVisibleForgotPasswordPrompt(true)}
                >
                  {passwordResetSent ? 'Check Your Email' : 'Forgot Password'}
                </button>
                <button
                  className={clsx(
                    styles.form__button,
                    styles.form__button__primary,
                    isLoading && styles['form__button--loading']
                  )}
                  disabled={!isValid || isLoading}
                  type="submit"
                >
                  {isLoading ? 'Sending...' : 'Log In'}
                </button>
              </div>
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
          </div>
          <LoginFooter />
        </div>
      </form>
      <NewUserPrompt
        isVisible={isVisibleNewUserPrompt}
        onClose={() => setIsVisibleNewUserPrompt(false)}
      />
      <ForgotPasswordPrompt
        isVisible={isVisibleForgotPasswordPrompt}
        onClose={() => setIsVisibleForgotPasswordPrompt(false)}
        onConfirm={onForgotPassword}
        email={email}
      />
    </>
  );
};

export default LoginForm;
