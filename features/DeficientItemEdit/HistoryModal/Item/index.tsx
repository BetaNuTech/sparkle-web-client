import { FunctionComponent } from 'react';
import clsx from 'clsx';
import dateUtils from '../../../../common/utils/date';
import HistoryItemDetails from '../ItemDetails';
import UserModel from '../../../../common/models/user';
import { getUserFullname } from '../../../../common/utils/user';

import styles from './styles.module.scss';

interface Props {
  history: any;
  historyType: string;
  isLoading: boolean;
  user: UserModel;
}

const HistoryItem: FunctionComponent<Props> = ({
  history,
  historyType,
  user,
  isLoading
}) => {
  let userName = 'SYSTEM';
  let userEmail = '';

  if (history.user) {
    if (user) {
      userName = getUserFullname(user);
      userEmail = user.email ? `(${user.email})` : '';
    } else {
      userName = 'Unknown';
    }
  }

  return (
    <li className={styles.item}>
      <header>
        <h6
          className={clsx(
            styles.heading,
            isLoading && styles['heading--loading']
          )}
          data-testid="history-user"
        >
          {userName} {userEmail}
        </h6>
        <small className={styles.date} data-testid="history-created-date-time">
          {dateUtils.toUserFullDateDisplay(history.createdAt)} at{' '}
          {dateUtils.toUserTimeDisplay(history.createdAt)}
        </small>
      </header>
      <div className={styles.details}>
        <HistoryItemDetails history={history} historyType={historyType} />
      </div>
    </li>
  );
};

export default HistoryItem;
