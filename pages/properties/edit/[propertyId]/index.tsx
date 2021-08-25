import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import useProperty from '../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../common/MainLayout/index';
import PropertyEdit from '../../../../features/PropertyEdit/index';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';

interface Props {
  isOnline: boolean;
  toggleNavOpen?(): void;
  isStaging: boolean;
}

const Page: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { propertyId } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const id = typeof propertyId === 'string' ? propertyId : propertyId[0];
  let property = {};
  const { data } = useProperty(firestore, id);
  if (id !== 'new') {
    property = data;
  }

  return (
    <>
      <MainLayout>
        {user && (
          <PropertyEdit
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            user={user}
            id={id}
            property={property}
          />
        )}
      </MainLayout>
    </>
  );
};

export default Page;
