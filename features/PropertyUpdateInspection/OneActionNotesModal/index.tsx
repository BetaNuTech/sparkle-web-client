import clsx from 'clsx';
import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  onChange: () => void;
  selectedInspectionItem: inspectionTemplateItemModel;
}

const OneActionNotesModal: FunctionComponent<Props> = ({
  onChange,
  onClose,
  selectedInspectionItem
}) => {
  const { mainInputNotes: value, title } = selectedInspectionItem;
  return (
    <div
      className={styles.oneActionNotesModal}
      data-testid="one-action-notes-modal"
    >
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="one-action-notes-modal-close"
      >
        ×
      </button>
      <header className={baseStyles.modal__header}>
        <h4 className={baseStyles.modal__heading}>{title}</h4>
      </header>

      <div
        className={clsx(
          baseStyles.modal__main,
          styles.oneActionNotesModal__main
        )}
      >
        <label
          htmlFor="inspection-main-input-notes"
          className={styles.oneActionNotesModal__formLabel}
        >
          Notes
        </label>
        <textarea
          id="inspection-main-input-notes"
          className={clsx(
            'form-control',
            styles.oneActionNotesModal__formNoteInput
          )}
          rows={3}
          name="notes"
          onChange={onChange}
          defaultValue={value}
        ></textarea>
      </div>
    </div>
  );
};

export default Modal(OneActionNotesModal, false, styles.oneActionNotesModal);
