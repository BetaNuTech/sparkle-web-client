import { FunctionComponent } from 'react';
import SlackIntegration from '../../common/models/slackIntegration';
import TrelloIntegration from '../../common/models/trelloIntegration';

interface Props {
  slack: SlackIntegration;
  trello: TrelloIntegration;
}

const Settings: FunctionComponent<Props> = ({ slack, trello }) => (
  <>
    <h1>Settings </h1>
  </>
);

export default Settings;
