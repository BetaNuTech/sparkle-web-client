import { useCallback, useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import DeficientItemLocalPhotos from '../../../common/models/deficientItems/unpublishedPhotos';
import deficientItemPhotos from '../../../common/services/indexedDB/deficientItemPhotos';

const PREFIX =
  'features: DeficientItemEdit: hooks: useUnpublishedDeficiencyPhotos:';

interface result {
  addUnpublishedDeficiencyPhoto(
    file: string,
    size: number,
    itemId: string,
    inspectionId: string,
    propertyId: string,
    startDate: number
  ): void;
  reloadPhotos(): void;
  removedUnpubilshedDeficiencyPhoto(unpublishedPhotoId: string): void;
  unpublishedDeficiencyPhotos: DeficientItemLocalPhotos[];
  addUnpublishedDeficiencyPhotoCaption(
    unpublishedPhotoId: string,
    captionText: string
  ): void;
  clearUnpubilshedDeficiencyPhotos(): void;
  isLoading: boolean;
}

type userNotifications = (message: string, options?: any) => any;

// Hook for add, update, delete
// and get deficiency unpublished photos
export default function useUnpublishedDeficiencyPhotos(
  sendNotification: userNotifications,

  deficiencyId: string
): result {
  const [unpublishedDeficiencyPhotos, setUnpublishedDeficiencyPhotos] =
    useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleErrorResponse = (err) => {
    sendNotification(
      'Unexpected error. Please try again, or contact an admin.',
      {
        type: 'error'
      }
    );
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${err}`);
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  // Add a list of unpublished photos
  // to an deficiency
  const addUnpublishedDeficiencyPhoto = async (
    file: string,
    size: number,
    itemId: string,
    inspectionId: string,
    propertyId: string,
    startDate: number
  ): Promise<DeficientItemLocalPhotos[]> => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemPhotos.createRecord(
        file,
        size,
        itemId,
        inspectionId,
        propertyId,
        deficiencyId,
        startDate
      );
      return getUnpublishedDeficiencyPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Lookup any unpublished photos
  // for a deficiency
  const getUnpublishedDeficiencyPhotos = useCallback(async (): Promise<
    DeficientItemLocalPhotos[]
  > => {
    let inspectionPhotos = [];

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      inspectionPhotos = await deficientItemPhotos.query(deficiencyId);
    } catch (err) {
      handleErrorResponse(err);
    }

    // Set deficiency unpublished photos
    setUnpublishedDeficiencyPhotos(inspectionPhotos);

    return inspectionPhotos;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deficiencyId]);

  // load unpublished photos
  // and also set loading state
  const loadUnpublishedDeficiencyPhotos = async () => {
    setIsLoading(true);
    await getUnpublishedDeficiencyPhotos();
    setIsLoading(false);
  };

  const addUnpublishedDeficiencyPhotoCaption = async (
    unpublishedPhotoId: string,
    captionText: string
  ): Promise<DeficientItemLocalPhotos[]> => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemPhotos.updateRecord(unpublishedPhotoId, {
        caption: captionText
      });
      return getUnpublishedDeficiencyPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const removedUnpubilshedDeficiencyPhoto = async (
    unpublishedPhotoId: string
  ): Promise<DeficientItemLocalPhotos[]> => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemPhotos.deleteRecord(unpublishedPhotoId);
      return getUnpublishedDeficiencyPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const clearUnpubilshedDeficiencyPhotos = async () => {
    const recordIds = [...unpublishedDeficiencyPhotos].map((photo) => photo.id);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemPhotos.deleteMultipleRecords(recordIds);
      return getUnpublishedDeficiencyPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Request all photos on load
  useEffect(() => {
    loadUnpublishedDeficiencyPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deficiencyId]);

  return {
    addUnpublishedDeficiencyPhoto,
    reloadPhotos: getUnpublishedDeficiencyPhotos,
    removedUnpubilshedDeficiencyPhoto,
    unpublishedDeficiencyPhotos,
    addUnpublishedDeficiencyPhotoCaption,
    clearUnpubilshedDeficiencyPhotos,
    isLoading
  };
}
