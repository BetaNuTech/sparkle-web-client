import { ToastProvider } from 'react-toast-notifications';
import { LoginForm } from '../../common/Login';

export default function Login() {
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}
