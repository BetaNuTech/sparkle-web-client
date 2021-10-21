import { useState } from 'react';
import Router from 'next/router';
import propertiesApi from '../../../common/services/api/properties';
import propertyModel from '../../../common/models/property';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorBadRequest, {
  BadRequestItem
} from '../../../common/models/errors/badRequest';
import formValidationErrors from '../errors';

const PREFIX = 'features: EditProperty: hooks: usePropertyForm:';

type userNotifications = (message: string, options?: any) => any;
interface usePropertyFormResult {
  isLoading: boolean;
  property?: propertyModel;
  onSubmit(
    formState: propertyModel,
    areTemplatesUpdated: boolean,
    selectedTemplates: string[],
    logoImg: string,
    logoFile: File,
    properyImg: string,
    profileFile: File,
    editingProperty: propertyModel
  ): void;
  propertyCreate(property: propertyModel, filePayload: any): void;
  propertyUpdate(
    propertyId: string,
    property: propertyModel,
    filePayload: any
  ): void;
  errors: BadRequestItem[];
  formErrors: any;
}

export default function usePropertyForm(
  sendNotification: userNotifications
): usePropertyFormResult {
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [errors, setErrors] = useState<BadRequestItem[]>([]);
  const [formErrors, setFormErrors] = useState({});

  const handleSuccessResponse = (
    propertyId: string,
    latestProperty: propertyModel
  ) => {
    setProperty(latestProperty);

    // Show success notification for creting or updating a property
    sendNotification(
      propertyId === 'new'
        ? 'Property successfully created'
        : `${property.name} successfully updated`,
      {
        type: 'success'
      }
    );

    if (propertyId === 'new' && latestProperty) {
      Router.push(`/properties/${latestProperty.id}`);
    }
  };

  const handleErrorResponse = (apiError: Error, propertyId: string) => {
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to create or update job
      sendNotification(
        `You are not allowed to ${
          propertyId === 'new' ? 'create' : 'update'
        } this property.`,
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorBadRequest) {
      setErrors(apiError.errors);
    } else if (apiError instanceof ErrorServerInternal) {
      // User not allowed to create or update job
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete property create/update operation`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const postUploadFile = (
    payload: propertyModel,
    propertyId: string,
    target: string,
    file: File
  ): Promise<propertyModel> => {
    const isValidFile =
      file && file instanceof File ? /\.(jpe?g|png)$/i.test(file.name) : false;

    if (!isValidFile) {
      sendNotification('Image format not valid', {
        type: 'error'
      });
      return Promise.resolve({} as propertyModel);
    }

    /* eslint-disable import/no-named-as-default-member */
    return propertiesApi
      .uploadImage(payload, propertyId, target, file)
      .catch((err) => {
        if (err instanceof ErrorBadRequest) {
          const firstError = (err.errors && err.errors[0]) || null;
          const firstErrorTitle = firstError ? firstError.title : '';
          sendNotification(
            `Failed to upload image${
              firstErrorTitle ? ': ' : ''
            } ${firstErrorTitle}`,
            {
              type: 'error'
            }
          );
        } else {
          sendNotification('Failed to upload image, please try again.', {
            type: 'error'
          });

          const wrappedErr = Error(`${PREFIX} uploadFile: ${err}`);
          errorReports.send(wrappedErr);
        }

        // Do not throw, allow other requests to
        // complete successfully, by returning empty result
        return {} as propertyModel;
      });
    /* eslint-enable import/no-named-as-default-member */
  };

  const propertyUpdate = (
    propertyId: string,
    payload: any,
    filePayload: any
  ) => {
    const requests = [];
    const hasNonFileUpdates = payload && Object.keys(payload).length > 0;
    setIsLoading(true);

    // Upload logo
    if (filePayload && filePayload.isUploadingLogo) {
      requests.push(
        postUploadFile(payload, propertyId, 'logo', filePayload.logoFile)
      );
    }

    // Upload profile image
    if (filePayload && filePayload.isUploadingProfile) {
      requests.push(
        postUploadFile(payload, propertyId, 'profile', filePayload.profileFile)
      );
    }

    if (hasNonFileUpdates) {
      // eslint-disable-next-line import/no-named-as-default-member
      requests.push(propertiesApi.updateProperty(propertyId, payload));
    }

    return Promise.all(requests)
      .then((allPropertyResults) => {
        const mergedProperty = allPropertyResults.reduce(
          (acc, propertyResult) => {
            Object.assign(acc, propertyResult); // Merge in single request results
            return acc;
          },
          { id: propertyId, name: '' }
        ) as propertyModel;
        handleSuccessResponse(propertyId, mergedProperty);
      })
      .catch((err) => {
        handleErrorResponse(err, propertyId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const propertyCreate = async (payload: propertyModel, filePayload: any) => {
    setIsLoading(true);

    let isPropertyCreated = false;
    let newProperty = {} as propertyModel;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      newProperty = await propertiesApi.createProperty(payload);
      isPropertyCreated = true;
    } catch (err) {
      handleErrorResponse(err, 'new');
    }

    // NOTE: Property must be created before
    //       uploading images to it
    if (isPropertyCreated && filePayload && filePayload.isUploadingLogo) {
      let updatedProperty = {} as propertyModel;

      // Upload new property's logo
      try {
        updatedProperty = await postUploadFile(
          property,
          newProperty.id,
          'logo',
          filePayload.logoFile
        );
        Object.assign(newProperty, updatedProperty);
        // fail silently
      } catch (err) {} // eslint-disable-line
    }

    if (isPropertyCreated && filePayload && filePayload.isUploadingProfile) {
      let updatedProperty = {} as propertyModel;

      // Upload new property's profile image
      try {
        updatedProperty = await postUploadFile(
          property,
          newProperty.id,
          'profile',
          filePayload.profileFile
        );
        Object.assign(newProperty, updatedProperty);
        // fail silently
      } catch (err) {} // eslint-disable-line
    }

    handleSuccessResponse('new', newProperty);
    setIsLoading(false);
  };

  const onSubmit = (
    formState: propertyModel,
    areTemplatesUpdated: boolean,
    selectedTemplates: string[],
    logoImg: string,
    logoFile: File,
    properyImg: string,
    profileFile: File,
    editingProperty: propertyModel
  ) => {
    // Form Validation
    // TODO replce with yup validation on form change event
    const validationErrors: any = {};
    if (!formState.name) {
      validationErrors.nameRequired = {
        message: formValidationErrors.nameRequired
      };
    }

    const hasErrors =
      validationErrors && Boolean(Object.keys(validationErrors).length);
    if (hasErrors) {
      setFormErrors(validationErrors);
      return;
    }

    // Reset all errors
    setFormErrors({});

    let payload: any = {};

    // Check state for updates and add to payload
    Object.keys(formState).forEach((item) => {
      if (
        JSON.stringify(formState[item]) !==
        JSON.stringify(editingProperty[item])
      ) {
        payload = {
          ...payload,
          [item]:
            item === 'num_of_units' || item === 'year_built'
              ? Number(formState[item])
              : formState[item]
        };
      }
    });

    const isCreatingProperty = !editingProperty.id;

    // Add any user template updates
    if (formState.templates && areTemplatesUpdated) {
      payload.templates = selectedTemplates.reduce((acc, templateId) => {
        acc[templateId] = true;
        return acc;
      }, {});
    }

    const filePayload = {
      isUploadingLogo: false,
      logoFile: null,
      isUploadingProfile: false,
      profileFile: null
    };

    if (logoImg !== editingProperty.logoURL) {
      filePayload.isUploadingLogo = true;
      filePayload.logoFile = logoFile;
    }

    if (properyImg !== editingProperty.photoURL) {
      filePayload.isUploadingProfile = true;
      filePayload.profileFile = profileFile;
    }

    if (isCreatingProperty) {
      propertyCreate(payload, filePayload);
    } else {
      propertyUpdate(editingProperty.id, payload, filePayload);
    }
  };

  return {
    isLoading,
    property,
    onSubmit,
    propertyCreate,
    propertyUpdate,
    errors,
    formErrors
  };
}
