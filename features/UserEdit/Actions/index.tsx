import { FunctionComponent } from 'react';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import styles from './styles.module.scss';

interface Props {
  isDisabled: boolean;
  onSubmit(): void;
  isCreatingUser: boolean;
}

const Actions: FunctionComponent<Props> = ({
  isDisabled,
  onSubmit,
  isCreatingUser
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
      disabled={isDisabled}
      onClick={onSubmit}
      data-testid="user-edit-save-button"
    >
      {isCreatingUser ? 'Create User' : 'Save'}
    </button>
  </>
);

export default Actions;
