import { FunctionComponent, useState } from 'react';
import MobileHeader from '../../common/MobileHeader';
import TeamForm from './form';
import teamModel from '../../common/models/team';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  team: teamModel;
}

const TeamEdit: FunctionComponent<Props> = ({ isOnline, isStaging, team }) => {
  const [teamName, setTeamName] = useState<string>(team && team.name);

  const handleChange = (formData) => {
    setTeamName(formData);
  };

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        title="Team"
        data-testid="teams-header"
      />
      <TeamForm teamName={teamName} handleChange={handleChange} />
    </>
  );
};

export default TeamEdit;
