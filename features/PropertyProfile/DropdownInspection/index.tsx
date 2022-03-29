import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import {
  canDeleteInspection,
  canReassignInspectionProperty
} from '../../../common/utils/userPermissions';
import Dropdown, { DropdownButton } from '../../../common/Dropdown';

interface Props {
  user: userModel;
  onDeleteClick?: () => any;
  onMove?: () => void;
}

const DropdownInspection: FunctionComponent<Props> = ({
  user,
  onDeleteClick,
  onMove
}) => (
  <Dropdown>
    {canDeleteInspection(user) ? (
      <DropdownButton onClick={onDeleteClick}>Delete</DropdownButton>
    ) : null}
    {canReassignInspectionProperty(user) ? (
      <DropdownButton onClick={onMove}>Move</DropdownButton>
    ) : null}
  </Dropdown>
);

export default DropdownInspection;
