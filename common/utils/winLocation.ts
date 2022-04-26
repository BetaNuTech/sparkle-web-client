const setHref = (href: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = href;
  }
};

const getRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const pathname = `${window.location.pathname}`.replace(/^\//, '');
  return `${window.location.origin}/${pathname}`;
};

export default {
  setHref,
  getRedirectUrl
};
