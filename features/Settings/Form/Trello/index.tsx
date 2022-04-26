import { FunctionComponent } from 'react';
import TrelloIntegration from '../../../../common/models/trelloIntegration';
import TrelloLogo from '../../../../public/logos/trello.svg';
import AuthError from '../AuthError';
import Loader from '../Loader';
import styles from '../styles.module.scss';
import systemSettings from '../../../../config/systemSettings';

const BASE_AUTH_URL = systemSettings.trello.authURL;

interface Props {
  integration: TrelloIntegration;
  redirectUrl: string;
  isAuthorizing: boolean;
  hasError: boolean;
  reAuthorize(): void;
}

const Trello: FunctionComponent<Props> = ({
  integration,
  redirectUrl,
  isAuthorizing,
  hasError,
  reAuthorize
}) => {
  const isAuthorized = integration?.trelloUsername;
  const authUrl = `${BASE_AUTH_URL}&return_url=${redirectUrl}`;

  return (
    <section className={styles.section}>
      {isAuthorizing && <Loader title="Authorizing Trello..." />}
      {hasError && !isAuthorizing && <AuthError onClick={reAuthorize} />}
      {!isAuthorizing && !hasError && (
        <>
          {isAuthorized ? (
            <button className={styles.section__logo}>
              <TrelloLogo className={styles.logo} />
            </button>
          ) : (
            <a href={authUrl} className={styles.section__logo}>
              <TrelloLogo className={styles.logo} />
            </a>
          )}
        </>
      )}

      <header className={styles.section__header}>
        {isAuthorized ? (
          <>
            {integration.trelloFullName} (@
            {integration.trelloUsername})
            <small className={styles.section__headerSub}>
              {integration.trelloEmail || 'Email not provided'}
            </small>
          </>
        ) : (
          'Not Logged In'
        )}
      </header>

      <footer className={styles.section__footer}>
        Sparkle will create, move, and update cards as the user logged in.
        Choose an account that you would like to associate with Sparkle.
      </footer>
    </section>
  );
};

export default Trello;
