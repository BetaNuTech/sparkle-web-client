import { useMemo, useState } from 'react';
import {
  useForm,
  FormState,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form';
import Router from 'next/router';
import UserModel from '../../../common/models/user';
import deepClone from '../../../common/utils/deepClone';
import * as objectHelper from '../../../common/utils/object';
import userApi from '../../../common/services/api/users';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import errorReports from '../../../common/services/api/errorReports';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const PREFIX = 'features: UserEdit: hooks: useUserEdit:';

export const USER_NOTIFICATIONS_CREATE = {
  forbidden: 'User with that email already exists',
  unpermissioned: 'You do not have permission to create users',
  internalServer: 'Unknown error please try again',
  success: 'New user created successfully'
};

export const USER_NOTIFICATIONS_UPDATE = {
  notFound: 'This user no longer exists',
  unpermissioned: 'You do not have permission to update users',
  internalServer: 'Unknown error please try again',
  success: 'User successfully updated'
};

export const errors = {
  email: 'Email is required.',
  invalidEmail: 'Please enter valid email.',
  firstName: 'First name is required.',
  lastName: 'Last name is required.'
};

type userNotifications = (message: string, options?: any) => any;

export type FormInputs = {
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  corporate: boolean;
  isDisabled: boolean;
  pushOptOut: boolean;
};

interface useUserEditReturn {
  updates: UserModel;
  register: UseFormRegister<FormInputs>;
  formState: FormState<FormInputs>;
  isCreatingUser: boolean;
  isDisabled: boolean;
  onSubmit(): void;
  setValue: UseFormSetValue<FormInputs>;
  selectedTeams: string[];
  onSelectTeam(teamId: string): void;
  isLoading: boolean;
  onUpdateUser(): void;
  onCreateUser(): void;
  selectedProperties: string[];
  onSelectProperty(propertyId: string): void;
}

/* eslint-disable */
const useUserEdit = (
  user: UserModel,
  sendNotification: userNotifications
): useUserEditReturn => {
  const isCreatingUser = user.id === 'new';
  const [updates, setUpdates] = useState({} as UserModel);
  const [isLoading, setIsLoading] = useState(false);

  // Default values for form fields
  const defaultValues = {
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    admin: user.admin || false,
    corporate: user.corporate || false,
    isDisabled: user.isDisabled || false,
    pushOptOut: user.pushOptOut || false
  };

  const {
    register,
    trigger: triggerFormValidation,
    formState,
    getValues,
    setValue,
    setError,
    reset
  } = useForm<FormInputs>({
    mode: 'all',
    defaultValues
  });

  const hasUpdates = Boolean(Object.keys(updates).length);

  const isDisabled = isCreatingUser
    ? !formState.isValid
    : !hasUpdates && (!formState.isValid || !formState.isDirty);

  const onSelectTeam = (teamId: string) => {
    const result = deepClone(updates);
    result['teams'] = result['teams'] || {};
    const hasTeam = Boolean((user.teams || {})[teamId]);
    const hasPreviousTeam = typeof result.teams[teamId] === 'boolean';

    // Remove, previously published, team
    if (hasTeam && !hasPreviousTeam) {
      result['teams'][teamId] = false;
    }

    // Add new, unpublished, team relationship
    if (!hasTeam && !hasPreviousTeam) {
      result['teams'][teamId] = true;
    }

    // Remove, unchanged and non-publishable, team update
    if (hasPreviousTeam) {
      delete result['teams'][teamId];
    }

    // remove blank team object from updates
    if (Object.keys(result['teams']).length < 1) {
      delete result.teams;
    }

    objectHelper.replaceContent(updates, result || {});
    setUpdates(result as UserModel);
  };

  const onSelectProperty = (propertyId: string) => {
    const result = deepClone(updates);
    result['properties'] = result['properties'] || {};
    const hasProperty = Boolean((user.properties || {})[propertyId]);
    const hasPreviousProperty =
      typeof result.properties[propertyId] === 'boolean';

    // Remove, previously published, property
    if (hasProperty && !hasPreviousProperty) {
      result['properties'][propertyId] = false;
    }

    // Add new, unpublished, property relationship
    if (!hasProperty && !hasPreviousProperty) {
      result['properties'][propertyId] = true;
    }

    // Remove, unchanged and non-publishable, property update
    if (hasPreviousProperty) {
      delete result['properties'][propertyId];
    }

    // remove blank property object from updates
    if (Object.keys(result['properties']).length < 1) {
      delete result.properties;
    }

    objectHelper.replaceContent(updates, result || {});
    setUpdates(result as UserModel);
  };

  const handleCreateErrorResponse = (error: BaseError) => {
    let errorMessage = null;
    if (error instanceof ErrorBadRequest) {
      error.errors.forEach((err) =>
        // set form errors
        setError(
          err.name as keyof FormInputs,
          { type: 'custom', message: err.detail },
          { shouldFocus: true }
        )
      );
    }
    if (error instanceof ErrorForbidden) {
      errorMessage = USER_NOTIFICATIONS_CREATE.forbidden;
    }
    if (error instanceof ErrorServerInternal) {
      errorMessage = USER_NOTIFICATIONS_CREATE.internalServer;
    }

    if (error instanceof ErrorUnauthorized) {
      errorMessage = USER_NOTIFICATIONS_CREATE.unpermissioned;
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(`${PREFIX} handleCreateErrorResponse: ${error}`);

      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }

    // send error notifications
    if (errorMessage) {
      sendNotification(errorMessage, {
        type: 'error'
      });
    }
  };

  const onCreateUser = async () => {
    const { email, firstName, lastName } = getValues();
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const createdUser = await userApi.createRecord({
        email,
        firstName,
        lastName
      } as UserModel);

      // Send user facing notification
      sendNotification(USER_NOTIFICATIONS_CREATE.success, {
        type: 'success'
      });
      // Redirect to user edit page
      Router.push(`/users/edit/${createdUser.id}/`);
      // Reset form state and values
      reset();
      setUpdates({} as UserModel);
    } catch (err) {
      handleCreateErrorResponse(err);
    }
    setIsLoading(false);
  };

  const handleUpdateErrorResponse = (error: BaseError) => {
    let errorMessage = null;
    if (error instanceof ErrorBadRequest) {
      errorMessage = error.errors.map((err) => err.detail).join(', ');
    }
    if (error instanceof ErrorUnauthorized || error instanceof ErrorForbidden) {
      errorMessage = USER_NOTIFICATIONS_UPDATE.unpermissioned;
    }

    if (error instanceof ErrorNotFound) {
      errorMessage = USER_NOTIFICATIONS_UPDATE.notFound;
    }

    if (error instanceof ErrorServerInternal) {
      errorMessage = USER_NOTIFICATIONS_UPDATE.internalServer;
    }

    // send error notifications
    if (errorMessage) {
      sendNotification(errorMessage, {
        type: 'error'
      });
    }
  };
  const onUpdateUser = async () => {
    const values = getValues();
    // Get only updated values
    const data = Object.keys(values).reduce((acc, curr) => {
      if (values[curr] !== user[curr]) {
        acc[curr] = values[curr];
      }
      return acc;
    }, {} as UserModel);

    if (updates.teams) {
      data.teams = updates.teams;
    }
    if (updates.properties) {
      data.properties = updates.properties;
    }
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await userApi.updateRecord(user.id, data as UserModel);
      // Send user facing notification
      sendNotification(USER_NOTIFICATIONS_UPDATE.success, {
        type: 'success'
      });

      // Reset form state
      reset({}, { keepValues: true });
      setUpdates({} as UserModel);
    } catch (err) {
      handleUpdateErrorResponse(err);
    }
    setIsLoading(false);
  };

  const onSubmit = () => {
    triggerFormValidation();

    if (!formState.isValid) return;

    if (isCreatingUser) {
      onCreateUser();
    } else {
      onUpdateUser();
    }
  };

  const selectedTeams = useMemo(() => {
    const userTeams = { ...user.teams, ...updates.teams };
    return Object.keys(userTeams).filter((key) => Boolean(userTeams[key]));
  }, [user, updates]);

  const selectedProperties = useMemo(() => {
    const userProperties = { ...user.properties, ...updates.properties };
    return Object.keys(userProperties).filter((key) =>
      Boolean(userProperties[key])
    );
  }, [user, updates]);

  return {
    register,
    formState,
    isCreatingUser,
    isDisabled,
    onSubmit,
    setValue,
    updates,
    selectedTeams,
    onSelectTeam,
    isLoading,
    onUpdateUser,
    onCreateUser,
    selectedProperties,
    onSelectProperty
  };
};

export default useUserEdit;
