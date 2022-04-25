import { FunctionComponent } from 'react';
import TrelloIntegration from '../../../../common/models/trelloIntegration';
import TrelloLogo from '../../../../public/logos/trello.svg';
import styles from '../styles.module.scss';

interface Props {
  trello: TrelloIntegration;
}

const Trello: FunctionComponent<Props> = ({ trello }) => {
  const isAuthorisedTrello = trello?.trelloUsername;

  return (
    <section className={styles.section}>
      <button className={styles.section__logo}>
        <TrelloLogo className={styles.logo} />
      </button>

      <header className={styles.section__header}>
        {isAuthorisedTrello ? (
          <>
            {trello.trelloFullName} (@{trello.trelloUsername})
            <small className={styles.section__headerSub}>
              {trello.trelloEmail || 'Email not provided'}
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
