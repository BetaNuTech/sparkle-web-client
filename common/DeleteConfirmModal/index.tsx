import { FunctionComponent, useState } from 'react';
import clsx from 'clsx';
import styles from './DeleteConfirmModal.module.scss';
import WarningIcon from '../Icons/warning';

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

  /* eslint-disable @typescript-eslint/no-empty-function */
  document.removeEventListener('propertyDeleteConfirm', () => {});
  /* eslint-enable */
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
      console.warn('On delete called'); // eslint-disable-line no-console
    }, 50);
  };

  return (
    <div
      className={clsx(isModalVisible ? styles.modalV2Overlay : '')}
      onClick={() => setIsModalVisible(false)}
    >
      <div
        className={clsx(
          styles.modal,
          isModalVisible ? styles.isVisible : '',
          styles['-prompt'],
          styles['ember-view']
        )}
      >
        <header className={styles.modal__header}>
          <WarningIcon width="50" height="50" fill="#fed933" />
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

DeleteConfirmModal.defaultProps = {
  title: 'Are you sure, you want to delete?',
  message: 'You must have necessary rights to perform this action'
};

export default DeleteConfirmModal;
