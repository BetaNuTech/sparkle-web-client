import { FunctionComponent } from 'react';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import styles from './styles.module.scss';

interface Props {
  isDisabled: boolean;
  onSubmit(): void;
  isCreatingUser: boolean;
  isLoading: boolean;
}

const Actions: FunctionComponent<Props> = ({
  isDisabled,
  onSubmit,
  isCreatingUser,
  isLoading
}) => (
  <>
    <LinkFeature
      href="/users"
      legacyHref="/admin/users"
      featureEnabled={features.supportBetaUsers}
      className={styles.actionCancel}
    >
      Cancel
    </LinkFeature>

    <button
      type="button"
      className={styles.actionSubmit}
      disabled={isDisabled || isLoading}
      onClick={onSubmit}
      data-testid="user-edit-save-button"
    >
      {isLoading ? (
        <span className={styles.actionSubmit__loading}>Loading...</span>
      ) : (
        <span>{isCreatingUser ? 'Create User' : 'Save'}</span>
      )}
    </button>
  </>
);

export default Actions;
