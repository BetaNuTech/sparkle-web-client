import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';

const isObject = (value: unknown): boolean =>
  Boolean(value) && typeof value === 'object';

// Count the item photos and signatures an inspector's
// device has registered on the inspection but not yet
// uploaded: every non-empty photo data entry without a
// download URL, plus every signed item without a signature
// download URL. Mirrors the API's report PDF gate, so null
// items and empty `{}` entries (delete markers) are ignored
const countPendingUploads = (
  template?: inspectionTemplateModel | inspectionTemplateUpdateModel
): number => {
  const items = (template && template.items) || {};

  return Object.keys(items).reduce((count, itemId) => {
    const item = items[itemId];
    if (!isObject(item)) return count;

    const photosData = isObject(item.photosData) ? item.photosData : {};
    const pendingPhotos = Object.keys(photosData).filter((photoId) => {
      const photo = photosData[photoId];
      return (
        isObject(photo) && Object.keys(photo).length > 0 && !photo.downloadURL
      );
    }).length;

    const pendingSignature =
      item.signatureTimestampKey && !item.signatureDownloadURL ? 1 : 0;

    return count + pendingPhotos + pendingSignature;
  }, 0);
};

export default countPendingUploads;
