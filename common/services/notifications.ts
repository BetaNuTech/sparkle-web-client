import { TypeOptions, ToastContent, ToastOptions } from 'react-toastify';

type toastPublisher = (message: string, options: ToastOptions) => any;
type toastInstance = {
  (content: ToastContent, options?: ToastOptions | undefined): React.ReactText;
};

// Generate a notification publisher from
// a toast instance that sends a toast
// notification with defaults
export const createPublisher =
  (toast: toastInstance): toastPublisher =>
  (message: string, options: ToastOptions = {}): void => {
    const type = `${(options && options.type) || 'info'}` as TypeOptions;
    const autoClose = (options && options.autoClose) || 5000;

    toast(message, {
      ...options,
      type,
      autoClose
    });
  };

export default { createPublisher };
