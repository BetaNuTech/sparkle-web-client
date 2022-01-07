import unPublishedPhotoModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import photosDb from '../../../common/services/indexedDB/inspectionItemPhotosData';
import inspUtil from '../../../common/utils/inspection';
import { dataURLtoFile } from '../../../common/utils/files';
import inspectionApi from '../../../common/services/api/inspections';

const PREFIX = 'features: PropertyUpdateInspection: utils: publishPhotos:';

// Result for each step of publish process
export type PhotoPublishStep = {
  successful: unPublishedPhotoModel[];
  errors: Error[];
};

const uploadPhoto = async (
  inspectionId: string,
  photoData: unPublishedPhotoModel
) => {
  const fileName = `${photoData.createdAt}.png`;
  const file = dataURLtoFile(photoData.photoData, fileName);
  // eslint-disable-next-line import/no-named-as-default-member
  return inspectionApi.uploadPhotoData(inspectionId, photoData.item, file);
};

export default {
  // Upload all unpublished photos
  // resolving successful photos and errors
  upload: async (
    inspectionId: string,
    unpublishedPhotos: unPublishedPhotoModel[]
  ): Promise<PhotoPublishStep> => {
    const result = {
      successful: [],
      errors: []
    };

    // Create all upload requests
    const uploads = unpublishedPhotos.map(
      (photo: unPublishedPhotoModel) =>
        new Promise((resolve) => {
          uploadPhoto(inspectionId, photo)
            .then((file) => {
              photo.downloadURL = file.downloadURL;
              photo.fileId = file.id;
              resolve(photo);
            })
            .catch((err) => {
              resolve(
                Error(
                  // eslint-disable-next-line max-len
                  `${PREFIX} upload: failed to upload photo for inspection "${inspectionId}" item "${photo.item}": ${err}`
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

  // Remove local photos data
  // that have been published
  removePublished: async (
    publishedPhotos: unPublishedPhotoModel[]
  ): Promise<PhotoPublishStep> => {
    const result = {
      successful: [],
      errors: []
    };

    const removals = publishedPhotos.map(
      (photo: unPublishedPhotoModel) =>
        new Promise((resolve) =>
          // eslint-disable-next-line
          photosDb
            .deleteRecord(photo.id)
            .then(() => resolve(photo))
            .catch((err) => {
              resolve(
                Error(
                  // eslint-disable-next-line max-len
                  `${PREFIX} removePublished: failed to remove photo: "${photo.id}" for inspection: "${photo.inspection}" item: "${photo.item}": ${err}`
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

  // Add uploaded photos data to updates
  addPhotoData: (
    updates: inspectionTemplateUpdateModel,
    currentTemplate: inspectionTemplateUpdateModel,
    updateOption: any, // eslint-disable-line
    photoUploads: unPublishedPhotoModel[]
  ): inspectionTemplateUpdateModel => {
    let photoUpdates = JSON.parse(
      JSON.stringify(updates)
    ) as inspectionTemplateUpdateModel;

    // Add each photo's data to updates
    photoUploads.forEach(({ item, fileId, downloadURL, caption }) => {
      photoUpdates = inspUtil.updateTemplate(
        photoUpdates,
        currentTemplate,
        {
          items: {
            [item]: { photosData: { [fileId]: { caption, downloadURL } } }
          }
        },
        updateOption
      );
    });
    return photoUpdates;
  }
};
