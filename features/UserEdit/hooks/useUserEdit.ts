import {
  useForm,
  FormState,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form';
import UserModel from '../../../common/models/user';

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
  register: UseFormRegister<FormInputs>;
  formState: FormState<FormInputs>;
  isCreatingUser: boolean;
  isDisabled: boolean;
  onSubmit(): void;
  setValue: UseFormSetValue<FormInputs>;
}

/* eslint-disable */
const useUserEdit = (user: UserModel): useUserEditReturn => {
  const isCreatingUser = user.id === 'new';

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

  return {
    register,
    formState,
    isCreatingUser,
    isDisabled,
    onSubmit,
    setValue
  };
};

export default useUserEdit;
