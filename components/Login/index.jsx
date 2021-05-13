import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../navigation/Auth/AuthProvider';
import styles from './LoginForm.module.scss';

const validationSchema = yup.object().shape({
  email: yup.string().email('Wrong email fromat').required('Please enter an email address'),
  password: yup.string().min(6, 'Minimum password length is 6').required(),
});

export const LoginForm = () => {
  const auth = useAuth();

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    auth.signInWithEmail(data);
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.loginForm__container}>
        <h2>Login To Your Account</h2>
        <form className={styles.loginForm__main} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.loginForm__fields}>
            <input
              type="text"
              name="email"
              className={styles.loginForm__field}
              id="email"
              label="E-Mail"
              placeholder="Email"
              {...register('email')}
            />
            {/* {!!errors.email && <p>{errors.email?.message}</p>} */}
            <input
              type="text"
              name="password"
              className={styles.loginForm__field}
              id="password"
              label="Password"
              placeholder="Password"
              {...register('password')}
            />
            {/* {!!errors.password && <p>{errors.password?.message}</p>} */}

            <div className="loginForm__actions">
              <button
                className={styles.loginForm__button}
                type="submit">
                Log in
          </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
