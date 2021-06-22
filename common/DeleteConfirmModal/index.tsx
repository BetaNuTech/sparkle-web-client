import { FunctionComponent, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import WarningIcon from '../../public/icons/sparkle/warning.svg';

type Model = {
  /** Alert title next to the icon */
  title?: string;
  /** Message for user describing the confirmation */
  message?: string;
  onDelete?(): void;
  onCancel?(): void;
};

const DeleteConfirmModal: FunctionComponent<Model> = ({ title, message }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const listenerCallback = () => {
    setIsModalVisible(true);
  };

  const onCancelClick = () => {
    /**
     * Hide modal
     *
     * This will be called on either cancel, back-drop click or click of delete confirmation
     */
    setIsModalVisible(false);
  };

  useEffect(() => {
    /** We we are use effect because listener were getting attached multiple times */
    document.removeEventListener('deleteConfirm', listenerCallback);
    document.addEventListener('deleteConfirm', listenerCallback, false);
    return () => {
      /** For any cleanup on unmounting component */
    };
  }, []);

  const onDeleteClick = () => {
    /** Hide modal */
    onCancelClick();
    setTimeout(() => {
      /** TODO: Call a callback function which needs to be called once delete is confirmed */
    }, 50);
  };

  return (
    <div
      className={clsx(isModalVisible ? styles.modalV2Overlay : '')}
      onClick={onCancelClick}
    >
      <div
        className={clsx(
          styles.modal,
          isModalVisible ? styles.isVisible : '',
          styles['-prompt'],
          styles['ember-view']
        )}
        style={{ top: window.scrollY + 50 }}
      >
        <header className={styles.modal__header}>
          <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
            <WarningIcon />
          </span>
          <h5 className={styles.modal__heading}>{title}</h5>
        </header>

        <div className={styles.modal__main}>
          <div className={styles.modal__main__content}>
            <p className={styles.modal__description}>{message}</p>
          </div>

          <footer className={styles.modal__main__footer}>
            <button
              className={clsx(styles.button, styles.gray)}
              data-modal="close"
              onClick={onCancelClick}
            >
              CANCEL
            </button>
            <button
              data-modal="close"
              className={clsx(styles.button, styles.alert)}
              onClick={onDeleteClick}
            >
              DELETE
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmModal.defaultProps = {
  title: 'Are you sure, you want to delete?',
  message: 'You must have necessary rights to perform this action'
};

export default DeleteConfirmModal;
