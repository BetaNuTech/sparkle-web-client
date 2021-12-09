import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import propertyModel from '../../common/models/property';
import userModel from '../../common/models/user';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import attachmentModel from '../../common/models/attachment';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications';
import useBidApprovedCompleted from '../../common/hooks/useBidApprovedCompleted';

import { canApproveBid } from '../../common/utils/userPermissions';
import useBidForm from './hooks/useBidForm';
import useDeleteAttachment from './hooks/useDeleteAttachment';
import useUploadAttachment from './hooks/useUploadAttachment';
import BidForm from './Form';
import DeleteAttachmentPrompt from './DeleteAttachmentPrompt';

interface Props {
  isNewBid: boolean;
  user: userModel;
  property: propertyModel;
  job: jobModel;
  bid: bidModel;
  otherBids: Array<bidModel>;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const BidEdit: FunctionComponent<Props> = ({
  user,
  isNewBid,
  property,
  job,
  otherBids,
  bid,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const bidId = bid.id;
  const propertyId = property.id;
  const jobId = job.id;

  const fireStore = useFirestore();

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  // Get current bid from bids array
  const { isLoading, onPublish, formFieldsError, generalFormErrors } =
    useBidForm(bid, sendNotification);
  const { isUploading, onUploadFile } = useUploadAttachment(
    fireStore,
    bid,
    sendNotification
  );
  const [isDeleteAttachmentPromptVisible, setDeleteAttachmentPromptVisible] =
    useState(false);

  const {
    queueAttachmentForDelete,
    queuedAttachmentForDeletion,
    onConfirmAttachmentDelete,
    isDeleting
  } = useDeleteAttachment(fireStore, sendNotification);

  const onFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onUploadFile(ev, bidId, propertyId, jobId);
  };

  const openAttachmentDeletePrompt = (attachment: attachmentModel) => {
    queueAttachmentForDelete(attachment);
    setDeleteAttachmentPromptVisible(true);
  };

  const closeAttachmentDeletePrompt = () => {
    setDeleteAttachmentPromptVisible(false);
    queueAttachmentForDelete(null);
  };

  // Should not be able to mark complete if the job is not in authroized state
  const canMarkComplete =
    !isNewBid && bid.state === 'approved' && job.state === 'authorized';
  const canReopen = !isNewBid && ['rejected', 'incomplete'].includes(bid.state);
  const canReject = !isNewBid && bid.state === 'approved';
  const canMarkIncomplete = !isNewBid && bid.state === 'approved';
  const canApprove = canApproveBid(isNewBid, user, property.id, job, bid);

  const { approvedCompletedBid } = useBidApprovedCompleted(otherBids);

  const isApprovedOrComplete =
    !isNewBid && ['approved', 'complete'].includes(bid.state);

  const isBidComplete = !isNewBid && bid.state === 'complete';

  return (
    <>
      <BidForm
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        toggleNavOpen={toggleNavOpen}
        job={job}
        bid={bid}
        otherBids={otherBids}
        isNewBid={isNewBid}
        formFieldsError={formFieldsError}
        generalFormErrors={generalFormErrors}
        isLoading={isLoading}
        onPublish={onPublish}
        onFileChange={onFileChange}
        uploadState={isUploading}
        deleteAtachmentLoading={isDeleting}
        canMarkComplete={canMarkComplete}
        canReopen={canReopen}
        canReject={canReject}
        canMarkIncomplete={canMarkIncomplete}
        approvedCompletedBid={approvedCompletedBid}
        isApprovedOrComplete={isApprovedOrComplete}
        isBidComplete={isBidComplete}
        canApprove={canApprove}
        openAttachmentDeletePrompt={openAttachmentDeletePrompt}
      />
      <DeleteAttachmentPrompt
        fileName={
          queuedAttachmentForDeletion && queuedAttachmentForDeletion.name
        }
        onConfirm={() =>
          onConfirmAttachmentDelete(bid.id, queuedAttachmentForDeletion)
        }
        isVisible={isDeleteAttachmentPromptVisible}
        onClose={closeAttachmentDeletePrompt}
      />
    </>
  );
};

BidEdit.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default BidEdit;
