import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from '../../../common/Modal/styles.module.scss';
import WarningIcon from '../../../public/icons/sparkle/warning.svg';

interface Props extends ModalProps {
  onConfirm: () => any;
}

const DeleteTeamPrompt: FunctionComponent<Props> = (props) => {
  // Handle confirm delete and close modal
  const confirmAndClose = () => {
    props.onConfirm();
    props.onClose();
  };

  return (
    <>
      <header className={styles.modalPrompt__header}>
        <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
          <WarningIcon />
        </span>
        <h5 className={styles.modalPrompt__heading}>
          Are you sure you want to delete this team?
        </h5>
      </header>

      <div className={styles.modalPrompt__main}>
        <div className={styles.modalPrompt__main__content}>
          <p className={styles.modal__description}>
            NOTE: This action will also delete all entries associated with this
            team.
          </p>
        </div>

        <footer className={styles.modalPrompt__main__footer}>
          <button
            className={clsx('button', 'gray', styles.modal__mainFooterbutton)}
            onClick={props.onClose} // eslint-disable-line
            data-testid="close"
          >
            CANCEL
          </button>
          <button
            className={clsx('button', 'alert', styles.modal__mainFooterbutton)}
            onClick={confirmAndClose}
            data-testid="confirm"
          >
            DELETE
          </button>
        </footer>
      </div>
    </>
  );
};

export default Modal(DeleteTeamPrompt, true);
