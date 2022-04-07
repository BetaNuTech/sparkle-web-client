import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import PropertyModel from '../../common/models/property';
import TeamModel from '../../common/models/team';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import UserEditForm from './Form';
import Header from './Header';
import useUserEdit from './hooks/useUserEdit';

interface Props {
  user: UserModel;
  target: UserModel;
  properties: PropertyModel[];
  teams: TeamModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const UserEdit: FunctionComponent<Props> = ({
  target,
  isOnline,
  isStaging
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const { register, formState, isCreatingUser, isDisabled, onSubmit } =
    useUserEdit(target);

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
      />
      <div>
        <UserEditForm
          user={target}
          formState={formState}
          register={register}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          isCreatingUser={isCreatingUser}
        />
      </div>
    </>
  );
};

export default UserEdit;
