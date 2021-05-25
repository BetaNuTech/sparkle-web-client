import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../navigation/Auth/AuthProvider';
import { DefaultLayout } from '../../components/layouts/default';

export default function Properties() {
  const { user } = useAuth();

  return (
    <DefaultLayout>
      <p>{`User ID: ${user ? user.uid : 'no user signed in'}`}</p>
      <p>{`User email: ${user ? user.email : 'no user signed in'}`}</p>
      <p>
        <Link href="/">
          <a>Home</a>
        </Link>
      </p>
    </DefaultLayout>
  );
}
