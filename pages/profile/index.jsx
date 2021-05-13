import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../navigation/Auth/AuthProvider';

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <p>{`User ID: ${user ? user.uid : 'no user signed in'}`}</p>
      <p>{`User email: ${user ? user.email : 'no user signed in'}`}</p>
      <p>
        <Link href="/">
          <a>Home</a>
        </Link>
      </p>
    </>
  );
}
