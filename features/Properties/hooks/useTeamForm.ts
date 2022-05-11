import { useEffect, useState } from 'react';

import teamsApi from '../../../common/services/api/teams';
import TeamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: Properties: hooks: useTeamForm:';

type userNotifications = (message: string, options?: any) => any;

interface UserError {
  message: string;
}

interface Result {
  isLoading: boolean;
  createTeam(team: TeamModel): void;
  errors: Record<string, UserError>;
  setIsVisible(visible: boolean): void;
  isVisible: boolean;
}

export default function useTeamForm(
  sendNotification: userNotifications
): Result {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSuccessResponse = (team: TeamModel) => {
    // Show success notification for creting or updating a team
    sendNotification(`The team: ${team.name} was created successfully`, {
      type: 'success'
    });
    setIsVisible(false);
  };

  const handleErrorResponse = (error: Error) => {
    if (error instanceof ErrorForbidden) {
      // User not allowed to create or update team
      sendNotification('You are not allowed to create team.', {
        type: 'error'
      });
    } else if (
      error instanceof ErrorBadRequest ||
      error instanceof ErrorConflictingRequest
    ) {
      const errorsUpdate = {};
      error.errors.forEach((err) => {
        errorsUpdate[err.name] = { message: err.detail };
      });
      setErrors(errorsUpdate);
    } else {
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete team create operation: ${error}`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const createTeam = async (payload: any): Promise<void> => {
    setIsLoading(true);
    setErrors(null);
    /* eslint-disable import/no-named-as-default-member */
    try {
      const team = await teamsApi.createTeam(payload);

      handleSuccessResponse(team);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setErrors(null);
  }, [isVisible]);

  return {
    isLoading,
    createTeam,
    errors,
    setIsVisible,
    isVisible
  };
}
