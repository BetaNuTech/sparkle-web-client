import { useMemo, useState } from 'react';
import {
  useForm,
  FormState,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form';
import UserModel from '../../../common/models/user';
import deepClone from '../../../common/utils/deepClone';
import * as objectHelper from '../../../common/utils/object';

export const errors = {
  email: 'Email is required.',
  invalidEmail: 'Please enter valid email.',
  firstName: 'First name is required.',
  lastName: 'Last name is required.'
};

export type FormInputs = {
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  corporate: boolean;
  isDisabled: boolean;
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
}

/* eslint-disable */
const useUserEdit = (user: UserModel): useUserEditReturn => {
  const isCreatingUser = user.id === 'new';
  const [updates, setUpdates] = useState({} as UserModel);

  const {
    register,
    trigger: triggerFormValidation,
    formState,
    getValues,
    setValue
  } = useForm<FormInputs>({
    mode: 'all',
    defaultValues: user
  });

  const onSubmit = () => {
    triggerFormValidation();

    if (formState.isValid) {
      const data = getValues();
      console.log(data); // eslint-disable-line
    }
  };

  const isDisabled = isCreatingUser
    ? !formState.isValid
    : !formState.isValid || !formState.isDirty;

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

  const selectedTeams = useMemo(() => {
    const userTeams = { ...user.teams, ...updates.teams };
    return Object.keys(userTeams).filter((key) => Boolean(userTeams[key]));
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
    onSelectTeam
  };
};

export default useUserEdit;
