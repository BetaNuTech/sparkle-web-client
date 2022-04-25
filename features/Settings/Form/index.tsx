import { FunctionComponent } from 'react';
import SlackIntegration from '../../../common/models/slackIntegration';
import TrelloIntegration from '../../../common/models/trelloIntegration';
import Slack from './Slack';
import styles from './styles.module.scss';
import Trello from './Trello';

interface Props {
  slack: SlackIntegration;
  trello: TrelloIntegration;
}

const Form: FunctionComponent<Props> = ({ slack, trello }) => (
  <div className={styles.container}>
    <Trello trello={trello} />
    <Slack slack={slack} />
  </div>
);

export default Form;
