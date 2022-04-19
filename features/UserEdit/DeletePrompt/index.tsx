import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from '../../../common/Modal/styles.module.scss';
import WarningIcon from '../../../public/icons/sparkle/warning.svg';

interface Props extends ModalProps {
  onConfirm: () => any;
}

const DeleteUserPrompt: FunctionComponent<Props> = ({ onClose, onConfirm }) => (
  <>
    <header className={styles.modalPrompt__header}>
      <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
        <WarningIcon />
      </span>
      <h5 className={styles.modalPrompt__heading}>
        Please confirm you’d like to delete this user
      </h5>
    </header>

    <div className={styles.modalPrompt__main} data-testid="user-delete-prompt">
      <footer className={styles.modalPrompt__main__footer}>
        <button
          className={clsx('button', 'gray', styles.modal__mainFooterbutton)}
          onClick={onClose} // eslint-disable-line
        >
          CANCEL
        </button>
        <button
          className={clsx('button', 'alert', styles.modal__mainFooterbutton)}
          onClick={onConfirm}
          data-testid="btn-confirm-delete-user"
        >
          Confirm Delete
        </button>
      </footer>
    </div>
  </>
);

export default Modal(DeleteUserPrompt, true);
