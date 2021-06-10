import { useState } from 'react';
import clsx from 'clsx';
import styles from './DeleteConfirmModal.module.scss';
import WarningIcon from '../Icons/warning';

const DeleteConfirmModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  document.removeEventListener('propertyDeleteConfirm', () => {});
  document.addEventListener(
    'propertyDeleteConfirm',
    () => {
      setIsModalVisible(true);
    },
    false
  );

  const onDeleteClick = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      alert('Delete Property');
    }, 150);
  };

  return (
    <div
      className={clsx(isModalVisible ? styles.modalV2Overlay : '')}
      onClick={() => setIsModalVisible(false)}
    >
      <div
        id="ember28"
        className={clsx(
          styles.modal,
          isModalVisible ? styles.isVisible : '',
          styles['-prompt'],
          styles['ember-view']
        )}
      >
        <header className={styles.modal__header}>
          <WarningIcon width="50" height="50" fill="#fed933" />
          <h5 className={styles.modal__heading}>
            Are you sure you want to delete this property?
          </h5>
        </header>

        <div className={styles.modal__main}>
          <div className={styles.modal__main__content}>
            <p className={styles.modal__description}>
              You must have admin access in order to update system settings.
            </p>
          </div>

          <footer className={styles.modal__main__footer}>
            <button
              className={clsx(styles.button, styles.gray)}
              data-modal="close"
              onClick={() => setIsModalVisible(false)}
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

export default DeleteConfirmModal;
