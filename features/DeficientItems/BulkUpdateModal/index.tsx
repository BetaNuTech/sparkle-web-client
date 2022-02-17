import { FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import utilString from '../../../common/utils/string';
import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  movingItemsLength: number;
  nextState: string;
}

const BulkUpdateModal: FunctionComponent<Props> = ({
  onClose,
  movingItemsLength,
  nextState
}) => (
  <div className={styles.modal} data-testid="bulk-update-modal">
    <button
      className={baseStyles.modal__closeButton}
      onClick={onClose}
      data-testid="bulk-update-modal-close"
    >
      ×
    </button>
    <header className={baseStyles.modal__header}>
      <h4
        className={baseStyles.modal__heading}
        data-testid="bulk-update-modal-heading"
      >
        Move To {utilString.titleize(utilString.dedash(nextState))}
      </h4>
    </header>

    <div className={baseStyles.modal__main}>
      <div className={baseStyles.modal__main__content}>
        <h6 className={baseStyles.modal__subHeading}>
          You&apos;re moving {movingItemsLength} deficient item
          {movingItemsLength > 1 && 's'}
        </h6>
      </div>
      <footer className={baseStyles.modal__main__footer}>
        <button
          className={baseStyles.modal__main__footerClose}
          onClick={onClose}
          data-testid="bulk-update-modal-abort"
        >
          Abort
        </button>
      </footer>
    </div>
  </div>
);

export default Modal(BulkUpdateModal, false, styles.modal);
