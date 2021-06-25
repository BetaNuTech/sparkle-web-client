import { useToasts } from 'react-toast-notifications';

type toastInstance = { addToast: any };

// Create toast notification instance
// allows replacing toast in the future
// and stubbing toasts for test suite
export const useNotifications = (): toastInstance => useToasts();

export default useNotifications;
