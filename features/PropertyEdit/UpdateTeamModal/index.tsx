import { FunctionComponent } from 'react';
import teamModel from '../../../common/models/team';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import CheckedIcon from '../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../public/icons/sparkle/not-checked.svg';

interface Props extends ModalProps {
  team: teamModel;
  selectedTeamId: string;
  teams: Array<any>;
  closeUpdateTeamModal: () => void;
  isUpdateTeamModalVisible: () => void;
  changeTeamSelection: (string) => void;
}

const UpdateTeamModal: FunctionComponent<Props> = (props) => {
  const { teams, onClose, selectedTeamId, changeTeamSelection } = props;

  const closeModal = () => {
    onClose();
  };
  const checkItem = (id) => {
    if (selectedTeamId === id) {
      changeTeamSelection('');
    } else {
      changeTeamSelection(id);
    }
  };

  return (
    <div className={styles.updateTeamModal} data-testid="update-team-modal">
      <button
        onClick={closeModal}
        className={styles.modal__closeButton}
        data-testid="close"
      >
        ×
      </button>
      <header className={styles.modal__header}>
        <h5 className={styles.modal__heading}>Teams</h5>
      </header>

      <div className={styles.modal__main__content}>
        <ul>
          {teams.length &&
            teams.map((team) => (
              <li className={styles.updateTeamModal__items} key={team.id}>
                <input
                  type="checkbox"
                  id={team.id}
                  data-testid={`checkbox-item-${team.id}`}
                  className={styles.updateTeamModal__items__input}
                  checked={selectedTeamId === team.id}
                  onChange={() => checkItem(team.id)}
                  value={team.id}
                />
                <label
                  htmlFor={team.id}
                  className={styles.updateTeamModal__items__label}
                >
                  <div className={styles.updateTeamModal__items__label__text}>
                    {team.name}
                  </div>
                  {selectedTeamId === team.id ? (
                    <CheckedIcon
                      className={
                        styles.updateTeamModal__items__label__chequedIcon
                      }
                    />
                  ) : (
                    <NotCheckedIcon
                      className={
                        styles.updateTeamModal__items__label__notChequedIcon
                      }
                    />
                  )}
                </label>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal(UpdateTeamModal, true);
