import Router from 'next/router';

export default function Home() {
  const path = Router.asPath;

  // Automcatically direct users
  // to properties page as default
  if (path === '/') {
    Router.push('/properties');
  } else {
    // Direct user to requested subpage
    Router.push(path);
  }

  return null;
}
