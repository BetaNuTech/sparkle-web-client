import { FunctionComponent } from 'react';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import Breadcrumbs from './Breadcrumbs';

interface Props {
  property: PropertyModel;
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  itemTitle: string;
}

const Header: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  isTablet,
  itemTitle
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}/deficient-items`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          All
        </a>
      </Link>
    </>
  );

  return (
    <>
      {isTablet ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            isStaging={isStaging}
            left={mobileHeaderLeft}
            title="Deficient Item"
          />
          <Breadcrumbs property={property} itemTitle={itemTitle} />
        </>
      ) : (
        <DesktopHeader
          isOnline={isOnline}
          isColumnTitle
          title={<Breadcrumbs property={property} itemTitle={itemTitle} />}
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
