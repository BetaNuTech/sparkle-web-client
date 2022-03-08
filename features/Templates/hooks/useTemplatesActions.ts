import { useState } from 'react';
import Router from 'next/router';
import templatesApi from '../../../common/services/api/templates';
import errorReports from '../../../common/services/api/errorReports';
import BaseError from '../../../common/models/errors/baseError';
import features from '../../../config/features';
import winLocation from '../../../common/utils/winLocation';

const PREFIX = 'features: DeficientItemEdit: hooks: useTemplatesActions:';

type DeleteStatus = {
  isDeleted: boolean;
  templateId: string;
};

interface useTemplatesActionsResult {
  createTemplate(templateId?: string): void;
  deleteTemplate(templateId?: string): Promise<DeleteStatus>;
  isLoading: boolean;
}

type userNotifications = (message: string, options?: any) => any;

export default function useTemplatesActions(
  sendNotification: userNotifications
): useTemplatesActionsResult {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSuccessResponse = (templateId: string) => {
    if (features.supportBetaTemplateEdit) {
      Router.push(`/templates/edit/${templateId}/`);
    } else {
      winLocation.setHref(`/templates/update/${templateId}/`);
    }
    sendNotification('Template created successfully', {
      type: 'success'
    });
  };

  const handleErrorResponse = (error: BaseError) => {
    // Log issue and send error report
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${error}`);

    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const createTemplate = async (templateId?: string) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const createdTemplateId = await templatesApi.createRecord(templateId);
      handleCreateSuccessResponse(createdTemplateId);
    } catch (err) {
      sendNotification('Failed to create template, please try again', {
        type: 'error'
      });
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  const deleteTemplate = async (templateId: string): Promise<DeleteStatus> => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await templatesApi.deleteRecord(templateId);
      return { isDeleted: true, templateId };
    } catch (err) {
      handleErrorResponse(err);
      return { isDeleted: false, templateId };
    }
  };

  return {
    createTemplate,
    deleteTemplate,
    isLoading
  };
}
