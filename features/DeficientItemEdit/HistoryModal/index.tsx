import clsx from 'clsx';
import { FunctionComponent } from 'react';
import firebase from 'firebase/app';
import { deficientItemsHistoryTitles } from '../../../config/deficientItems';
import useQueryUsers from '../../../common/hooks/useQueryUsers';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import DeficientItemModel from '../../../common/models/deficientItem';
import UserModel from '../../../common/models/user';
import HistoryItem from './Item';

import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose(): void;
  historyType: string;
  deficientItem: DeficientItemModel;
  firestore: firebase.firestore.Firestore;
}

const HistoryModal: FunctionComponent<Props> = ({
  onClose,
  historyType,
  deficientItem,
  firestore
}) => {
  const historyItems = deficientItem[historyType];

  const userIds = [];

  const flattenedHistoryItems = Object.keys(historyItems || {})
    .map((id) => {
      if (historyItems[id]?.user) {
        userIds.push(historyItems[id]?.user);
      }
      return { id, ...historyItems[id] };
    })
    .sort(
      ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
        aCreatedAt - bCreatedAt
    );

  // remove duplicate entries
  const uniqueIds = Array.from(new Set(userIds));

  // load all required users
  const { data: users, status } = useQueryUsers(firestore, uniqueIds);

  const isLoading = status === 'loading' || users.length !== uniqueIds.length;

  return (
    <div className={styles.modal} data-testid="history-modal">
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="history-modal-close"
      >
        ×
      </button>
      <header className={baseStyles.modal__header}>
        <h4
          className={baseStyles.modal__heading}
          data-testid="history-modal-title"
        >
          {deficientItemsHistoryTitles[historyType]}
        </h4>
      </header>

      <div className={clsx(baseStyles.modal__main, styles.modal__main)}>
        <ul>
          {flattenedHistoryItems.map((history) => (
            <HistoryItem
              key={history.id}
              history={history}
              historyType={historyType}
              isLoading={isLoading}
              user={findUser(users, history.user)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal(HistoryModal, false, styles.modal);

const findUser = (users: UserModel[], userId: string) =>
  users.find((user) => user.id === userId);
