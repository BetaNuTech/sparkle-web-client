import { FunctionComponent } from 'react';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';

interface Props {
  propertyId: string;
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isTablet: boolean;
}

const Header: FunctionComponent<Props> = ({
  propertyId,
  isOnline,
  isStaging,
  isTablet
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${propertyId}/`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          Property
        </a>
      </Link>
    </>
  );

  return (
    <>
      {isTablet ? (
        <MobileHeader
          isOnline={isOnline}
          isStaging={isStaging}
          left={mobileHeaderLeft}
          title="Deficient Items"
        />
      ) : (
        <DesktopHeader
          title={<span>Deficient Items</span>}
          isOnline={isOnline}
          backLink={`/properties/${propertyId}/`}
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
