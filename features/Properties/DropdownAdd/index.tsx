import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownButton,
  DropdownLink
} from '../../../common/Dropdown';
import features from '../../../config/features';

interface Props {
  canAddTeam: boolean;
  canAddProperty: boolean;
  onAddTeam(): void;
}

const DropdownAdd: FunctionComponent<Props> = ({
  canAddTeam,
  canAddProperty,
  onAddTeam
}) => (
  <Dropdown>
    {canAddTeam && (
      <DropdownButton
        href="/teams/edit/new"
        featureEnabled={features.supportTeamCreate}
        testid="dropdown-add-team"
        onClick={onAddTeam}
      >
        Add Team
      </DropdownButton>
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
