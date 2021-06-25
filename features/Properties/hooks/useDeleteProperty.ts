import { useState } from 'react';
import propertiesApi from '../../../common/services/firestore/properties';
import propertyModel from '../../../common/models/property';
import errorReports from '../../../common/services/api/errorReports';

const PREFIX = 'features: properties: hooks: useDeleteProperty:';
interface Returned {
  queuedPropertyForDeletion: propertyModel | null;
  queuePropertyForDelete: (property: propertyModel) => any;
  confirmPropertyDelete: () => Promise<any>;
}
type userNotifications = (message: string, options?: any) => any;

// Query property to delete
// and send delete confirmation
/* eslint-disable */
const useDeleteProperty = (
  firestore: any,
  sendNotification: userNotifications
): Returned => {
  /* eslint-enable */
  const [queuedPropertyForDeletion, setQueueDeleteProperty] = useState(null);

  // Set/unset the property
  // queued to be deleted
  const queuePropertyForDelete = (property: null | propertyModel) => {
    setQueueDeleteProperty(property);
  };

  // Request to delete the queued property
  const confirmPropertyDelete = async (): Promise<any> => {
    try {
      await propertiesApi.deleteRecord(firestore, queuedPropertyForDeletion.id);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(`${PREFIX} confirmPropertyDelete: ${err}`);
      sendNotification(
        `Failed to delete property: ${
          queuedPropertyForDeletion ? queuedPropertyForDeletion.name : 'Unknown'
        }`,
        { appearance: 'error' }
      );
      errorReports.send(wrappedErr); // eslint-disable-line
      return wrappedErr;
    }

    // Send success
    sendNotification('Property deleted successfully.', {
      appearance: 'success'
    });
  };

  return {
    queuedPropertyForDeletion,
    queuePropertyForDelete,
    confirmPropertyDelete
  };
};

export default useDeleteProperty;
