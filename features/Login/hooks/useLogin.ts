import { useState } from 'react';
import getConfig from 'next/config';
import authApi from '../../../common/services/auth';
import winLocation from '../../../common/utils/winLocation';
import ErrorBadRequest from '../../../common/models/errors/badRequest';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

export const USER_NOTIFICATIONS = {
  generic: 'Unknown login error, please try again',
  invalidPassword: 'The password is invalid or user does not have a password'
};

interface Result {
  isLoading: boolean;
  signIn(email: string, password: string): void;
}

type UserNotifications = (message: string, options?: any) => any;

export default function useLogin(sendNotification: UserNotifications): Result {
  const [isLoading, setIsloading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsloading(true);
    try {
      await authApi.signInWithEmailAndPassword(email, password);
      // Forcing a page reload page allows
      // us to use reactFire auth utilites
      winLocation.setHref(`${basePath}/properties`);
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

  return {
    isLoading,
    signIn
  };
}
