import { FunctionComponent } from 'react';
import Dropdown, { DropdownLink } from '../../../common/Dropdown';
import features from '../../../config/features';

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
      <DropdownLink
        href="/teams/edit/new"
        featureEnabled={features.supportTeamCreate}
        testid="dropdown-add-team"
      >
        Add Team
      </DropdownLink>
    )}
    {canAddProperty && (
      <DropdownLink
        href={
          features.supportPropertyCreate
            ? '/properties/edit/new'
            : '/properties/update/new'
        }
        featureEnabled={features.supportPropertyCreate}
        testid="dropdown-add-property"
      >
        Add Property
      </DropdownLink>
    )}
  </Dropdown>
);

export default DropdownAdd;
