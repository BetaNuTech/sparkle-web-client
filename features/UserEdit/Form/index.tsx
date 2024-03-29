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
  onTeamsClick(): void;
  selectedTeams: string[];
  isLoading: boolean;
  onPropertiesClick(): void;
  selectedProperties: string[];
  showUserRoleFields: boolean;
  isCurrentUser: boolean;
  onDelete(): void;
  canEditRole: boolean;
}

const UserEditForm: FunctionComponent<Props> = ({
  formState,
  register,
  onSubmit,
  isDisabled,
  isCreatingUser,
  onTeamsClick,
  selectedTeams,
  onPropertiesClick,
  selectedProperties,
  isLoading,
  showUserRoleFields,
  isCurrentUser,
  onDelete,
  canEditRole
}) => {
  const showDeleteAction = !isCurrentUser && !isCreatingUser;
  return (
    <form className={styles.container}>
      {isCreatingUser && (
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
              disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <ErrorLabel formName="lastName" errors={formState.errors} />
        </div>
      </div>
      {showUserRoleFields && (
        <>
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
              <SwitchInput
                {...register('admin')}
                id="admin-check"
                disabled={isLoading}
                data-testid="user-edit-admin-input"
              />
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
              <SwitchInput
                {...register('corporate')}
                id="corporate-check"
                disabled={isLoading}
                data-testid="user-edit-corporate-input"
              />
            </div>
          </label>

          <div
            className={clsx(styles.field__control, styles.pillField)}
            onClick={onTeamsClick}
            data-testid="user-edit-teams-input"
          >
            <div className={styles.pillField__body}>
              <p className={styles.pillField__label}>Team</p>
              <small className={styles.pillField__subLabel}>
                Access to All Team Properties
              </small>
            </div>
            <div className={styles.pillField__input}>
              <div className={styles.pillField__counter}>
                {selectedTeams.length}
              </div>
            </div>
          </div>

          <div
            className={clsx(styles.field__control, styles.pillField)}
            onClick={onPropertiesClick}
            data-testid="user-edit-properties-input"
          >
            <div className={styles.pillField__body}>
              <p className={styles.pillField__label}>Property</p>
              <small className={styles.pillField__subLabel}>
                Access to Properties Only
              </small>
            </div>
            <div className={styles.pillField__input}>
              <div className={styles.pillField__counter}>
                {selectedProperties.length}
              </div>
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
              <SwitchInput
                {...register('isDisabled')}
                id="isDisabled-check"
                disabled={isLoading}
                data-testid="user-edit-isDisabled-input"
              />
            </div>
          </label>
        </>
      )}
      {isCurrentUser && (
        <label
          className={clsx(styles.field__control, styles.pillField)}
          htmlFor="pushOptOut-check"
        >
          <div className={styles.pillField__body}>
            <p className={styles.pillField__label}>Push Notifications</p>
            <small className={styles.pillField__subLabel}>
              Opt out of push notifications
            </small>
          </div>
          <div className={styles.pillField__input}>
            <SwitchInput
              {...register('pushOptOut')}
              id="pushOptOut-check"
              disabled={isLoading}
              data-testid="user-edit-pushOptOut-input"
            />
          </div>
        </label>
      )}
      <div className={styles.actions}>
        <Actions
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          isCreatingUser={isCreatingUser}
          isLoading={isLoading}
          canEditRole={canEditRole}
        />
      </div>
      {showDeleteAction && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
        >
          Delete User
        </button>
      )}
    </form>
  );
};

export default UserEditForm;
