import clsx from 'clsx';
import { FunctionComponent } from 'react';
import AddIcon from '../../../../public/icons/ios/add.svg';
import AlbumIcon from '../../../../public/icons/sparkle/album.svg';
import LinkFeature from '../../../../common/LinkFeature';
import DeficientItemModel from '../../../../common/models/deficientItem';
import formStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
  isOnline: boolean;
  onCreateTrelloCard(): void;
  propertyId: string;
  isLoading: boolean;
  hasOpenList: boolean;
  isPill?: boolean;
}

const DeficientItemEditFormTrelloCard: FunctionComponent<Props> = ({
  deficientItem,
  isVisible,
  isOnline,
  onCreateTrelloCard,
  propertyId,
  isLoading,
  hasOpenList,
  isPill
}) => {
  const showTrelloCardUrl = deficientItem.trelloCardURL;
  const showCreateCardAction = hasOpenList && !deficientItem.trelloCardURL;

  if (!isVisible) {
    return <></>;
  }
  return (
    <section className={formStyles.section} data-testid="item-trello">
      <header className={clsx(isPill ? formStyles.heading : formStyles.label)}>
        Trello Card
      </header>

      <footer className={formStyles.section__footer}>
        {showTrelloCardUrl && (
          <a
            href={deficientItem.trelloCardURL}
            target="_blank"
            rel="noreferrer"
            className={clsx(
              !isPill && formStyles.action,
              !isPill && '-bgc-primary',
              isPill && formStyles['action--paddedPill']
            )}
            data-testid="trello-card-link"
          >
            {isPill && <AlbumIcon className={styles.icon} />}
            <span className={styles.linkText}>View Card</span>
          </a>
        )}
        {showCreateCardAction && (
          <button
            onClick={onCreateTrelloCard}
            className={clsx(
              formStyles.action,
              '-bgc-primary',
              isPill && formStyles['action--fullButton']
            )}
            disabled={isLoading || !isOnline}
            data-testid="trello-card-action"
          >
            {isLoading ? (
              <span className={formStyles.aniBlink}>Creating card...</span>
            ) : (
              'Create Card'
            )}
            {isPill && !isLoading && (
              <span className={formStyles.action__icon}>
                <AddIcon />
              </span>
            )}
          </button>
        )}
        {!hasOpenList && (
          <LinkFeature
            className={clsx(
              formStyles.action,
              '-bgc-primary',
              isPill && formStyles['action--pill']
            )}
            href={`/properties/edit/${propertyId}/trello`}
            featureEnabled={true} // eslint-disable-line react/jsx-boolean-value
            target="_blank"
            data-testid="configure-trello-action"
          >
            Configure Trello
          </LinkFeature>
        )}
      </footer>
    </section>
  );
};

DeficientItemEditFormTrelloCard.defaultProps = {
  isPill: false
};

export default DeficientItemEditFormTrelloCard;
