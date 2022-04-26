import { FunctionComponent } from 'react';
import SlackIntegration from '../../../common/models/slackIntegration';
import TrelloIntegration from '../../../common/models/trelloIntegration';
import Slack from './Slack';
import styles from './styles.module.scss';
import Trello from './Trello';

interface Props {
  slackIntegration: SlackIntegration;
  trelloIntegration: TrelloIntegration;
  redirectUrl: string;
  isAuthorizingTrello: boolean;
  hasAuthorizingTrelloError: boolean;
  reAuthorizeTrello(): void;
  onDeleteTrelloAuth(): void;
}

const Form: FunctionComponent<Props> = ({
  slackIntegration,
  trelloIntegration,
  redirectUrl,
  isAuthorizingTrello,
  hasAuthorizingTrelloError,
  reAuthorizeTrello,
  onDeleteTrelloAuth
}) => (
  <div className={styles.container}>
    <Trello
      integration={trelloIntegration}
      redirectUrl={redirectUrl}
      isAuthorizing={isAuthorizingTrello}
      hasError={hasAuthorizingTrelloError}
      reAuthorize={reAuthorizeTrello}
      onDeleteTrelloAuth={onDeleteTrelloAuth}
    />
    <Slack integration={slackIntegration} />
  </div>
);

export default Form;
