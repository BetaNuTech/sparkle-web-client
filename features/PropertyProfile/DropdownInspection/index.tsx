import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import {
  canDeleteInspection,
  canReassignInspectionProperty,
  canEditInspectionUnitNumber
} from '../../../common/utils/userPermissions';
import Dropdown, { DropdownButton } from '../../../common/Dropdown';

interface Props {
  user: userModel;
  onDeleteClick?: () => any;
  onMove?: () => void;
  onEditUnitNumber?: () => void;
}

const DropdownInspection: FunctionComponent<Props> = ({
  user,
  onDeleteClick,
  onMove,
  onEditUnitNumber
}) => (
  <Dropdown>
    {canEditInspectionUnitNumber(user) ? (
      <DropdownButton
        onClick={onEditUnitNumber}
        testid="dropdown-edit-unit-number"
      >
        Unit #
      </DropdownButton>
    ) : null}
    {canDeleteInspection(user) ? (
      <DropdownButton onClick={onDeleteClick}>Delete</DropdownButton>
    ) : null}
    {canReassignInspectionProperty(user) ? (
      <DropdownButton onClick={onMove}>Move</DropdownButton>
    ) : null}
  </Dropdown>
);

export default DropdownInspection;
