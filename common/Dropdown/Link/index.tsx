import { FunctionComponent } from 'react';
import LinkFeature from '../../LinkFeature';
import styles from '../styles.module.scss';

interface Props {
  children: string;
  href: string;
  testid?: string;
  className?: any;
  featureEnabled?: boolean;
  // All other props
  [x: string]: any;
}
const DropdownLink: FunctionComponent<Props> = ({
  children,
  href,
  testid,
  className,
  featureEnabled,
  ...props
}) => (
  <li className={styles.dropdown__item} data-testid={testid}>
    <LinkFeature
      href={href}
      className={className}
      featureEnabled={featureEnabled}
      {...props}
    >
      {children}
    </LinkFeature>
  </li>
);

DropdownLink.defaultProps = {
  testid: 'dropdown-link',
  featureEnabled: false
};

export default DropdownLink;
