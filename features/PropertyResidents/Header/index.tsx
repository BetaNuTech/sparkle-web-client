import { FunctionComponent } from 'react';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  propertyId: string;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  propertyId
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${propertyId}`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          Property
        </a>
      </Link>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            left={mobileHeaderLeft}
            isStaging={isStaging}
            title="Residents"
          />
          <div className={styles.search}>
            <input className={styles.search__input} type="search" />

            <button className={styles.search__clear} />
          </div>
        </>
      ) : (
        <header className={styles.header} data-testid="workorders-header">
          <h1 className={styles.header__title}>Residents List</h1>
        </header>
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
