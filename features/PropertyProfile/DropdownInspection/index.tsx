import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import {
  canDeleteInspection,
  canReassignInspectionProperty
} from '../../../common/utils/userPermissions';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  user: userModel;
  onDeleteClick?: () => any;
}

const DropdownInspection: FunctionComponent<Props> = ({
  user,
  onDeleteClick
}) => (
  <Dropdown>
    {canDeleteInspection(user) ? (
      <DropdownButton onClick={onDeleteClick}>Delete</DropdownButton>
    ) : null}
    {canReassignInspectionProperty(user) ? (
      <DropdownLink href="/properties/update/">Move</DropdownLink>
    ) : null}
  </Dropdown>
);

export default DropdownInspection;
