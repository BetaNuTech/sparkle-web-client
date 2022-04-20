import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useAuth } from '../../common/Auth/Provider';
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

type FormInputs = {
  email: string;
  password: string;
};

interface Props {
  isStaging?: boolean;
}

const LoginForm: FunctionComponent<Props> = ({ isStaging }) => {
  const { signInWithEmail } = useAuth();
  const [isVisibleNewUserPrompt, setIsVisibleNewUserPrompt] = useState(false);
  const [isVisibleForgotPasswordPrompt, setIsVisibleForgotPasswordPrompt] =
    useState(false);

  // User notifications setup
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { register, handleSubmit, formState, getValues } =
    useForm<FormInputs>();

  const onSubmit = (data) => {
    signInWithEmail(data.email, data.password).catch((error) => {
      sendNotification(error.message, {
        type: 'error'
      });
    });
  };

  const email = getValues('email');

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.main}>
          <header className={styles.header}>
            {isStaging ? (
              <h1 className={styles.header__title}>Staging</h1>
            ) : (
              <SparkleLogo className={styles.header__logo} />
            )}
          </header>

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
                  onClick={() => setIsVisibleForgotPasswordPrompt(true)}
                >
                  Forgot Password
                </button>
                <button
                  className={clsx(
                    styles.form__button,
                    styles.form__button__primary
                  )}
                  type="submit"
                >
                  Log In
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
                <a href="##" className={styles.form__iosInstallButton}>
                  <AppleLogo /> Install iOS App
                </a>
              </div>
            </div>
          </div>
          <footer className={styles.footer}>
            <BlueStoneLogo className={styles.footer__logo} />
            <p className={styles.footer__version}>v0.1.0</p>
          </footer>
        </div>
      </form>
      <NewUserPrompt
        isVisible={isVisibleNewUserPrompt}
        onClose={() => setIsVisibleNewUserPrompt(false)}
      />
      <ForgotPasswordPrompt
        isVisible={isVisibleForgotPasswordPrompt}
        onClose={() => setIsVisibleForgotPasswordPrompt(false)}
        onConfirm={() => setIsVisibleForgotPasswordPrompt(false)}
        email={email}
      />
    </>
  );
};

export default LoginForm;
