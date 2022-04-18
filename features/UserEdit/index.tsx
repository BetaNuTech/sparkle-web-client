import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import LoadingHud from '../../common/LoadingHud';
import PropertyModel from '../../common/models/property';
import TeamModel from '../../common/models/team';
import UserModel from '../../common/models/user';
import { canEditUserRoles } from '../../common/utils/userPermissions';
import breakpoints from '../../config/breakpoints';
import UserEditForm from './Form';
import Header from './Header';
import useUserDelete from './hooks/useUserDelete';
import useUserEdit from './hooks/useUserEdit';
import PropertiesModal from './PropertiesModal';
import TeamModal from './TeamModal';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  user: UserModel;
  target: UserModel;
  properties: PropertyModel[];
  teams: TeamModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  sendNotification: userNotifications;
}

const UserEdit: FunctionComponent<Props> = ({
  target,
  isOnline,
  isStaging,
  teams,
  sendNotification,
  properties,
  user,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const [isVisibleTeamModal, setIsVisibleTeamModal] = useState(false);
  const [isVisiblePropertiesModal, setIsVisiblePropertiesModal] =
    useState(false);

  const {
    register,
    formState,
    isCreatingUser,
    isDisabled,
    onSubmit,
    onSelectTeam,
    selectedTeams,
    isLoading,
    onSelectProperty,
    selectedProperties
  } = useUserEdit(target, sendNotification);

  const canEditRole = canEditUserRoles(user);

  const showUserRoleFields = !isCreatingUser && canEditRole;

  const { onDelete, isDeleting } = useUserDelete(target, sendNotification);

  const isCurrentUser = user.id === target.id;

  if (isDeleting) {
    return <LoadingHud />;
  }
  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isCreatingUser={isCreatingUser}
        user={target}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        isLoading={isLoading}
        canEditRole={canEditRole}
        toggleNavOpen={toggleNavOpen}
      />
      <div>
        <UserEditForm
          user={target}
          formState={formState}
          register={register}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          isCreatingUser={isCreatingUser}
          onTeamsClick={() => setIsVisibleTeamModal(true)}
          onPropertiesClick={() => setIsVisiblePropertiesModal(true)}
          selectedTeams={selectedTeams}
          isLoading={isLoading}
          selectedProperties={selectedProperties}
          showUserRoleFields={showUserRoleFields}
          isCurrentUser={isCurrentUser}
          onDelete={onDelete}
          canEditRole={canEditRole}
        />
      </div>
      <TeamModal
        isVisible={isVisibleTeamModal}
        teams={teams}
        onClose={() => setIsVisibleTeamModal(false)}
        onSelect={onSelectTeam}
        selectedTeams={selectedTeams}
      />
      <PropertiesModal
        isVisible={isVisiblePropertiesModal}
        properties={properties}
        onClose={() => setIsVisiblePropertiesModal(false)}
        onSelect={onSelectProperty}
        selectedProperties={selectedProperties}
      />
    </>
  );
};

export default UserEdit;
