import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import getConfig from 'next/config';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import userModel from '../../common/models/user';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import useBid from './hooks/useBid';
import useBidForm from './hooks/useBidForm';
import useBidStatus from './hooks/useBidStatus';
import BidForm from './Form';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  bidId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const BidEdit: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  bidId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';
  const firestore = useFirestore();
  const isNewBid = bidId === 'new';

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);
  // Fetch the data of job
  const { data: job } = useJob(firestore, jobId);
  // Fetch the data of bid
  const { data: bid, status: bidStatus } = useBid(firestore, bidId);

  const { apiState, postBidCreate, putBidUpdate } = useBidForm(bid);
  // Show job error status
  useBidStatus(apiState, bidId, jobId, propertyId, sendNotification);
  // Loading State
  if (!property || !job || (bidId !== 'new' && !bid)) {
    return <LoadingHud title="Loading Bid" />;
  }

  // Redirect user requesting non-existent job
  if (bidId !== 'new' && bidStatus === 'error') {
    sendNotification('Bid could not be found', { type: 'error' });
    Router.push(`${basePath}/properties/${propertyId}/jobs/${bidId}/bids`);
  }

  return (
    <BidForm
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={job}
      bid={bid}
      isNewBid={isNewBid}
      apiState={apiState}
      postBidCreate={postBidCreate}
      putBidUpdate={putBidUpdate}
    />
  );
};

BidEdit.defaultProps = {};

export default BidEdit;
