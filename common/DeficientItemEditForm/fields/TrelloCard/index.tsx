import clsx from 'clsx';
import { FunctionComponent } from 'react';
import AddIcon from '../../../../public/icons/ios/add.svg';
import AlbumIcon from '../../../../public/icons/sparkle/album.svg';
import LinkFeature from '../../../LinkFeature';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
  onCreateTrelloCard(): void;
  propertyId: string;
  isLoading: boolean;
  hasOpenList: boolean;
  isPill?: boolean;
}

const DeficientItemEditFormTrelloCard: FunctionComponent<Props> = ({
  deficientItem,
  isVisible,
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
    <section
      className={clsx(
        fieldStyles.section,
        isPill && fieldStyles['section--pill']
      )}
      data-testid="item-trello"
    >
      <header
        className={clsx(
          fieldStyles.label,
          isPill && fieldStyles['label--pill']
        )}
      >
        Trello Card
      </header>

      <footer className={fieldStyles.section__footer}>
        {showTrelloCardUrl && (
          <a
            href={deficientItem.trelloCardURL}
            target="_blank"
            rel="noreferrer"
            className={clsx(
              !isPill && fieldStyles.action,
              !isPill && '-bgc-primary',
              isPill && fieldStyles['action--paddedPill']
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
              fieldStyles.action,
              '-bgc-primary',
              isPill && fieldStyles['action--fullButton']
            )}
            disabled={isLoading}
            data-testid="trello-card-action"
          >
            {isLoading ? (
              <span className={fieldStyles.aniBlink}>Creating card...</span>
            ) : (
              'Create Card'
            )}
            {isPill && !isLoading && (
              <span className={fieldStyles.action__icon}>
                <AddIcon />
              </span>
            )}
          </button>
        )}
        {!hasOpenList && (
          <LinkFeature
            className={clsx(
              fieldStyles.action,
              '-bgc-primary',
              isPill && fieldStyles['action--pill']
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
