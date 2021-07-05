import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px' }}>
      <p>
        <Link href="/properties">
          <a>Go to authenticated route</a>
        </Link>
      </p>
      <p>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </p>
    </div>
  );
}
