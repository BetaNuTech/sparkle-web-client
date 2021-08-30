import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import OfflineDesktop from '../OfflineDesktop';
import styles from './styles.module.scss';

interface Props {
  backLink?: string;
  headerTestId?: string;
  headerClass?: string;
  title: JSX.Element;
  titleInfo?: JSX.Element;
  isOnline: boolean;
  right?: JSX.Element;
  nextLine?: JSX.Element;
  nextLineRight?: JSX.Element;
}

const DesktopHeader: FunctionComponent<Props> = ({
  backLink,
  headerTestId,
  headerClass,
  title,
  titleInfo,
  isOnline,
  right,
  nextLine,
  nextLineRight
}) => (
  <>
    <header
      className={clsx(styles.header, headerClass)}
      data-testid={headerTestId}
    >
      <div className={styles.header__content}>
        <div className={styles.header__content__main}>
          {backLink && (
            <Link href={backLink}>
              <a className={styles.header__backButton}></a>
            </Link>
          )}

          <h1 className={styles.header__content__main__title}>{title}</h1>
        </div>
        {titleInfo}
      </div>
      {right && (
        <aside className={styles.header__controls}>
          {isOnline ? right : <OfflineDesktop />}
        </aside>
      )}
    </header>
    {nextLine && (
      <div className={clsx(styles.header, styles.header__bottom)}>
        {nextLine}
        <aside className={styles.header__controls}>{nextLineRight}</aside>
      </div>
    )}
  </>
);

DesktopHeader.defaultProps = {
  headerTestId: 'desktop-header'
};

export default DesktopHeader;
