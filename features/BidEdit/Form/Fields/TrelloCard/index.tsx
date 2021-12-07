import { FunctionComponent } from 'react';
import clsx from 'clsx';
import AlbumIcon from '../../../../../public/icons/sparkle/album.svg';
import styles from '../../../styles.module.scss';

interface Props {
  trelloCardURL: string;
}

const TrelloCard: FunctionComponent<Props> = ({ trelloCardURL }: Props) => {
  if (!trelloCardURL) {
    return null;
  }
  return (
    <>
      <div className={clsx(styles.form__group, '-mt-lg')}>
        <label>Trello Card</label>
      </div>
      <div
        className={clsx(styles.form__card__pill, '-mt')}
        data-testid="trello-card-pill"
      >
        <h5 className={styles.form__card__pill__title}>
          <AlbumIcon />
          Trello Card #1
        </h5>
        <a
          href={trelloCardURL}
          target="_blank"
          rel="noreferrer"
          data-testid="bid-form-trello-card-url"
        >
          View Card
        </a>
      </div>
    </>
  );
};

TrelloCard.displayName = 'TrelloCard';

export default TrelloCard;
