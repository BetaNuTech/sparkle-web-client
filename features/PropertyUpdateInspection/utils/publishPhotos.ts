import Observable from 'zen-observable';
import parallelLimit from 'async/parallelLimit';
import asyncify from 'async/asyncify';
import unPublishedPhotoModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import photosDb from '../../../common/services/indexedDB/inspectionItemPhotosData';
import inspUtil from '../../../common/utils/inspection';
import inspectionApi from '../../../common/services/api/inspections';
import filesUtil from '../../../common/utils/files';

const PREFIX = 'features: PropertyUpdateInspection: utils: publishPhotos:';

// Result for each step of publish process
export type PhotoPublishStep = {
  successful: unPublishedPhotoModel[];
  errors: Error[];
};

type photoStreamResult = {
  done: boolean;
  size?: number;
  result: PhotoPublishStep;
};

const uploadPhoto = async (photoData: unPublishedPhotoModel) => {
  const fileName = `${photoData.createdAt}.png`;
  const file = filesUtil.dataURLtoFile(photoData.photoData, fileName);
  // eslint-disable-next-line import/no-named-as-default-member
  return inspectionApi.uploadPhotoData(
    photoData.inspection,
    photoData.item,
    file
  );
};

// Create stream of upload photos data
const upload = (
  inspectionId: string,
  unpublishedPhotos: unPublishedPhotoModel[]
) =>
  new Observable((observer) => {
    (async () => {
      const result = {
        successful: [],
        errors: []
      };

      const uploadPromises = [];

      // Create all upload requests to upload photos
      // and push them into array
      // to upload them parallel with limit using
      // async/parallelLimit
      unpublishedPhotos.forEach(async (photo: unPublishedPhotoModel) => {
        const photoUploadPromise = async () => {
          try {
            // eslint-disable-next-line  no-await-in-loop
            const file = await uploadPhoto(photo);
            photo.downloadURL = file.downloadURL;
            photo.fileId = file.id;
            result.successful.push(photo);
            observer.next({ done: false, size: photo.size });
            return result;
          } catch (err) {
            const error = Error(
              // eslint-disable-next-line max-len
              `${PREFIX} upload: failed to upload photo for inspection "${inspectionId}" item "${
                photo.item
              }": ${err.toString()}`
            );

            result.errors.push(error);
            observer.next({ done: false, size: photo.size });
            return result;
          }
        };

        // need to wrap function with asyncify as we are using transpiler
        // as async function will be parsed
        // to an ordinary function that returns a promise
        // reference link https://caolan.github.io/async/v3/global.html
        uploadPromises.push(asyncify(photoUploadPromise));
      });

      // limit concurrent request to maximum 4
      parallelLimit(uploadPromises, 4, () => {
        // notify subscriber that operations is completed
        // and all files are uploaded
        observer.next({ done: true, result });
        observer.complete();
      });
    })();
  });

export default {
  // Upload all unpublished photos
  // resolving successful photos and errors
  uploadPhotos: (
    inspectionId: string,
    flattenedUnpublishedPhotosFiles: unPublishedPhotoModel[],
    uploadedBytes: number,
    setProgressValue: (size: number) => void
  ): Promise<PhotoPublishStep> =>
    new Promise((resolve) => {
      let result = {
        successful: [],
        errors: []
      } as PhotoPublishStep;

      upload(inspectionId, flattenedUnpublishedPhotosFiles).subscribe({
        next: (response: photoStreamResult) => {
          if (response.done) {
            result = response.result;
          } else {
            uploadedBytes += response.size; // eslint-disable-line no-param-reassign
            setProgressValue(uploadedBytes);
          }
        },
        complete: () => resolve(result)
      });
    }),

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
