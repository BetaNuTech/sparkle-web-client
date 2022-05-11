import 'firebase/firestore';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import Properties from '../../features/Properties';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import useProperties from '../../features/Properties/hooks/useProperties';
import useTeams from '../../features/Properties/hooks/useTeams';
import LoadingHud from '../../common/LoadingHud';

export default function PropertiesPage() {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );

  const loadedUser = userStatus === 'success' && user;

  const {
    data: properties,
    memo: propertiesMemo,
    status: propertyStatus
  } = useProperties(firestore, loadedUser);

  const {
    status: teamsStatus,
    data: teams,
    memo: teamsMemo
  } = useTeams(firestore, loadedUser);
  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    teamsStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <Properties
          user={user}
          properties={properties}
          propertiesMemo={propertiesMemo}
          teams={teams}
          teamsMemo={teamsMemo}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
}
