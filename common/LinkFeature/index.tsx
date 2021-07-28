import { FunctionComponent } from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  featureEnabled?: boolean;
  // All other props
  [x: string]: any;
}

const LinkFeature: FunctionComponent<Props> = ({
  featureEnabled,
  href,
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
    <a href={href} {...{ ...props }}>
      {children}
    </a>
  );
};

LinkFeature.defaultProps = {
  featureEnabled: false
};

export default LinkFeature;
