import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import signatureDb from '../../../common/services/indexedDB/inspectionSignature';
import inspUtil from '../../../common/utils/inspection';
import { StorageResult } from '../../../common/hooks/useStorage';

const PREFIX = 'features: PropertyUpdateInspection: utils: publishSignatures:';

// Result for each step of publish process
export type SignaturePublishStep = {
  successful: unpublishedSignatureModel[];
  errors: Error[];
};

// Factory for uploading signatures
// to Firebase Storage for inspection
const createInspectionUploader =
  (
    inspectionId: string,
    uploadBase64FileToStorage: (
      dest: string,
      dataUrl: string
    ) => Promise<StorageResult>
  ) =>
  (signature: unpublishedSignatureModel): Promise<StorageResult> => {
    const fileName = `${signature.createdAt}.png`;

    // Upload file to the firebase storage
    return uploadBase64FileToStorage(
      `inspectionItemImages/${inspectionId}/${signature.item}/${fileName}`,
      signature.signature
    );
  };

export default {
  // Upload all unpublished signatures
  // resolving successful sigantures and errors
  upload: async (
    inspectionId: string,
    unpublishedSignatures: unpublishedSignatureModel[],
    uploadBase64FileToStorage: (
      dest: string,
      dataUrl: string
    ) => Promise<StorageResult>
  ): Promise<SignaturePublishStep> => {
    const result = {
      successful: [],
      errors: []
    };

    // Create upload function
    const uploadSignature = createInspectionUploader(
      inspectionId,
      uploadBase64FileToStorage
    );

    // Create all upload requests
    const uploads = unpublishedSignatures.map(
      (signature: unpublishedSignatureModel) =>
        new Promise((resolve) => {
          uploadSignature(signature)
            .then((file) => {
              signature.signatureDownloadURL = `${file.fileUrl}`;
              resolve(signature);
            })
            .catch((err) => {
              resolve(
                Error(
                  // eslint-disable-next-line max-len
                  `${PREFIX} upload: failed to upload signature for inspection "${inspectionId}" item "${signature.item}": ${err}`
                )
              );
            });
        })
    );

    // Wait for all upload results
    const results = await Promise.all(uploads);

    // Sort results into those
    // successfully published and errors
    results.forEach((item) => {
      if (item instanceof Error) {
        result.errors.push(item);
      } else {
        result.successful.push(item);
      }
    });

    return result;
  },

  // Remove local signatures
  // that have been published
  removePublished: async (
    publishedSignatures: unpublishedSignatureModel[]
  ): Promise<SignaturePublishStep> => {
    const result = {
      successful: [],
      errors: []
    };

    const removals = publishedSignatures.map(
      (signature: unpublishedSignatureModel) =>
        new Promise((resolve) =>
          // eslint-disable-next-line
          signatureDb
            .deleteMultipleRecords([signature.id])
            .then(() => resolve(signature))
            .catch((err) => {
              resolve(
                Error(
                  // eslint-disable-next-line max-len
                  `${PREFIX} removePublished: failed to remove signature: "${signature.id}" for inspection: "${signature.inspection}" item: "${signature.item}": ${err}`
                )
              );
            })
        )
    );

    // Wait for all removal results
    const results = await Promise.all(removals);

    // Sort results into those
    // successfully removed and errors
    results.forEach((item) => {
      if (item instanceof Error) {
        result.errors.push(item);
      } else {
        result.successful.push(item);
      }
    });

    return result;
  },

  // Add uploaded signature URL's to updatees
  addSignatureUrls: (
    updates: inspectionTemplateUpdateModel,
    currentTemplate: inspectionTemplateUpdateModel,
    updateOption: any, // eslint-disable-line
    signatureUploads: unpublishedSignatureModel[]
  ): inspectionTemplateUpdateModel => {
    let signatureUpdates = JSON.parse(
      JSON.stringify(updates)
    ) as inspectionTemplateUpdateModel;

    // Add each signature's download URL to updates
    signatureUploads.forEach(({ item, signatureDownloadURL }) => {
      signatureUpdates = inspUtil.updateTemplate(
        signatureUpdates,
        currentTemplate,
        {
          items: { [item]: { signatureDownloadURL } }
        },
        updateOption
      );
    });

    return signatureUpdates;
  }
};
