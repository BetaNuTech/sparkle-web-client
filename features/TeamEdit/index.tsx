import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import MobileHeader from '../../common/MobileHeader';
import breakpoints from '../../config/breakpoints';
import TeamForm from './Form';
import teamModel from '../../common/models/team';
import useTeamForm from './hooks/useTeamForm';
import LoadingHud from '../../common/LoadingHud';
import styles from './styles.module.scss';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  team: teamModel;
}

const TeamEdit: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  team
}) => {
  const [teamName, setTeamName] = useState<string>(team && team.name);

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */
  const { onSubmit, error, isLoading } = useTeamForm(sendNotification);

  // Enable send button
  const sendEnabled = teamName !== team.name && Boolean(teamName);

  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const handleChange = (formData) => {
    setTeamName(formData);
  };
  const handleSubmission = (evt) => {
    evt.preventDefault();
    onSubmit(teamName, team.id);
  };

  const headerActions = () => (
    <>
      <button
        data-testid="save-button"
        className={styles.teamEdit__sendButton}
        disabled={!sendEnabled}
        onClick={(evt) => handleSubmission(evt)}
      >
        Send
      </button>
    </>
  );

  return (
    <>
      {isLoading && <LoadingHud title="Saving..." />}
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        toggleNavOpen={isMobileorTablet ? toggleNavOpen : undefined}
        actions={headerActions}
        title="Team"
        data-testid="teams-header"
      />
      <TeamForm teamName={teamName} error={error} handleChange={handleChange} />
    </>
  );
};

export default TeamEdit;
