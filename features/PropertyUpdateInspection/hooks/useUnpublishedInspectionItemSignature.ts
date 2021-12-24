import { useCallback, useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import unPublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import inspectionSignature from '../../../common/services/indexedDB/inspectionSignature';
import inspectionTemplateItemModal from '../../../common/models/inspectionTemplateItem';
import utilArray from '../../../common/utils/array';

const PREFIX =
  'features: PropertyUpdateInspection: hooks: useUnpublishedInspectionItemPhotos:';

interface result {
  saveUnpublishedInspectionSignature(file: string, itemId: string): void;
  getUnpublishedInspectionSignature(): void;
  unpublishedInspectionItemsSignature: Map<string, unPublishedSignatureModel[]>;
  unpublishedSelectedInspectionItemsSignature: unPublishedSignatureModel[];
}

type userNotifications = (message: string, options?: any) => any;

// Hooks for save and get unpublished signature
export default function useUnpublishedInspectionSignature(
  sendNotification: userNotifications,
  selectedInspectionItem: inspectionTemplateItemModal,
  inspectionId: string
): result {
  const [
    unpublishedInspectionItemsSignature,
    setUnpublishedInspectionItemsSignature
  ] = useState(new Map());
  const [
    unpublishedSelectedInspectionItemsSignature,
    setUnpublishedSelectedInspectionItemsSignature
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

  // request inspection signature service to add signature in indexedDB
  const addSignature = async (file: string, itemId: string) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const signatureId = await inspectionSignature.createRecord(
        file,
        itemId,
        inspectionId
      );
      await getUnpublishedInspectionSignature();
      return signatureId;
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // request inspection signature service to update signature in indexedDB
  const updateSignature = async (file: string) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const signatureId = await inspectionSignature.updateRecord(
        unpublishedSelectedInspectionItemsSignature[0].id,
        { signature: file }
      );
      await getUnpublishedInspectionSignature();
      return signatureId;
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Save signature data
  const saveUnpublishedInspectionSignature = async (
    file: string,
    itemId: string
  ) => {
    // if user have unpublished signature than update existing signature
    if (unpublishedSelectedInspectionItemsSignature.length > 0) {
      updateSignature(file);
    } else {
      return addSignature(file, itemId);
    }
  };

  // Lookup any unpublished signature
  // for an entire inspections items
  const getUnpublishedInspectionSignature = useCallback(async () => {
    let inspectionSignatures = [];

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      inspectionSignatures = await inspectionSignature.queryRecords(
        inspectionId
      );
    } catch (err) {
      handleErrorResponse(err);
    }

    // Grouping of signatures by itemId
    const signatures = utilArray.groupBy<string, unPublishedSignatureModel>(
      inspectionSignatures,
      (item) => item.item
    );

    // Set all inspection item's unpublished signature
    setUnpublishedInspectionItemsSignature(signatures);

    // Set selected inspection item's unpublished signature
    setUnpublishedSelectedInspectionItemsSignature(
      (selectedInspectionItem && signatures.get(selectedInspectionItem.id)) ||
        []
    );

    return signatures;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId, selectedInspectionItem]);

  // Request all signatures on load
  // and when selected item changes
  useEffect(() => {
    getUnpublishedInspectionSignature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId, selectedInspectionItem]);

  return {
    saveUnpublishedInspectionSignature,
    getUnpublishedInspectionSignature,
    unpublishedInspectionItemsSignature,
    unpublishedSelectedInspectionItemsSignature
  };
}
