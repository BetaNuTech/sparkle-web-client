import { FunctionComponent } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../common/ErrorLabel';
import UserModel from '../../../common/models/user';
import Actions from '../Actions';
import { FormInputs, errors } from '../hooks/useUserEdit';
import styles from './styles.module.scss';

interface Props {
  user: UserModel;
  formState: FormState<FormInputs>;
  register: UseFormRegister<FormInputs>;
  onSubmit(): void;
  isDisabled: boolean;
  isCreatingUser: boolean;
}

const UserEditForm: FunctionComponent<Props> = ({
  formState,
  register,
  onSubmit,
  isDisabled,
  isCreatingUser
}) => (
  <form className={styles.container}>
    <div className={styles.field}>
      <label htmlFor="email" className={styles.field__label}>
        Email <span>*</span>
      </label>
      <div className={styles.field__control}>
        <input
          type="email"
          id="email"
          className={styles.field__input}
          data-testid="user-edit-email-input"
          {...register('email', {
            required: errors.email,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: errors.invalidEmail
            }
          })}
        />
        <ErrorLabel formName="email" errors={formState.errors} />
      </div>
    </div>

    <div className={styles.field}>
      <label htmlFor="firstName" className={styles.field__label}>
        First Name <span>*</span>
      </label>
      <div className={styles.field__control}>
        <input
          type="text"
          id="firstName"
          className={styles.field__input}
          data-testid="user-edit-first-name-input"
          {...register('firstName', { required: errors.firstName })}
        />
        <ErrorLabel formName="firstName" errors={formState.errors} />
      </div>
    </div>

    <div className={styles.field}>
      <label htmlFor="lastName" className={styles.field__label}>
        Last Name <span>*</span>
      </label>
      <div className={styles.field__control}>
        <input
          type="text"
          id="lastName"
          className={styles.field__input}
          data-testid="user-edit-last-name-input"
          {...register('lastName', { required: errors.lastName })}
        />
        <ErrorLabel formName="lastName" errors={formState.errors} />
      </div>
    </div>
    <div className={styles.actions}>
      <Actions
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        isCreatingUser={isCreatingUser}
      />
    </div>
  </form>
);

export default UserEditForm;
