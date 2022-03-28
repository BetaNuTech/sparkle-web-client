import { FunctionComponent } from 'react';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import styles from './styles.module.scss';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import SortBy from './SortBy';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  property: PropertyModel;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  property
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          Property
        </a>
      </Link>
    </>
  );
  const BreadCrumbs = () => (
    <>
      <div className={styles.header__breadcrumbs}>
        <Link href={`/properties/${property.id}`}>
          <a className={styles.header__link}>{property.name}</a>
        </Link>
      </div>
      <div className={styles.header__title}>{property.name} Residents</div>
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
        <DesktopHeader
          title={<BreadCrumbs />}
          isOnline={isOnline}
          isColumnTitle
          right={<SortBy />}
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
