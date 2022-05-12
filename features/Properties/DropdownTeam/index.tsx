import { FunctionComponent } from 'react';
import Dropdown, { DropdownButton } from '../../../common/Dropdown';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  onDelete(): void;
  onEdit(): void;
}

const DropdownTeam: FunctionComponent<Props> = ({ onDelete, onEdit }) => (
  <Dropdown isOnRight>
    <DropdownButton onClick={onEdit} data-testid="dropdown-edit-team">
      Edit
    </DropdownButton>
    <DropdownButton onClick={onDelete}>Delete</DropdownButton>
  </Dropdown>
);

export default DropdownTeam;
