import { useEffect, useState } from 'react';

import teamsApi from '../../../common/services/api/teams';
import TeamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: Properties: hooks: useTeamForm:';

type userNotifications = (message: string, options?: any) => any;

export interface UserError {
  message: string;
}

interface Result {
  isLoading: boolean;
  onSubmit(name: string): void;
  errors: Record<string, UserError>;
  addTeam(): void;
  editTeam(team: TeamModel): void;
  closeTeamModal(): void;
  isVisible: boolean;
  isEditing: boolean;
  team: TeamModel;
  createTeam(team: TeamModel): void;
  updateTeam(id: string, team: TeamModel): void;
}

export default function useTeamForm(
  sendNotification: userNotifications
): Result {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [team, setTeam] = useState(null);

  const isVisible = Boolean(team);
  const isEditing = team?.id !== 'new';

  const addTeam = () => {
    setTeam({ id: 'new' });
  };

  const editTeam = (item: TeamModel) => {
    setTeam(item);
  };

  const closeTeamModal = () => {
    setTeam(null);
  };

  const handleSuccessResponse = (response: TeamModel) => {
    // Show success notification for creting or updating a team
    sendNotification(
      `The team: ${response.name} was ${
        isEditing ? 'updated' : 'created'
      } successfully`,
      {
        type: 'success'
      }
    );
    setTeam(null);
  };

  const handleErrorResponse = (error: Error) => {
    if (error instanceof ErrorForbidden) {
      // User not allowed to create or update team
      sendNotification(
        `You are not allowed to ${isEditing ? 'update' : 'create'} team.`,
        {
          type: 'error'
        }
      );
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
        `${PREFIX} Could not complete team ${
          isEditing ? 'update' : 'create'
        } operation: ${error}`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const createTeam = async (payload: TeamModel): Promise<void> => {
    setIsLoading(true);
    setErrors(null);
    /* eslint-disable import/no-named-as-default-member */
    try {
      const response = await teamsApi.createTeam(payload);
      handleSuccessResponse(response);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  const updateTeam = async (id: string, payload: TeamModel): Promise<void> => {
    setIsLoading(true);
    setErrors(null);
    /* eslint-disable import/no-named-as-default-member */
    try {
      const response = await teamsApi.updateTeam(id, payload);

      handleSuccessResponse(response);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  const onSubmit = (name: string) => {
    const payload = {
      name
    };

    if (isEditing) {
      updateTeam(team.id, payload);
    } else {
      createTeam(payload);
    }
  };

  useEffect(() => {
    setErrors(null);
  }, [isVisible]);

  return {
    isLoading,
    onSubmit,
    errors,
    addTeam,
    editTeam,
    closeTeamModal,
    isVisible,
    isEditing,
    team,
    createTeam,
    updateTeam
  };
}
