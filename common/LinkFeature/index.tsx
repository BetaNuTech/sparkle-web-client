import { FunctionComponent } from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  featureEnabled?: boolean;
  legacyHref?: string;
  // All other props
  [x: string]: any;
}

const LinkFeature: FunctionComponent<Props> = ({
  featureEnabled,
  href,
  legacyHref,
  children,
  ...props
}) => {
  if (featureEnabled) {
    return (
      <Link href={href}>
        <a {...{ ...props }}>{children}</a>
      </Link>
    );
  }
  return (
    <a href={legacyHref || href} {...{ ...props }}>
      {children}
    </a>
  );
};

LinkFeature.defaultProps = {
  featureEnabled: false,
  legacyHref: ''
};

export default LinkFeature;
