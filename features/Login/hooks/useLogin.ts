import { useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import auth from '../../../common/services/auth';
import winLocation from '../../../common/utils/winLocation';
import ErrorBadRequest from '../../../common/models/errors/badRequest';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

export const USER_NOTIFICATIONS = {
  generic: 'Unknown login error, please try again',
  invalidPassword: 'The password is invalid or user does not have a password'
};

export const USER_NOTIFICATIONS_FORGOT_PASSWORD = {
  generic: 'Failed to send forgot password request, please try again',
  invalidEmail:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  success: 'Reset Password Success: Check your email for reset password link'
};

interface Result {
  isLoading: boolean;
  signIn(email: string, password: string): void;
  forgotPassword(email: string): void;
  passwordResetSent: boolean;
}

type UserNotifications = (message: string, options?: any) => any;

export default function useLogin(sendNotification: UserNotifications): Result {
  const [isLoading, setIsloading] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const router = useRouter();

  const onLoginSuccess = () => {
    // Get request url
    const request = router?.query?.request || '';
    const previousHref = typeof request === 'string' ? request : request[0];
    const href = previousHref
      ? decodeURIComponent(previousHref)
      : `${window.location.origin}${basePath}/properties`;

    // Forcing a page reload page allows
    // us to use reactFire auth utilites
    winLocation.setHref(href);
  };

  const signIn = async (email: string, password: string) => {
    setIsloading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      onLoginSuccess();
    } catch (error) {
      if (error instanceof ErrorBadRequest) {
        sendNotification(USER_NOTIFICATIONS.invalidPassword, {
          type: 'error'
        });
      } else {
        sendNotification(USER_NOTIFICATIONS.generic, {
          type: 'error'
        });
      }
    }
    setIsloading(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      await auth.sendPasswordResetEmail(email);
      sendNotification(USER_NOTIFICATIONS_FORGOT_PASSWORD.success, {
        type: 'success'
      });
      setPasswordResetSent(true);
    } catch (error) {
      if (error instanceof ErrorBadRequest) {
        sendNotification(USER_NOTIFICATIONS_FORGOT_PASSWORD.invalidEmail, {
          type: 'error'
        });
      } else {
        sendNotification(USER_NOTIFICATIONS_FORGOT_PASSWORD.generic, {
          type: 'error'
        });
      }
    }
  };

  return {
    isLoading,
    signIn,
    forgotPassword,
    passwordResetSent
  };
}
