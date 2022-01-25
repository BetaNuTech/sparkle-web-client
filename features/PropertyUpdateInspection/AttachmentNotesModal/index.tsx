import clsx from 'clsx';
import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import InspectionItemControls from '../../../common/InspectionItemControls';
import MiniPreviewGallery from '../../../common/MiniPreviewGallery';
import baseStyles from '../../../common/Modal/styles.module.scss';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  onChange?: () => void;
  selectedInspectionItem: inspectionTemplateItemModel;
  propertyId: string;
  inspectionId: string;
  isMobile: boolean;
  canEdit: boolean;
}

const AttachmentNoteModal: FunctionComponent<Props> = ({
  onChange,
  onClose,
  selectedInspectionItem,
  propertyId,
  inspectionId,
  isMobile,
  canEdit
}) => {
  // eslint-disable-next-line max-len
  const uploadPageLink = `/properties/${propertyId}/update-inspection/${inspectionId}/uploads?item=${selectedInspectionItem.id}`;

  const { inspectorNotes, title, mainInputType, photos, photosData } =
    selectedInspectionItem;
  const showInspectionItemControl = mainInputType !== 'oneaction_notes';

  const photosDataItems = Object.keys(photosData || {}).map((key) => ({
    id: key,
    ...photosData[key]
  }));

  const hasExistingPhotos = photosDataItems.length > 0;
  const showPhotosData = !isMobile && photos && hasExistingPhotos;

  return (
    <div
      className={styles.AttachmentNoteModal}
      data-testid="attachment-notes-modal"
    >
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="attachment-notes-modal-close"
      >
        ×
      </button>
      <header className={baseStyles.modal__header}>
        <h4 className={baseStyles.modal__heading}>{title}</h4>
      </header>

      <div className={clsx(baseStyles.modal__main, baseStyles['-twoColumn'])}>
        {showPhotosData && (
          <aside
            className={clsx(
              baseStyles.modal__main__sidebar,
              styles.AttachmentNoteModal__sidebar
            )}
            data-testid="attachmentNotesModal-sidebar"
          >
            <LinkFeature
              featureEnabled={features.supportBetaInspectionUploadPhotos}
              href={uploadPageLink}
            >
              <MiniPreviewGallery photos={photosDataItems} />
            </LinkFeature>
          </aside>
        )}
        <div className={clsx(baseStyles.modal__main__content)}>
          <label
            htmlFor="inspection-main-input-notes"
            className={styles.AttachmentNoteModal__formLabel}
          >
            Notes
          </label>
          <textarea
            id="inspection-main-input-notes"
            className={clsx(
              'form-control',
              styles.AttachmentNoteModal__formNoteInput
            )}
            rows={3}
            name="notes"
            onChange={onChange}
            defaultValue={inspectorNotes}
            data-testid="attachmentNotesModal-textarea"
            disabled={!canEdit}
          ></textarea>

          {showInspectionItemControl && (
            <>
              <h6 className={styles.AttachmentNoteModal__formLabel}>
                Condition
              </h6>
              <InspectionItemControls
                item={selectedInspectionItem}
                canEdit={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal(AttachmentNoteModal, false, styles.AttachmentNoteModal);
