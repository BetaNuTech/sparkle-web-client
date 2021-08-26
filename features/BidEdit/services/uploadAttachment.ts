import firebase from 'firebase/app';
import moment from 'moment';
import bidsApi from '../../../common/services/firestore/bids';
import utilApi from '../../../common/services/firestore/util';
import bidModel from '../../../common/models/bid';
import bidAttachmentModel from '../../../common/models/bidAttachment';
import { StorageResult } from '../../../common/hooks/useStorage';
import collections from '../../../config/collections';

const PREFIX = 'features: bidEdit: services: uploadAttachment:';

const updateBidAttachment = async (
  firestore: firebase.firestore.Firestore,
  bid: bidModel,
  file: File,
  storageResult: StorageResult
): Promise<any> => {
  try {
    // Create new document id
    const docId = utilApi.createId(firestore, collections.bids);
    const attachment: bidAttachmentModel = {
      id: docId,
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
