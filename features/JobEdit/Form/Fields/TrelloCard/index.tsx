import { FunctionComponent } from 'react';
import clsx from 'clsx';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import AlbumIcon from '../../../../../public/icons/sparkle/album.svg';
import ActionsIcon from '../../../../../public/icons/ios/actions.svg';
import Dropdown, { DropdownButton } from '../../../../../common/Dropdown';
import styles from '../../../styles.module.scss';

interface Props {
  trelloCardURL: string;
  isLoading: boolean;
  isJobComplete: boolean;
  isMobile: boolean;
  isNewJob: boolean;
  openTrelloCardDeletePrompt(): void;
  openTrelloCardInputPrompt(string?): void;
}

const JobTrelloCard: FunctionComponent<Props> = ({
  trelloCardURL,
  isLoading,
  isJobComplete,
  isMobile,
  isNewJob,
  openTrelloCardInputPrompt,
  openTrelloCardDeletePrompt
}) =>
  !isNewJob && (
    <div className={styles.jobNew__card}>
      <div className={styles.jobNew__card__pill__action}>
        <h4 className={styles.jobNew__card__title}>Trello Card</h4>
        {trelloCardURL && (
          <span className={styles.jobNew__card__pill__action__menu}>
            <ActionsIcon />
            <Dropdown>
              <DropdownButton
                type="button"
                disabled={isLoading || isJobComplete}
                onClick={() => openTrelloCardInputPrompt(trelloCardURL)}
              >
                Update
              </DropdownButton>
              <DropdownButton
                type="button"
                disabled={isLoading || isJobComplete}
                onClick={() => openTrelloCardDeletePrompt()}
              >
                Delete
              </DropdownButton>
            </Dropdown>
          </span>
        )}
      </div>
      {trelloCardURL ? (
        <div
          className={clsx(styles.jobNew__card__pill, '-mt')}
          data-testid="trello-card-pill"
        >
          <h5 className={styles.jobNew__card__pill__title}>
            <AlbumIcon />
            Trello Card #1
          </h5>
          <a href={trelloCardURL} target="_blank" rel="noreferrer">
            View Card
          </a>
        </div>
      ) : (
        <div className={clsx(styles.button__group, '-mt', '-mr-none')}>
          <button
            type="button"
            disabled={isLoading || isJobComplete}
            className={clsx(
              styles.button__submit,
              isMobile && styles.button__fullwidth
            )}
            onClick={() => openTrelloCardInputPrompt()}
            data-testid="add-trello-card-btn"
          >
            Add Trello Card{' '}
            <span>
              <AddIcon />
            </span>
          </button>
        </div>
      )}
    </div>
  );

JobTrelloCard.displayName = 'JobTrelloCard';

export default JobTrelloCard;
