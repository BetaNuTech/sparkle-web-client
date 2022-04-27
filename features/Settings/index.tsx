import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SlackIntegration from '../../common/models/slackIntegration';
import TrelloIntegration from '../../common/models/trelloIntegration';
import winLocation from '../../common/utils/winLocation';
import breakpoints from '../../config/breakpoints';
import DeleteTrelloAuthPrompt from './DeleteTrelloAuthPrompt';
import Form from './Form';
import Header from './Header';
import useSlack from './hooks/useSlack';
import useTrello from './hooks/useTrello';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  slackIntegration: SlackIntegration;
  trelloIntegration: TrelloIntegration;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  sendNotification: userNotifications;
  token: string;
  code: string;
}

const Settings: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  slackIntegration,
  trelloIntegration,
  sendNotification,
  token,
  code
}) => {
  const redirectUrl = winLocation.getRedirectUrl();

  const [isVisibleDeleteTrelloAuth, setIsVisibleDeleteTrelloAuth] =
    useState(false);
  const { pathname, push } = useRouter();
  const {
    onAuthorizeTrello,
    reAuthorize: reAuthorizeTrello,
    isLoading: isAuthorizingTrello,
    hasError: hasAuthorizingTrelloError,
    onDelete: onDeleteTrello
  } = useTrello(sendNotification);

  const {
    onAuthorizeSlack,
    reAuthorize: reAuthorizeSlack,
    isLoading: isAuthorizingSlack,
    hasError: hasAuthorizingSlackError
  } = useSlack(sendNotification, redirectUrl);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const onDeleteTrelloAuth = () => {
    setIsVisibleDeleteTrelloAuth(false);
    onDeleteTrello();
  };

  useEffect(() => {
    // request to trello authorization
    if (token) {
      onAuthorizeTrello(token);
      // remove hash from url
      push(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pathname]);

  useEffect(() => {
    // request to slack authorization
    if (code) {
      onAuthorizeSlack(code);
      // remove qeury from url
      push(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, pathname]);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        toggleNavOpen={toggleNavOpen}
      />
      <Form
        trelloIntegration={trelloIntegration}
        slackIntegration={slackIntegration}
        redirectUrl={redirectUrl}
        isAuthorizingTrello={isAuthorizingTrello}
        hasAuthorizingTrelloError={hasAuthorizingTrelloError}
        onDeleteTrelloAuth={() => setIsVisibleDeleteTrelloAuth(true)}
        reAuthorizeTrello={reAuthorizeTrello}
        isAuthorizingSlack={isAuthorizingSlack}
        hasAuthorizingSlackError={hasAuthorizingSlackError}
        reAuthorizeSlack={reAuthorizeSlack}
      />
      <DeleteTrelloAuthPrompt
        isVisible={isVisibleDeleteTrelloAuth}
        onClose={() => setIsVisibleDeleteTrelloAuth(false)}
        onConfirm={onDeleteTrelloAuth}
      />
    </>
  );
};

export default Settings;
