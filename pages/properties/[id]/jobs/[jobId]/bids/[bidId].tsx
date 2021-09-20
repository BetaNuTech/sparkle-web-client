import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import useProperty from '../../../../../../common/hooks/useProperty';
import useJob from '../../../../../../common/hooks/useJob';
import useJobBids from '../../../../../../common/hooks/useJobBids';
import useNotifications from '../../../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../../../common/services/notifications';
import bidModel from '../../../../../../common/models/bid';
import { MainLayout } from '../../../../../../common/MainLayout';
import { canAccessBids } from '../../../../../../common/utils/userPermissions';
import BidEdit from '../../../../../../features/BidEdit';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';
import LoadingHud from '../../../../../../common/LoadingHud';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');

  // Munge required record ID's
  let { bidId, jobId, id: propertyId } = router.query;
  propertyId = typeof propertyId === 'string' ? propertyId : propertyId[0];
  jobId = typeof jobId === 'string' ? jobId : jobId[0];
  bidId = typeof bidId === 'string' ? bidId : bidId[0];

  // Redirect paths
  const jobListUrl = `/properties/${propertyId}/jobs`;
  const bidListUrl = `/properties/${propertyId}/jobs/${jobId}/bids`;

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  // Redirect user without permission to
  // jobs list for this property
  if (user && propertyId && !canAccessBids(user, propertyId)) {
    Router.push(jobListUrl);
  }

  // Fetch bid's property
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch bid's Job
  const { data: job } = useJob(firestore, jobId);

  // Fetch the data of bid
  const { data: bids, status: bidApiStatus } = useJobBids(firestore, jobId);
  const bid = (bids.filter((b) => b.id === bidId)[0] || {}) as bidModel;
  const otherBids = bids.filter((b) => b.id !== bidId); // Job's other bids
  const isNewBid = bidId === 'new';

  // We are checking that when we have success from bids api
  // then if we have bid then means we have bid otherwise it is error
  const bidStatus =
    // eslint-disable-next-line no-nested-ternary
    bidApiStatus === 'success'
      ? Object.keys(bid).length > 0
        ? 'success'
        : 'error'
      : 'loading';

  // Redirect user requesting open job
  if (job && job.state === 'open') {
    sendNotification('A job must first be approved before adding any bids', {
      type: 'error'
    });
    Router.push(bidListUrl);
  }

  // Redirect user requesting non-existent job
  if (bidId !== 'new' && bidStatus === 'error') {
    sendNotification('Bid could not be found', { type: 'error' });
    Router.push(bidListUrl);
  }

  let isLoaded = false;
  if (user && property && job && bidApiStatus === 'success') {
    isLoaded = true;
  }

  return (
    <MainLayout>
      {isLoaded ? (
        <BidEdit
          isNewBid={isNewBid}
          property={property}
          job={job}
          bid={bid}
          otherBids={otherBids}
        />
      ) : (
        <LoadingHud title="Loading Bid" />
      )}
    </MainLayout>
  );
};

export default Page;
