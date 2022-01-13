import { FunctionComponent } from 'react';
import DeficientItemModel from '../../models/deficientItem';
import dateUtil from '../../utils/date';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isMobile: boolean;
  onClickViewPhotos(): void;
}

const DeficientItemControls: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  onClickViewPhotos
}) => (
  <section
    className={styles.deficientItemControls__item}
    data-testid="item-details"
  >
    {isMobile && (
      <header className={styles.deficientItemControls__item__label}>
        ITEM DETAILS
      </header>
    )}
    <hgroup className={styles.deficientItemControls__item__container}>
      <small
        data-testid="created-at"
        className={styles.deficientItemControls__item__createdAt}
      >
        {dateUtil.toUserFullDateDisplay(deficientItem.createdAt)}
      </small>
      <h5
        data-testid="item-title"
        className={styles.deficientItemControls__item__itemTitle}
      >
        {deficientItem.itemTitle}
      </h5>
      <h6
        data-testid="section-title"
        className={styles.deficientItemControls__item__sectionTitle}
      >
        {deficientItem.sectionTitle}
      </h6>
      {deficientItem.sectionSubtitle && (
        <h6 data-testid="section-subtitle">{deficientItem.sectionSubtitle}</h6>
      )}
    </hgroup>
    <button
      onClick={onClickViewPhotos}
      disabled={!deficientItem.hasItemPhotoData}
      className={styles.deficientItemControls__item__viewPhotos}
      data-testid="view-photo-button"
    >
      View Photo(s)
    </button>
  </section>
);

export default DeficientItemControls;
