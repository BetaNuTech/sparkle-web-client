import { useState } from 'react';
import Router from 'next/router';
import teamsApi from '../../../common/services/api/teams';
import teamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: EditTeam: hooks: useTeamForm:';

type userNotifications = (message: string, options?: any) => any;
interface useTeamFormResult {
  isLoading: boolean;
  team?: teamModel;
  onSubmit(teamName: string, teamId: string): void;
  teamCreate(team: teamModel): void;
  teamUpdate(teamId: string, team: teamModel): void;
  error: string[];
}

export default function useTeamForm(
  sendNotification: userNotifications
): useTeamFormResult {
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState([]);

  const handleSuccessResponse = (teamId: string, latestTeam: teamModel) => {
    setTeam(latestTeam);

    // Show success notification for creting or updating a team
    sendNotification(
      teamId === 'new'
        ? 'Team successfully created'
        : `${latestTeam.name} successfully updated`,
      {
        type: 'success'
      }
    );

    if (teamId === 'new' && latestTeam) {
      Router.push(`/teams/edit/${latestTeam.id}`);
    }
  };

  const handleErrorResponse = (apiError: Error, teamId: string) => {
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to create or update team
      sendNotification(
        `You are not allowed to ${
          teamId === 'new' ? 'create' : 'update'
        } team.`,
        { type: 'error' }
      );
    } else if (
      apiError instanceof ErrorBadRequest ||
      apiError instanceof ErrorConflictingRequest
    ) {
      const errors = apiError.errors
        ? apiError.errors.map((e) => e.detail)
        : [];
      setError(errors);
    } else {
      // User not allowed to create or update team
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete team create/update operation`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const teamCreate = (payload: any): Promise<void> => {
    setIsLoading(true);

    /* eslint-disable import/no-named-as-default-member */
    return teamsApi
      .createTeam(payload)
      .then((teamResult) => {
        handleSuccessResponse('new', teamResult);
      })
      .catch((err) => {
        handleErrorResponse(err, 'new');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const teamUpdate = (teamId: string, payload: any): Promise<void> => {
    setIsLoading(true);

    /* eslint-disable import/no-named-as-default-member */
    return teamsApi
      .updateTeam(teamId, payload)
      .then((teamResult) => {
        handleSuccessResponse(teamId, teamResult);
      })
      .catch((err) => {
        handleErrorResponse(err, teamId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = (teamName: string, teamId: string) => {
    const payload: any = {
      name: teamName
    };

    const isCreatingTeam = teamId === 'new';

    if (isCreatingTeam) {
      teamCreate(payload);
    } else {
      teamUpdate(teamId, payload);
    }
  };

  return {
    isLoading,
    team,
    onSubmit,
    teamCreate,
    teamUpdate,
    error
  };
}
