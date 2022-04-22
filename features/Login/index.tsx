import { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import NewUserPrompt from './NewUserPrompt';
import ForgotPasswordPrompt from './ForgotPasswordPrompt';
import useLogin from './hooks/useLogin';
import { FormInputs } from './Form/FormInputs';
import Header from '../../common/Login/Header';
import Footer from '../../common/Login/Footer';
import Container from '../../common/Login/Container';
import Form from './Form';

interface Props {
  isStaging?: boolean;
}

const Login: FunctionComponent<Props> = ({ isStaging }) => {
  // User notifications setup
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const {
    signIn,
    forgotPassword,
    isLoading,
    isForgotPasswordLoading,
    passwordResetSent
  } = useLogin(sendNotification);
  const [isVisibleNewUserPrompt, setIsVisibleNewUserPrompt] = useState(false);
  const [isVisibleForgotPasswordPrompt, setIsVisibleForgotPasswordPrompt] =
    useState(false);
  const [isRedirecting, setisRedirecting] = useState(false);

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

  const onRedirect = () => {
    setisRedirecting(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add event listener to disable
    // Signin and Forgot password CTA
    window.addEventListener('beforeunload', onRedirect);

    // remove event listner on unmout
    return () => {
      window.removeEventListener('beforeunload', onRedirect);
    };
  }, []);

  const { isValid } = formState;
  const email = getValues('email');

  return (
    <>
      <Container>
        <Header isStaging={isStaging} />
        <Form
          isForgotPasswordLoading={isForgotPasswordLoading}
          setIsVisibleForgotPasswordPrompt={setIsVisibleForgotPasswordPrompt}
          passwordResetSent={passwordResetSent}
          isRedirecting={isRedirecting}
          isLoading={isLoading}
          isValid={isValid}
          register={register}
          formState={formState}
          setIsVisibleNewUserPrompt={setIsVisibleNewUserPrompt}
          onSubmit={handleSubmit(onSubmit)}
        />
        <Footer />
      </Container>
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

export default Login;
