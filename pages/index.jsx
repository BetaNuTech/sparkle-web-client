import React from 'react';
import Link from 'next/link';
import { PropertiesApi } from '../api/PropertiesApi';
import { useAuth } from '../navigation/Auth/AuthProvider';

export default function Home() {
  const [properties, setProperties] = React.useState([]);

  React.useEffect(() => {
    PropertiesApi.getMe().then((data) => {
      setProperties(data);
    });
  }, []);

  const { user, signOut } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <p>{`User ID: ${user ? user.uid : 'no user signed in'}`}</p>

      <p>
        <Link href="/profile">
          <a>Go to authenticated route</a>
        </Link>
      </p>
      <p>
        <Link href="/jobs/login">
          <a>Login</a>
        </Link>
      </p>

      <div>
        Names:
        {properties.map((doc) => (
          <p key={doc.id}>{doc.data().name}</p>
        ))}
      </div>

      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
