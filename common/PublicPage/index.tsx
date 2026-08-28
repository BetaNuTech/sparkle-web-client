import { FunctionComponent, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  title: string;
  subtitle?: string;
  testId?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const PublicPage: FunctionComponent<Props> = ({
  title,
  subtitle,
  testId,
  children,
  footer
}) => (
  <div className={styles.page}>
    <article className={styles.content} data-testid={testId}>
      <header className={styles.masthead}>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      {children}

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  </div>
);

export default PublicPage;
