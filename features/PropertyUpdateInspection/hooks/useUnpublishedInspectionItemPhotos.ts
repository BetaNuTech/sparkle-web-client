import { useCallback, useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import inspectionItemPhotosData from '../../../common/services/indexedDB/inspectionItemPhotosData';
import utilArray from '../../../common/utils/array';

const PREFIX =
  'features: PropertyUpdateInspection: hooks: useUnpublishedInspectionItemPhotos:';

interface result {
  addUnpublishedInspectionItemPhoto(
    file: string,
    size: number,
    itemId: string,
    propertyId: string
  ): void;
  reloadPhotos(): void;
  removeUnpublishedInspectionItemPhoto(unpublishedPhotoId: string): void;
  unpublishedInspectionItemsPhotos: Map<string, unPublishedPhotoDataModel[]>;
  unpublishedSelectedInspectionItemsPhotos: unPublishedPhotoDataModel[];
  addUnpublishedInspectionPhotoCaption(
    unpublishedPhotoId: string,
    captionText: string
  ): void;
}

type userNotifications = (message: string, options?: any) => any;

// Hooks for filtering inspection items photo data
export default function useInspectionItemPhotos(
  sendNotification: userNotifications,
  selectedInspectionItem: inspectionTemplateItemModel,
  inspectionId: string
): result {
  const [
    unpublishedInspectionItemsPhotos,
    setUnpublishedInspectionItemsPhotos
  ] = useState(new Map());
  const [
    unpublishedSelectedInspectionItemsPhotos,
    setUnpublishedSelectedInspectionItemsPhotos
  ] = useState([]);

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
  // to an inspection item
  const addUnpublishedInspectionItemPhoto = async (
    file: string,
    size: number,
    itemId: string,
    propertyId: string
  ) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionItemPhotosData.createRecord(
        file,
        size,
        itemId,
        inspectionId,
        propertyId
      );
      return getUnpublishedInspectionPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Lookup any unpublished photos
  // for an entire inspections items
  const getUnpublishedInspectionPhotos = useCallback(async () => {
    let inspectionPhotos = [];

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      inspectionPhotos = await inspectionItemPhotosData.queryInspectionRecords(
        inspectionId
      );
    } catch (err) {
      handleErrorResponse(err);
    }

    // Grouping of section by section id
    const photos = utilArray.groupBy<string, unPublishedPhotoDataModel>(
      inspectionPhotos,
      (item) => item.item
    );

    // Set all items' unpublished photos
    setUnpublishedInspectionItemsPhotos(photos);

    // Set selected inspection item's unpublished photos
    setUnpublishedSelectedInspectionItemsPhotos(
      (selectedInspectionItem && photos.get(selectedInspectionItem.id)) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInspectionItem]);

  const addUnpublishedInspectionPhotoCaption = async (
    unpublishedPhotoId: string,
    captionText: string
  ) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionItemPhotosData.updateRecord(unpublishedPhotoId, {
        caption: captionText
      });
      getUnpublishedInspectionPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };
  const removeUnpublishedInspectionItemPhoto = async (
    unpublishedPhotoId: string
  ) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionItemPhotosData.deleteRecord(unpublishedPhotoId);
      return getUnpublishedInspectionPhotos();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Request all photos on load
  // and when selected item changes
  useEffect(() => {
    getUnpublishedInspectionPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId, selectedInspectionItem]);

  return {
    addUnpublishedInspectionItemPhoto,
    reloadPhotos: getUnpublishedInspectionPhotos,
    removeUnpublishedInspectionItemPhoto,
    unpublishedInspectionItemsPhotos,
    unpublishedSelectedInspectionItemsPhotos,
    addUnpublishedInspectionPhotoCaption
  };
}
