import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import SlackIntegration from '../../common/models/slackIntegration';
import TrelloIntegration from '../../common/models/trelloIntegration';
import breakpoints from '../../config/breakpoints';
import Header from './Header';

interface Props {
  slack: SlackIntegration;
  trello: TrelloIntegration;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const Settings: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        toggleNavOpen={toggleNavOpen}
      />
    </>
  );
};

export default Settings;
