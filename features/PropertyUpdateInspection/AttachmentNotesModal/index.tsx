import clsx from 'clsx';
import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import InspectionItemControls from '../../../common/InspectionItemControls';
import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  onChange?: () => void;
  selectedInspectionItem: inspectionTemplateItemModel;
}

const AttachmentNoteModal: FunctionComponent<Props> = ({
  onChange,
  onClose,
  selectedInspectionItem
}) => {
  const onInputChange = () => null;

  const {
    inspectorNotes,
    title,
    mainInputType,
    mainInputSelected,
    mainInputSelection
  } = selectedInspectionItem;
  const showInspectionItemControl = mainInputType !== 'oneaction_notes';
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

      <div className={clsx(baseStyles.modal__main)}>
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
          ></textarea>

          {showInspectionItemControl && (
            <>
              <h6 className={styles.AttachmentNoteModal__formLabel}>
                Condition
              </h6>
              <InspectionItemControls
                inputType={mainInputType}
                selected={mainInputSelected}
                selectedValue={mainInputSelection}
                onInputChange={onInputChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal(AttachmentNoteModal, false, styles.AttachmentNoteModal);
