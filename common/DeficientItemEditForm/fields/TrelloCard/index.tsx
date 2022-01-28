import clsx from 'clsx';
import { FunctionComponent } from 'react';
import AddIcon from '../../../../public/icons/ios/add.svg';
import DeficientItemModel from '../../../models/deficientItem';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
  onCreateTrelloCard(): void;
  isLoading: boolean;
  isPill?: boolean;
}

const DeficientItemEditFormTrelloCard: FunctionComponent<Props> = ({
  deficientItem,
  isVisible,
  onCreateTrelloCard,
  isLoading,
  isPill
}) => {
  if (!isVisible) {
    return <></>;
  }
  return (
    <section
      className={clsx(styles.section, isPill && styles['section--pill'])}
      data-testid="item-trello"
    >
      <header className={clsx(styles.label, isPill && styles['label--pill'])}>
        Trello Card
      </header>

      <footer className={styles.section__footer}>
        {deficientItem.trelloCardURL ? (
          <a
            href={deficientItem.trelloCardURL}
            className={clsx(
              styles.action,
              '-bgc-primary',
              isPill && styles['action--pill']
            )}
            data-testid="trello-card-link"
          >
            {isPill ? 'Published' : 'View Card'}
          </a>
        ) : (
          <button
            onClick={onCreateTrelloCard}
            className={clsx(
              styles.action,
              '-bgc-primary',
              isPill && styles['action--pill']
            )}
            disabled={isLoading}
            data-testid="trello-card-action"
          >
            {isLoading ? 'Please Wait' : 'Create Card'}
            {isPill && (
              <span className={styles.action__icon}>
                <AddIcon />
              </span>
            )}
          </button>
        )}
      </footer>
    </section>
  );
};

DeficientItemEditFormTrelloCard.defaultProps = {
  isPill: false
};

export default DeficientItemEditFormTrelloCard;
