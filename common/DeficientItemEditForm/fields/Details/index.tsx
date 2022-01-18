import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../models/deficientItem';
import dateUtil from '../../../utils/date';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isMobile: boolean;
  onClickViewPhotos(): void;
}

const DeficientItemEditFormDetails: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  onClickViewPhotos
}) => (
  <section className={styles.field} data-testid="item-details">
    {isMobile && <header className={styles.field__label}>ITEM DETAILS</header>}
    <hgroup className={styles.field__container}>
      <small data-testid="created-at" className={styles.field__createdAt}>
        {dateUtil.toUserFullDateDisplay(deficientItem.createdAt)}
      </small>
      <h5 data-testid="item-title" className={styles.field__itemTitle}>
        {deficientItem.itemTitle}
      </h5>
      <h6 data-testid="section-title" className={styles.field__sectionTitle}>
        {deficientItem.sectionTitle}
      </h6>
      {deficientItem.sectionSubtitle && (
        <h6 data-testid="section-subtitle">{deficientItem.sectionSubtitle}</h6>
      )}
    </hgroup>
    <footer className={styles.field__footer}>
      <button
        onClick={onClickViewPhotos}
        disabled={!deficientItem.hasItemPhotoData}
        className={styles.field__footer__action}
        data-testid="view-photo-button"
      >
        View Photo(s)
      </button>
    </footer>
  </section>
);

export default DeficientItemEditFormDetails;
