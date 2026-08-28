import { useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import auth, { REFUSAL_NOT_SET_UP } from '../../../common/services/auth';
import winLocation from '../../../common/utils/winLocation';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

export const USER_NOTIFICATIONS = {
  generic: 'Unknown login error, please try again',
  invalidPassword: 'The password is invalid or user does not have a password'
};

export const USER_NOTIFICATIONS_GOOGLE = {
  generic: 'Google sign in failed, please try again',
  popupBlocked:
    'Your browser blocked the Google sign in window. Please allow pop ups for this site and try again.',
  // Used when the account authenticated to Google but has no Sparkle user
  // record. Firebase raises the same refusal itself when sign-up is disabled.
  notSetUp: REFUSAL_NOT_SET_UP
};

export const USER_NOTIFICATIONS_FORGOT_PASSWORD = {
  generic: 'Failed to send forgot password request, please try again',
  invalidEmail:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  success: 'Reset Password Success: Check your email for reset password link'
};

interface Result {
  isLoading: boolean;
  isGoogleLoading: boolean;
  hasLoginError: boolean;
  signIn(email: string, password: string): void;
  signInWithGoogle(): void;
  forgotPassword(email: string): void;
  passwordResetSent: boolean;
  isForgotPasswordLoading: boolean;
}

type UserNotifications = (message: string, options?: any) => any;

export default function useLogin(sendNotification: UserNotifications): Result {
  const [isLoading, setIsloading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // Drives the email/password disclosure open after a real failure, so someone
  // refused by Google is shown the alternative rather than left on a dead end
  const [hasLoginError, setHasLoginError] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
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
      setHasLoginError(true);
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

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);

    try {
      const credential = await auth.signInWithGoogle();

      // The user closed the Google window without choosing an account. Not a
      // failure, and not worth a notification.
      if (!credential) {
        setIsGoogleLoading(false);
        return;
      }

      const userId = (credential.user && credential.user.uid) || '';
      const isSparkleUser = userId ? await auth.hasUserRecord(userId) : false;

      if (!isSparkleUser) {
        // Authenticated to Google, but not a Sparkle user. Do not leave a
        // half-usable session behind.
        await auth.signOut();
        setHasLoginError(true);
        sendNotification(USER_NOTIFICATIONS_GOOGLE.notSetUp, { type: 'error' });
        setIsGoogleLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (error) {
      setHasLoginError(true);

      if (error instanceof ErrorForbidden) {
        // The auth gate's own refusal copy
        sendNotification(error.message, { type: 'error' });
      } else if (error instanceof ErrorBadRequest) {
        sendNotification(USER_NOTIFICATIONS_GOOGLE.popupBlocked, {
          type: 'error'
        });
      } else {
        sendNotification(USER_NOTIFICATIONS_GOOGLE.generic, { type: 'error' });
      }

      setIsGoogleLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsForgotPasswordLoading(true);
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
    setIsForgotPasswordLoading(false);
  };

  return {
    isLoading,
    isGoogleLoading,
    hasLoginError,
    signIn,
    signInWithGoogle,
    forgotPassword,
    passwordResetSent,
    isForgotPasswordLoading
  };
}
