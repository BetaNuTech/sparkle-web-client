import { toast, ToastContent, ToastOptions } from 'react-toastify';

type toastInstance = {
  (content: ToastContent, options?: ToastOptions | undefined): React.ReactText;
};

// Create toast notification instance
// allows replacing toast in the future
// and stubbing toasts for test suite
const useNotifications = (): toastInstance => toast;

export default useNotifications;
