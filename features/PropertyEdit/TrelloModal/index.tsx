import { FunctionComponent, useEffect } from 'react';

import clsx from 'clsx';
import { useFirestore } from 'reactfire';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../common/Modal/styles.module.scss';
import propertyModel from '../../../common/models/property';
import TrelloIntegrationModel from '../../../common/models/trelloIntegration';
import useTrelloProperty from '../../../common/hooks/useTrelloProperty';
import SkeletonLoader from '../../../common/SkeletonLoader';
import useTrelloBoards from '../../PropertyEditTrello/hooks/useTrelloBoards';
import usePropertyTrelloSelection from '../../PropertyEditTrello/hooks/usePropertyTrelloSelection';
import SelectionGroup from './SelectionGroup';

interface Props extends ModalProps {
  onClose: () => void;
  property: propertyModel;
  trelloIntegration: TrelloIntegrationModel;
  hasUpdateCompanySettingsPermission: boolean;
  onSave: () => void;
  onReset: () => void;
  onLoadDataError: () => void;
}

const TrelloModal: FunctionComponent<Props> = ({
  onClose,
  trelloIntegration,
  property,
  onSave,
  onReset,
  onLoadDataError
}) => {
  const firestore = useFirestore();

  // Load Trello data for property
  const {
    data: trelloProperty,
    status: trelloPropertyStatus,
    error: trelloPropertyError
  } = useTrelloProperty(firestore, property.id);

  // Load Boards
  const {
    data: trelloBoards,
    status: trelloBoardsStatus,
    error: boardsError
  } = useTrelloBoards();

  // Handle Selection
  const { selectedOptions, hasSelectionChange } = usePropertyTrelloSelection(
    trelloProperty || {},
    ''
  );

  const { openBoard, openList, closeBoard, closeList } = selectedOptions;
  const { trelloFullName, trelloUsername } = trelloIntegration;

  // invoke method to close modal
  // and send user facing notification
  // on error in loading data
  useEffect(() => {
    if (trelloPropertyError || boardsError) {
      onLoadDataError();
    }
  }, [trelloPropertyError, boardsError, onLoadDataError]);

  const isLoaded =
    trelloPropertyStatus === 'success' && trelloBoardsStatus === 'success';

  return (
    <>
      <header
        className={clsx(
          modalStyles.modal__header,
          modalStyles['modal__header--blue'],
          styles.header
        )}
      >
        <button
          onClick={onClose}
          className={clsx(
            modalStyles.modal__closeButton,
            modalStyles['-topLeft'],
            styles.headerButton
          )}
          data-testid="close"
        >
          ×
        </button>
        <h4>Trello</h4>
        <button
          data-testid="save-button"
          className={clsx(styles.headerButton, modalStyles['-topLeft'])}
          disabled={!hasSelectionChange}
          onClick={onSave}
        >
          Save
        </button>
      </header>
      {!isLoaded && <SkeletonLoader className="-pl -pr -mt" />}
      {trelloIntegration && isLoaded && (
        <>
          <div className={modalStyles.modal__main}>
            <h5
              className={styles.subHeading}
            >{`${trelloFullName} (${trelloUsername})`}</h5>
            <SelectionGroup
              title="Deficient Item - OPEN"
              board={openBoard}
              list={openList}
              status="open"
            />
            <SelectionGroup
              title="Deficient Item - CLOSED"
              board={closeBoard}
              list={closeList}
              status="close"
            />
          </div>
          <footer
            className={clsx(
              modalStyles.modal__main__footer,
              '-jc-center',
              '-bgc-white'
            )}
          >
            <button onClick={onReset} className={styles.cancelButton}>
              RESET
            </button>
          </footer>
        </>
      )}
    </>
  );
};

export default Modal(TrelloModal, false, styles.container);
