import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../common/Modal/styles.module.scss';
import headerStyles from '../../../common/MobileHeader/styles.module.scss';
import MobileHeader from '../../../common/MobileHeader';
import DropdownGroup from './dropdownGroup';
import propertyModel from '../../../common/models/property';

interface Options {
  openBoard: string;
  openList: string;
  closedBoard: string;
  closedList: string;
}

interface Props extends ModalProps {
  onClose: () => void;
  isOnline?: boolean;
  isStaging?: boolean;
  property: propertyModel;
  selectedOptions: Options;
}

const TrelloModal: FunctionComponent<Props> = ({
  onClose,
  isOnline,
  isStaging,
  selectedOptions
}) => {
  const closeModal = () => {
    onClose();
  };

  const headerActions = () => (
    <>
      <button
        onClick={closeModal}
        className={clsx(
          modalStyles.modal__closeButton,
          modalStyles['-topLeft']
        )}
        data-testid="close"
      >
        ×
      </button>
      <button
        data-testid="save-button-mobile"
        className={styles.trelloModal__saveButton}
      >
        Save
      </button>
    </>
  );

  const { openBoard, openList, closedBoard, closedList } = selectedOptions;

  const authorizorName = 'Authorizor';
  const trelloUserName = 'Trello User';
  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        actions={headerActions}
        isStaging={isStaging}
        title="TRELLO"
        className={clsx(headerStyles['header--displayOnDesktop'])}
      />
      <div className={modalStyles.modal__main}>
        <h5
          className={styles.trelloModal__trelloUserName}
        >{`${authorizorName} (${trelloUserName})`}</h5>
        <DropdownGroup
          title="Deficient Item - OPEN"
          board={closedBoard}
          list={closedList}
        />
        <DropdownGroup
          title="Deficient Item - CLOSED"
          board={openBoard}
          list={openList}
        />
      </div>
      <footer
        className={clsx(
          modalStyles.modal__main__footer,
          '-jc-center',
          '-bgc-white'
        )}
      >
        <button className={styles.trelloModal__resetBtn}>RESET</button>
      </footer>
    </>
  );
};

export default Modal(TrelloModal, false, styles.trelloModal);
