import { FunctionComponent } from 'react';

import SlackIntegration from '../../../../common/models/slackIntegration';
import dateUtils from '../../../../common/utils/date';
import SlackLogo from '../../../../public/logos/slack.svg';
import styles from '../styles.module.scss';

interface Props {
  slack: SlackIntegration;
}

const Slack: FunctionComponent<Props> = ({ slack }) => {
  const isAuthorisedSlack = slack?.teamName;
  return (
    <section className={styles.section}>
      <button className={styles.section__logo}>
        <SlackLogo className={styles.logo} />
      </button>

      <header className={styles.section__header}>
        {isAuthorisedSlack ? (
          <>
            {slack.teamName}
            <span className="-d-block">
              Added: {dateUtils.toUserFullDateDisplay(slack.createdAt)}{' '}
              {dateUtils.toUserTimeDisplay(slack.createdAt)}
            </span>
          </>
        ) : (
          'App Not Added'
        )}
      </header>

      <footer className={styles.section__footer}>
        <p className="-fz-medium">
          The Sparkle slack app will be added to the Slack Team of your
          choosing. Once added, Sparkle will use channels specified in the app
          to send messages automatically. To remove the Sparkle App, please
          remove from Slack directly, through your Team&apos;s settings.
        </p>
        {isAuthorisedSlack && (
          <>
            <h6 className="-fw-bold -mt-sm -c-gray-dark -fz-medium">
              System Channel
            </h6>
            {slack.defaultChannelName ? (
              <p className="-c-primary-dark">#{slack.defaultChannelName}</p>
            ) : (
              <p className="-mb-none">NOT SET</p>
            )}
          </>
        )}
      </footer>
    </section>
  );
};

export default Slack;