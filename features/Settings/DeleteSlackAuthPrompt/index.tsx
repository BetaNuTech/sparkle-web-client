import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from '../../../common/Modal/styles.module.scss';
import WarningIcon from '../../../public/icons/sparkle/warning.svg';

interface Props extends ModalProps {
  onConfirm: () => any;
}

const DeleteSlackAuthPrompt: FunctionComponent<Props> = ({
  onClose,
  onConfirm
}) => (
  <>
    <header className={styles.modalPrompt__header}>
      <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
        <WarningIcon />
      </span>
      <h5 className={styles.modalPrompt__heading}>Uninstall Slack App</h5>
    </header>

    <div className={styles.modalPrompt__main} data-testid="delete-slack-auth">
      <div className={styles.modalPrompt__main__content}>
        <p className={styles.modal__description}>
          NOTE: Uninstalling the Sparkle Slack App will remove it from your
          workspace, sliencing all messages to your system and property
          channels.
        </p>
      </div>
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
          data-testid="confirm-delete-slack-auth"
        >
          UNINSTALL
        </button>
      </footer>
    </div>
  </>
);

export default Modal(DeleteSlackAuthPrompt, true);
