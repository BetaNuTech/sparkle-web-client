import { FunctionComponent } from 'react';
import MobileHeader from '../../../common/MobileHeader';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import DesktopHeader from '../../../common/DesktopHeader';
import styles from './styles.module.scss';
import UserModel from '../../../common/models/user';
import { getLevelName } from '../../../common/utils/userPermissions';
import utilString from '../../../common/utils/string';
import Actions from '../Actions';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  isCreatingUser: boolean;
  user: UserModel;
  isDisabled: boolean;
  onSubmit(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  isCreatingUser,
  user,
  isDisabled,
  onSubmit
}) => {
  const title = isCreatingUser ? 'Add User' : 'Edit User';
  const accessLevel = getLevelName(user);

  // Mobile Header right actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button className={headStyle.header__button} disabled={isDisabled}>
        Save
      </button>
    </>
  );

  // Mobile Header left actions buttons
  const mobileHeaderLeftAction = (headStyle) => (
    <>
      <LinkFeature
        href="/users"
        legacyHref="/admin/users"
        featureEnabled={features.supportBetaUsers}
        className={headStyle.header__back}
      >
        <ChevronIcon />
        Users
      </LinkFeature>
    </>
  );

  const BreadCrumbs = () => (
    <>
      <div className={styles.header__breadcrumbs}>
        <LinkFeature
          href="/users"
          legacyHref="/admin/users"
          featureEnabled={features.supportBetaUsers}
          className={styles.header__link}
          data-testid="user-edit-header-link"
        >
          Users
        </LinkFeature>
      </div>
      <div
        className={styles.header__title}
        data-testid="user-edit-header-title"
      >
        {title}
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            left={mobileHeaderLeftAction}
            isStaging={isStaging}
            title={title}
            actions={mobileHeaderActions}
          />
        </>
      ) : (
        <DesktopHeader
          title={<BreadCrumbs />}
          isOnline={isOnline}
          isColumnTitle
          right={
            <Actions
              isDisabled={isDisabled}
              onSubmit={onSubmit}
              isCreatingUser={isCreatingUser}
            />
          }
        />
      )}
      {!isCreatingUser && (
        <div className={styles.userInfo}>
          <div className={styles.pill}>
            <p className={styles.pill__label}>
              Updating{!isMobile && <> :&nbsp;</>}
            </p>
            <p className={styles.pill__value}>{user?.email}</p>
          </div>

          <div className={styles.pill}>
            <p className={styles.pill__label}>
              Access{!isMobile && <> :&nbsp;</>}
            </p>
            <p className={styles.pill__value}>
              {utilString.titleize(accessLevel)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
