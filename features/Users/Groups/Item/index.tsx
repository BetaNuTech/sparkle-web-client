import clsx from 'clsx';
import { FunctionComponent, useRef } from 'react';
import UserModel from '../../../../common/models/user';
import { getLevelName } from '../../../../common/utils/userPermissions';
import utilString from '../../../../common/utils/string';
import dateUtils from '../../../../common/utils/date';
import useVisibility from '../../../../common/hooks/useVisibility';
import LinkFeature from '../../../../common/LinkFeature';
import features from '../../../../config/features';
import { getUserFullname } from '../../../../common/utils/user';
import styles from './styles.module.scss';

interface Props {
  user: UserModel;
  forceVisible: boolean;
}

const Item: FunctionComponent<Props> = ({ user, forceVisible }) => {
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);
  const accessLevel = getLevelName(user, true);
  const userFriendlyAccessLevel = utilString
    .titleize(utilString.decamel(accessLevel))
    .replace('Team Property', 'Team / Property');
  const creationDate = dateUtils.toUserDateDisplay(user.createdAt);
  const lastSignInDate = user.lastSignInDate
    ? dateUtils.toUserDateDisplay(user.lastSignInDate)
    : 'N/A';
  const lastAppUsed = user.lastUserAgent ? user.lastUserAgent : 'N/A';
  const fullName = getUserFullname(user);

  return (
    <li className={styles.main} ref={placeholderRef}>
      {isVisible && (
        <LinkFeature
          className={styles.item}
          href={`/users/edit/${user.id}`}
          legacyHref={`/admin/users/${user.id}`}
          featureEnabled={features.supportUserEdit}
        >
          <header className={styles.details}>
            <div className={styles.pill}>{userFriendlyAccessLevel}</div>
            <div className={clsx(styles.pill, styles['pill--info'])}>
              Created: {creationDate}
            </div>
          </header>
          <div>
            <h4 className={styles.title}>{fullName}</h4>
            <p className={styles.info}>Email: {user.email}</p>
            <p className={styles.info}>Last App Used: {lastAppUsed}</p>
            <p className={styles.info}>Last Sign On: {lastSignInDate}</p>
          </div>
        </LinkFeature>
      )}
    </li>
  );
};

export default Item;
