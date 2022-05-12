import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import ErrorLabel from '../../../common/ErrorLabel';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from '../../../common/Modal/styles.module.scss';
import TeamModal from '../../../common/models/team';
import { UserError } from '../hooks/useTeamForm';

interface Props extends ModalProps {
  onConfirm: (name: string) => void;
  isLoading: boolean;
  errors: Record<string, UserError>;
  isEditingTeam: boolean;
  team: TeamModal;
}

const AddEditTeamPrompt: FunctionComponent<Props> = ({
  onConfirm,
  onClose,
  isLoading,
  errors,
  isEditingTeam,
  team
}) => {
  const [teamName, setTeamName] = useState<string>(team?.name || '');
  const title = isEditingTeam ? 'Edit Team' : 'Create New Team';
  const isDisabledSubmit = !teamName.trim() || isLoading;

  return (
    <>
      <header className={styles.modalPrompt__header}>
        <h5 className={styles.modalPrompt__heading}>{title}</h5>
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
              defaultValue={teamName}
              data-testid="team-name"
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
            disabled={isDisabledSubmit}
            className={clsx('button', styles.modal__mainFooterbutton)}
            onClick={() => onConfirm(teamName)}
            data-testid="save-button"
          >
            {isLoading ? (
              <span className={styles['modal__mainFooterbutton--loading']}>
                {isEditingTeam ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{isEditingTeam ? 'Update' : 'Create'}</span>
            )}
          </button>
        </footer>
      </div>
    </>
  );
};

export default Modal(AddEditTeamPrompt, true);
