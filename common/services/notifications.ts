import { ReactNode } from 'react';
import { AppearanceTypes } from 'react-toast-notifications';

// Reference: https://github.com/jossmac/react-toast-notifications/blob/master/index.d.ts
interface Options {
  appearance?: 'error' | 'info' | 'success' | 'warning';
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  children?: ReactNode;
  isRunning?: boolean;
  onDismiss?: (id?: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  placement?:
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'top-left'
    | 'top-center'
    | 'top-right';
  transitionDuration?: number;
  transitionState?: 'entering' | 'entered' | 'exiting' | 'exited';
}

type toastPublisher = (message: string, options: Options) => any;
type toastInstance = { addToast: toastPublisher };

// Generate a notification publisher from
// a toast instance that sends a toast
// notification with defaults
export const createPublisher =
  (toast: toastInstance): toastPublisher =>
  (message: string, options: Options = {}): void => {
    const appearance = `${
      (options && options.appearance) || 'info'
    }` as AppearanceTypes;
    const autoDismiss = Boolean((options && options.autoDismiss) || true);

    toast.addToast(message, {
      ...options,
      appearance,
      autoDismiss
    });
  };

export default { createPublisher };
