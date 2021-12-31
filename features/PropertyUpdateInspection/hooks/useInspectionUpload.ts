import { useState } from 'react';
import unPublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';

import useSignatureUpload from './useSignatureUpload';
import usePublishUpdates from './usePublishUpdates';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';

type userNotifications = (message: string, options?: any) => any;

interface useInspectionUploadResult {
  isLoading: boolean;
  onInspectionUpload(
    signatures: Map<string, unPublishedSignatureModel[]>,
    unpublishedTemplateUpdates: inspectionTemplateUpdateModel
  ): Promise<boolean>;
}
// hook to upload inspection files and publish inspection
export default function useInspectionUpload(
  inspectionId: string,
  sendNotification: userNotifications,
  changeItemsSignature: (
    itemId: string,
    signatureDownloadURL: string
  ) => Promise<any>,
  removeUnpublishedInspectionItemSignature: (
    signatureItems: Array<inspectionTemplateItemModel>
  ) => Promise<any>
): useInspectionUploadResult {
  const { onSignatureUpload, error } = useSignatureUpload(inspectionId);

  const { updateInspectionTemplate } = usePublishUpdates(sendNotification);

  const [isLoading, setIsLoading] = useState(false);

  // Add signature updates to local unpublised changes
  const saveSignauresUnpublishedUpdates = async (
    signatureItems: Array<inspectionTemplateItemModel>
  ) => {
    const signaturePromise = [];
    signatureItems.forEach((signature: inspectionTemplateItemModel) => {
      signaturePromise.push(
        changeItemsSignature(signature.id, signature.signatureDownloadURL)
      );
    });

    return Promise.all(signaturePromise);
  };

  // Add signature updates to local unpublised changes
  const onInspectionUpload = async (
    signatures: Map<string, unPublishedSignatureModel[]>,
    unpublishedTemplateUpdates: inspectionTemplateUpdateModel
  ) => {
    setIsLoading(true);
    if (signatures.size > 0) {
      const signatureItems = await onSignatureUpload(signatures);
      await saveSignauresUnpublishedUpdates(signatureItems);
      await removeUnpublishedInspectionItemSignature(signatureItems);
    }
    await updateInspectionTemplate(inspectionId, unpublishedTemplateUpdates);
    setIsLoading(false);

    if (error) {
      sendNotification(error, { type: 'error' });
    }
    return true;
  };

  return {
    isLoading,
    onInspectionUpload
  };
}
