import clsx from 'clsx';
import { FunctionComponent } from 'react';
import TeamModel from '../../../common/models/team';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import baseStyles from '../../../common/Modal/styles.module.scss';
import ModalItem from '../ModalItem';

interface Props extends ModalProps {
  onClose: () => void;
  teams: TeamModel[];
  onSelect(teamId: string): void;
  selectedTeams: string[];
}

const TeamModal: FunctionComponent<Props> = ({
  onClose,
  teams,
  onSelect,
  selectedTeams
}) => {
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div
      className="-flex-direction-column -full-height"
      data-testid="user-edit-team-modal"
    >
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>Teams</h4>
        <h5>Update user team associations</h5>
      </header>
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="user-edit-team-close"
      >
        ×
      </button>

      <div className={clsx(baseStyles.modal__main)}>
        <ul>
          {sortedTeams.map((team) => {
            const isSelected = selectedTeams.includes(team.id);
            return (
              <ModalItem
                key={team.id}
                item={team}
                isSelected={isSelected}
                onClick={() => onSelect(team.id)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Modal(TeamModal, false);
