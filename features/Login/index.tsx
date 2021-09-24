import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useAuth } from '../../common/Auth/Provider';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import styles from './styles.module.scss';
import regexPattern from '../../common/utils/regexPattern';

type FormInputs = {
  email: string;
  password: string;
};

export const LoginForm = (): JSX.Element => {
  const { signInWithEmail } = useAuth();

  // User notifications setup
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { register, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data) => {
    signInWithEmail(data.email, data.password).catch((error) => {
      sendNotification(error.message, {
        type: 'error'
      });
    });
  };

  return (
    <>
      <div className={styles.loginForm}>
        <div className={styles.loginForm__container}>
          <h2>Login To Your Account</h2>
          <form
            className={styles.loginForm__main}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.loginForm__fields}>
              <input
                type="text"
                name="email"
                className={styles.loginForm__field}
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
              {/* {!!errors.email && <p>{errors.email?.message}</p>} */}
              <input
                type="text"
                name="password"
                className={styles.loginForm__field}
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
              {/* {!!errors.password && <p>{errors.password?.message}</p>} */}

              <div className="loginForm__actions">
                <button className={styles.loginForm__button} type="submit">
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </>
  );
};
