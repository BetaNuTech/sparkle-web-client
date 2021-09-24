import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import attachmentModel from '../../models/attachment';
import jobModel from '../../models/job';

const PREFIX = 'services: api: firestore: jobs';

// Result of jobs collection query
export interface jobCollectionResult {
  status: string;
  error?: Error;
  data: Array<jobModel>;
}

// Result of jobs document
export interface jobResult {
  status: string;
  error?: Error;
  data: jobModel;
}

export default {
  // Lookup property jobs by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): jobCollectionResult {
    let status = 'success';
    let error = null;
    let data = null;

    const propertyDocRef = firebase
      .firestore()
      .collection('properties')
      .doc(propertyId);

    const query = firestore
      .collection(fbCollections.jobs)
      .where('property', '==', propertyDocRef);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into job model records
    data = queryData.map((itemData: any) => itemData as jobModel);

    // Result
    return { status, error, data };
  },

  // Lookup job by it's id
  findRecord(firestore: firebase.firestore.Firestore, id: string): jobResult {
    let status = 'success';
    let error = null;
    let data = {} as jobModel;

    const docRef = firestore.collection(fbCollections.jobs).doc(id);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into property records
    data = queryData as jobModel;

    // Result
    return { status, error, data };
  },
  // Update attachment record reference to job document
  updateAttachmentRef(
    firestore: firebase.firestore.Firestore,
    jobId: string,
    attachmentId: string
  ): Promise<string> {
    // Update attachment record to firestore
    return firestore
      .collection(fbCollections.jobs)
      .doc(jobId)
      .update({
        scopeOfWorkAttachment: attachmentId
          ? firestore.collection(fbCollections.attachments).doc(attachmentId)
          : null
      })
      .then(() => jobId)
      .catch((err) => {
        const wrappedErr = Error(
          `${PREFIX} updateAttachmentRef: failed to update scope of work attachment: ${err}`
        );

        return Promise.reject(wrappedErr);
      });
  },
  // Add attachment record to job document
  addSOWAttachment(
    firestore: firebase.firestore.Firestore,
    id: string,
    attachment: attachmentModel
  ): Promise<attachmentModel> {
    // Update attachment record to firestore
    return firestore
      .collection(fbCollections.jobs)
      .doc(id)
      .update({
        scopeOfWorkAttachments:
          firebase.firestore.FieldValue.arrayUnion(attachment)
      })
      .then(() => attachment)
      .catch((err) => {
        const wrappedErr = Error(
          `${PREFIX} addSOWAttachments: failed to add SOW attachments: ${err}`
        );

        return Promise.reject(wrappedErr);
      });
  },
  // Remove attachment record by attachment document id
  removeSOWAttachment(
    firestore: firebase.firestore.Firestore,
    id: string,
    attachment: attachmentModel
  ): Promise<attachmentModel> {
    // Update attachment record to firestore
    return firestore
      .collection(fbCollections.jobs)
      .doc(id)
      .update({
        scopeOfWorkAttachments:
          firebase.firestore.FieldValue.arrayRemove(attachment)
      })
      .then(() => attachment)
      .catch((err) => {
        const wrappedErr = Error(
          `${PREFIX} removeSOWAttachment: failed to delete index from SOW attachment: ${err}`
        );

        return Promise.reject(wrappedErr);
      });
  }
};
