import firebase from 'firebase/app';
import moment from 'moment';
import bidsApi from '../../../common/services/firestore/bids';
import bidModel from '../../../common/models/bid';
import attachmentModel from '../../../common/models/attachment';
import { StorageResult } from '../../../common/hooks/useStorage';

const PREFIX = 'features: bidEdit: services: uploadAttachment:';

const updateBidAttachment = async (
  firestore: firebase.firestore.Firestore,
  bid: bidModel,
  file: File,
  storageResult: StorageResult
): Promise<any> => {
  try {
    // Create new document id
    const attachment: attachmentModel = {
      name: file.name,
      type: file.type,
      size: file.size,
      url: storageResult.fileUrl,
      storageRef: storageResult.fileDestination,
      createdAt: moment().unix()
    };
    // Add attachment record to the firestore
    await bidsApi.addBidAttachment(firestore, bid.id, attachment);
  } catch (err) {
    throw Error(
      `${PREFIX} updateBidAttachment: failed to update bid attachments: ${err}`
    );
  }
};

export default { updateBidAttachment };
