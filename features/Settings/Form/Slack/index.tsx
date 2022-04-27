import clsx from 'clsx';
import { FunctionComponent } from 'react';
import SlackIntegration from '../../../../common/models/slackIntegration';
import dateUtils from '../../../../common/utils/date';
import systemSettings from '../../../../config/systemSettings';
import SlackLogo from '../../../../public/logos/slack.svg';
import AuthError from '../AuthError';
import Loader from '../Loader';
import styles from '../styles.module.scss';

const BASE_AUTH_URL = systemSettings.slack.authURL;

interface Props {
  integration: SlackIntegration;
  redirectUrl: string;
  isAuthorizing: boolean;
  hasError: boolean;
  reAuthorize(): void;
  onDeleteSlackAuth(): void;
  onSetChannelName(initialValue: string): void;
  isUpdatingChannel: boolean;
}

const Slack: FunctionComponent<Props> = ({
  integration,
  redirectUrl,
  isAuthorizing,
  hasError,
  reAuthorize,
  onDeleteSlackAuth,
  onSetChannelName,
  isUpdatingChannel
}) => {
  const isAuthorized = integration?.teamName;
  const authUrl = `${BASE_AUTH_URL}&redirect_uri=${redirectUrl}`;
  const channelName = integration?.defaultChannelName
    ? `#${integration.defaultChannelName}`
    : 'NOT SET';

  return (
    <section className={styles.section}>
      {isAuthorizing && (
        <Loader title={isAuthorized ? '' : 'Authorizing Slack...'} />
      )}
      {hasError && !isAuthorizing && <AuthError onClick={reAuthorize} />}
      {!isAuthorizing && !hasError && (
        <>
          {isAuthorized ? (
            <button
              className={styles.section__logo}
              onClick={onDeleteSlackAuth}
            >
              <SlackLogo className={styles.logo} />
            </button>
          ) : (
            <a href={authUrl} className={styles.section__logo}>
              <SlackLogo className={styles.logo} />
            </a>
          )}
        </>
      )}

      <header className={styles.section__header}>
        {isAuthorized ? (
          <>
            {integration.teamName}
            <span className="-d-block">
              Added: {dateUtils.toUserFullDateDisplay(integration.createdAt)}{' '}
              {dateUtils.toUserTimeDisplay(integration.createdAt)}
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
        {isAuthorized && (
          <>
            <h6 className="-fw-bold -mt-sm -c-gray-dark -fz-medium">
              System Channel
            </h6>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <p
              className={clsx(
                integration.defaultChannelName && !isUpdatingChannel
                  ? '-c-primary-dark'
                  : '',
                isUpdatingChannel ? styles.loading : '',
                '-mb-none',
                '-cu-pointer'
              )}
              onClick={() =>
                onSetChannelName(integration.defaultChannelName || '')
              }
            >
              {isUpdatingChannel ? 'Saving...' : channelName}
            </p>
          </>
        )}
      </footer>
    </section>
  );
};

export default Slack;
