import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import QuestionMarkIcon from '../../../public/icons/sparkle/question-mark.svg';
import parentStyles from '../../../common/Modal/styles.module.scss';

const NewUserPrompt: FunctionComponent<ModalProps> = ({ onClose }) => (
  <>
    <header className={parentStyles.modalPrompt__header}>
      <span className={clsx(parentStyles.modal__header__icon)}>
        <QuestionMarkIcon />
      </span>
      <h5 className={parentStyles.modalPrompt__heading}>New User?</h5>
    </header>

    <div
      className={parentStyles.modalPrompt__main}
      data-testid="new-user-prompt"
    >
      <div className={parentStyles.modalPrompt__main__content}>
        <p className={parentStyles.modal__description}>
          Sparkle is invite only. Once an administrator has added you, choose
          Sign in with Google and use the Google account for your work email
          address. There is no password to set up.
        </p>
      </div>
      <footer className={parentStyles.modalPrompt__main__footer}>
        <button
          className={clsx('button', parentStyles.modal__mainFooterbutton)}
          onClick={onClose}
          data-testid="btn-confirm-new-user"
        >
          OK
        </button>
      </footer>
    </div>
  </>
);

export default Modal(
  NewUserPrompt,
  true,
  parentStyles['-forceLeft'],
  parentStyles['-forceLeftOverlay']
);
