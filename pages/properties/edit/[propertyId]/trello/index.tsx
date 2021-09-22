import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import useProperty from '../../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../../common/MainLayout/index';
import Trello from '../../../../../features/Trello/index';
import LoadingHud from '../../../../../common/LoadingHud';
import useFirestoreUser from '../../../../../common/hooks/useFirestoreUser';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { propertyId } = router.query;
  const { status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const id = typeof propertyId === 'string' ? propertyId : propertyId[0];
  let property = {};
  const { data, status: propertyStatus } = useProperty(firestore, id);

  if (id !== 'new') {
    property = data;
  }

  let isLoaded = false;
  if (propertyStatus === 'success' && userStatus === 'success') {
    isLoaded = true;
  }

  return (
    <MainLayout>
      {isLoaded ? <Trello property={property} /> : <LoadingHud />}
    </MainLayout>
  );
};

export default Page;
