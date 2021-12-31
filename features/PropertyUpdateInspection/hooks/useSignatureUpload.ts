import { useState } from 'react';
import useStorage from '../../../common/hooks/useStorage';
import unPublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import errorReports from '../../../common/services/api/errorReports';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';

const PREFIX = 'features: PropertyUpdateInspection: hooks: useSignatureUpload:';

interface useSignatureUploadResult {
  onSignatureUpload(
    signatures: Map<string, unPublishedSignatureModel[]>
  ): Promise<inspectionTemplateItemModel[]>;
  error: string;
}

export default function useSignatureUpload(
  inspectionId: string
): useSignatureUploadResult {
  const { uploadBase64FileToStorage } = useStorage();
  const [error, setError] = useState(null);

  // upload signature to firebase storage
  const uploadSignature = async (signature: unPublishedSignatureModel) => {
    const fileName = `${signature.createdAt}.png`;
    let result = null;
    try {
      // Upload file to the firebase storage
      result = await uploadBase64FileToStorage(
        `inspectionItemImages/${inspectionId}/${signature.item}/${fileName}`,
        signature.signature
      );
      return result;
    } catch (err) {
      const wrappedErr = Error(
        `${PREFIX} UploadSignature: failed to upload to storage: ${err}`
      );

      // Also send the error report to backend
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      throw err;
    }
  };

  // request to upload all signatures.
  const onSignatureUpload = async (
    signatures: Map<string, unPublishedSignatureModel[]>
  ) => {
    setError(null);
    const signaturesUploadPromise = [];
    signatures.forEach((signature) => {
      signaturesUploadPromise.push(
        new Promise((resolve) => {
          uploadSignature(signature[0])
            .then((file) => {
              resolve({
                signatureDownloadURL: file.fileUrl,
                id: signature[0].item
              });
            })
            .catch(() => {
              resolve(
                Error(
                  'Some signatures failed to publish, please check your internet connection and try again'
                )
              );
            });
        })
      );
    });

    // once all signature are uploaded it returns all uploaded signatures with item id and download url
    const signatureResults = await Promise.all(signaturesUploadPromise);
    const signatureItems = signatureResults.filter((signature) => {
      if (signature instanceof Error) {
        setError(signature.message);
        return false;
      }
      return true;
    });
    return signatureItems;
  };

  return {
    onSignatureUpload,
    error
  };
}
