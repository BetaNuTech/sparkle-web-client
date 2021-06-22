import Link from 'next/link';
import { useAuth } from '../navigation/Auth/AuthProvider';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <p>{`User ID: ${user ? user.uid : 'no user signed in'}`}</p>

      <p>
        <Link href="/properties">
          <a>Go to authenticated route</a>
        </Link>
      </p>
      <p>
        <Link href="/jobs/login">
          <a>Login</a>
        </Link>
      </p>

      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
