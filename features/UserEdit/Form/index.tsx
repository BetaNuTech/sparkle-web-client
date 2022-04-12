import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import ErrorLabel from '../../../common/ErrorLabel';
import UserModel from '../../../common/models/user';
import SwitchInput from '../../../common/SwitchInput';
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
  isCreatingUser,
  user
}) => {
  const userProperties = Object.keys(user.properties || {}).length;
  const userTeams = Object.keys(user.teams || {}).length;

  return (
    <form className={styles.container}>
      {!user?.email && (
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
      )}

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

      <label
        className={clsx(styles.field__control, styles.pillField)}
        htmlFor="admin-check"
      >
        <div className={styles.pillField__body}>
          <p className={styles.pillField__label}>Admin</p>
          <small className={styles.pillField__subLabel}>
            Full Sparkle & Admin Access
          </small>
        </div>
        <div className={styles.pillField__input}>
          <SwitchInput {...register('admin')} id="admin-check" />
        </div>
      </label>

      <label
        className={clsx(styles.field__control, styles.pillField)}
        htmlFor="corporate-check"
      >
        <div className={styles.pillField__body}>
          <p className={styles.pillField__label}>Corporate</p>
          <small className={styles.pillField__subLabel}>
            Access to All Properties
          </small>
        </div>
        <div className={styles.pillField__input}>
          <SwitchInput {...register('corporate')} id="corporate-check" />
        </div>
      </label>

      <div className={clsx(styles.field__control, styles.pillField)}>
        <div className={styles.pillField__body}>
          <p className={styles.pillField__label}>Team</p>
          <small className={styles.pillField__subLabel}>
            Access to All Team Properties
          </small>
        </div>
        <div className={styles.pillField__input}>
          <div className={styles.pillField__counter}>{userTeams}</div>
        </div>
      </div>

      <div className={clsx(styles.field__control, styles.pillField)}>
        <div className={styles.pillField__body}>
          <p className={styles.pillField__label}>Property</p>
          <small className={styles.pillField__subLabel}>
            Access to Properties Only
          </small>
        </div>
        <div className={styles.pillField__input}>
          <div className={styles.pillField__counter}>{userProperties}</div>
        </div>
      </div>

      <label
        className={clsx(styles.field__control, styles.pillField)}
        htmlFor="isDisabled-check"
      >
        <div className={styles.pillField__body}>
          <p className={styles.pillField__label}>Disable</p>
          <small className={styles.pillField__subLabel}>
            Remove all access
          </small>
        </div>
        <div className={styles.pillField__input}>
          <SwitchInput {...register('isDisabled')} id="isDisabled-check" />
        </div>
      </label>

      <div className={styles.actions}>
        <Actions
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          isCreatingUser={isCreatingUser}
        />
      </div>
    </form>
  );
};

export default UserEditForm;
