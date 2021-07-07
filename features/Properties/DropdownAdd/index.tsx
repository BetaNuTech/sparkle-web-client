import { FunctionComponent } from 'react';
import Dropdown, { DropdownLink } from '../../../common/Dropdown';

interface Props {
  canAddTeam: boolean;
  canAddProperty: boolean;
}

const DropdownAdd: FunctionComponent<Props> = ({
  canAddTeam,
  canAddProperty
}) => (
  <Dropdown>
    {canAddTeam && (
      <DropdownLink href="/teams/create/" testid="dropdown-add-team">
        Add Team
      </DropdownLink>
    )}
    {canAddProperty && (
      <DropdownLink href="/properties/update/" testid="dropdown-add-property">
        Add Property
      </DropdownLink>
    )}
  </Dropdown>
);

export default DropdownAdd;
