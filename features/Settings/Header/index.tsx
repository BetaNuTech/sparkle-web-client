import { FunctionComponent } from 'react';
import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  toggleNavOpen(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  toggleNavOpen
}) => (
  <>
    {isMobile ? (
      <MobileHeader
        isOnline={isOnline}
        toggleNavOpen={toggleNavOpen}
        isStaging={isStaging}
        title="Settings"
      />
    ) : (
      <DesktopHeader title={<span>Settings</span>} isOnline={isOnline} />
    )}
  </>
);

export default Header;
