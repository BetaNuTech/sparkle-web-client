import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';
import teamModel from '../../../common/models/team';
import features from '../../../config/features';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  team: teamModel;
  onDelete(): void;
}

const DropdownTeam: FunctionComponent<Props> = ({ team, onDelete }) => (
  <Dropdown>
    <DropdownLink
      href={`/teams/${team.id}/edit`}
      featureEnabled={features.supportBetaTeamCreate}
      testid="dropdown-add-team"
    >
      Edit
    </DropdownLink>
    <DropdownButton onClick={onDelete}>Delete</DropdownButton>
  </Dropdown>
);

export default DropdownTeam;
