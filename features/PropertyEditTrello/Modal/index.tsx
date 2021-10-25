import { FunctionComponent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../common/Modal/styles.module.scss';
import MobileHeader from '../../../common/MobileHeader';
import DropdownGroup from './dropdownGroup';
import propertyModel from '../../../common/models/property';
import { trelloBoard, trelloResult } from '../../../common/services/api/trello';
import trelloUserModel from '../../../common/models/trelloUser';

export interface Selection {
  openBoard: { name: string; id: string };
  openList: { name: string; id: string };
  closeBoard: { name: string; id: string };
  closeList: { name: string; id: string };
}

interface Props extends ModalProps {
  onClose: () => void;
  isOnline?: boolean;
  isStaging?: boolean;
  property: propertyModel;
  selectedOptions: Selection;
  trelloUser: trelloUserModel;
  hasUpdateCompanySettingsPermission: boolean;
  trelloBoards: trelloBoard;
  openSelectionModal: () => void;
  onSave: () => Promise<any>;
  onReset: () => Promise<any>;
  hasSelectionChange: trelloResult;
  isLoadingLists: boolean;
  isOpenListsLoading: boolean;
  isClosedListsLoading: boolean;
}

const TrelloModal: FunctionComponent<Props> = ({
  onClose,
  isOnline,
  isStaging,
  selectedOptions,
  hasUpdateCompanySettingsPermission,
  trelloUser,
  property,
  openSelectionModal,
  hasSelectionChange,
  isOpenListsLoading,
  isClosedListsLoading,
  onSave,
  onReset
}) => {
  const headerActions = () => (
    <>
      <button
        onClick={onClose}
        className={clsx(
          modalStyles.modal__closeButton,
          modalStyles['-topLeft']
        )}
        data-testid="close"
      >
        ×
      </button>
      <button
        data-testid="save-button"
        className={styles.trelloModal__saveButton}
        disabled={!hasSelectionChange}
        onClick={onSave}
      >
        Save
      </button>
    </>
  );

  const { openBoard, openList, closeBoard, closeList } = selectedOptions;
  const { trelloFullName, trelloUsername } = trelloUser;

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        actions={headerActions}
        isStaging={isStaging}
        title="TRELLO"
        data-testid="trello-modal"
      />
      {trelloUser ? (
        <>
          <div className={modalStyles.modal__main}>
            <h5
              className={styles.trelloModal__trelloUserName}
            >{`${trelloFullName} (${trelloUsername})`}</h5>
            <DropdownGroup
              title="Deficient Item - OPEN"
              board={openBoard}
              list={openList}
              status="open"
              openSelectionModal={openSelectionModal}
              isLoadingLists={isOpenListsLoading}
            />
            <DropdownGroup
              title="Deficient Item - CLOSED"
              board={closeBoard}
              list={closeList}
              status="close"
              openSelectionModal={openSelectionModal}
              isLoadingLists={isClosedListsLoading}
            />
          </div>
          <footer
            className={clsx(
              modalStyles.modal__main__footer,
              '-jc-center',
              '-bgc-white'
            )}
          >
            <button onClick={onReset} className={styles.trelloModal__resetBtn}>
              RESET
            </button>
          </footer>
        </>
      ) : (
        <>
          {hasUpdateCompanySettingsPermission ? (
            <Link href="/admin/settings">
              <a className={styles.trelloModal__link}>
                <p>Configure Trello for organization</p>
              </a>
            </Link>
          ) : (
            <>
              <h5 className={styles.trelloModal__title}>
                Please ask an admin to configure a Trello for organization
              </h5>

              <Link href={`/properties/edit/${property.id}`}>
                <a className={styles.trelloModal__link}>
                  <p>Return to property edit</p>
                </a>
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Modal(TrelloModal, false, styles.trelloModal);
