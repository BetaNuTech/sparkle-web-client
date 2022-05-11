import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import ErrorLabel from '../../../common/ErrorLabel';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from '../../../common/Modal/styles.module.scss';

interface Props extends ModalProps {
  onConfirm: (teamName: string) => any;
  isLoading: boolean;
  errors: Record<string, any>;
}

const AddTeamPrompt: FunctionComponent<Props> = ({
  onConfirm,
  onClose,
  isLoading,
  errors
}) => {
  const [teamName, setTeamName] = useState<string>('');

  return (
    <>
      <header className={styles.modalPrompt__header}>
        <h5 className={styles.modalPrompt__heading}>Create New Team</h5>
      </header>

      <div className={styles.modalPrompt__main}>
        <div className={styles.modalPrompt__main__content}>
          <div>
            <label className={styles.modal__description} htmlFor="teamInput">
              Team Name<sup>*</sup>
            </label>
            <input
              type="text"
              id="teamInput"
              onChange={(evt) => setTeamName(evt.target.value)}
              className="-m-none"
              disabled={isLoading}
            />
            <ErrorLabel formName="name" errors={errors} />
          </div>
        </div>

        <footer className={styles.modalPrompt__main__footer}>
          <button
            className={clsx('button', 'gray', styles.modal__mainFooterbutton)}
            onClick={onClose} // eslint-disable-line
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            disabled={!teamName || isLoading}
            className={clsx('button', styles.modal__mainFooterbutton)}
            onClick={() => onConfirm(teamName)}
          >
            {isLoading ? (
              <span className={styles['modal__mainFooterbutton--loading']}>
                Creating...
              </span>
            ) : (
              'Create'
            )}
          </button>
        </footer>
      </div>
    </>
  );
};

export default Modal(AddTeamPrompt, true);
