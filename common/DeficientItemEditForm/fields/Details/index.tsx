import clsx from 'clsx';
import { FunctionComponent } from 'react';
import MiniPreviewGallery from '../../../MiniPreviewGallery';
import DeficientItemModel from '../../../models/deficientItem';
import SelectionIcon from '../../../SelectionIcon';
import dateUtil from '../../../utils/date';
import fieldStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isMobile: boolean;
  onClickViewPhotos(): void;
}

const DeficientItemEditFormDetails: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  onClickViewPhotos
}) => {
  const photosDataItems = Object.keys(deficientItem.itemPhotosData || {}).map(
    (key) => ({
      id: key,
      ...deficientItem.itemPhotosData[key]
    })
  );
  const showPhotoPreview = !isMobile && deficientItem.hasItemPhotoData;

  return (
    <section data-testid="item-details" className={fieldStyles.section}>
      {isMobile && <header className={fieldStyles.label}>ITEM DETAILS</header>}
      {showPhotoPreview && (
        <MiniPreviewGallery
          photos={photosDataItems}
          onClick={onClickViewPhotos}
        />
      )}
      {!isMobile && (
        <SelectionIcon
          itemMainInputType={deficientItem.itemMainInputType}
          itemMainInputSelection={deficientItem.itemMainInputSelection}
        />
      )}
      <hgroup className={clsx(fieldStyles.section__main, !isMobile && '-mt')}>
        <small data-testid="created-at" className={styles.subHeading}>
          {dateUtil.toUserFullDateDisplay(deficientItem.createdAt)}
        </small>
        <h5 data-testid="item-title" className={styles.title}>
          {deficientItem.itemTitle}
        </h5>
        <h6 data-testid="section-title" className={styles.sectionTitle}>
          {deficientItem.sectionTitle}
        </h6>
        {deficientItem.sectionSubtitle && (
          <h6 data-testid="section-subtitle">
            {deficientItem.sectionSubtitle}
          </h6>
        )}
      </hgroup>
      <footer className={fieldStyles.section__footer}>
        <button
          onClick={onClickViewPhotos}
          disabled={!deficientItem.hasItemPhotoData}
          className={fieldStyles.textButton}
          data-testid="view-photo-button"
        >
          View Photo(s)
        </button>
      </footer>
    </section>
  );
};

export default DeficientItemEditFormDetails;
