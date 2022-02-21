import { ChangeEvent, FunctionComponent } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import utilString from '../../../common/utils/string';
import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';
import DeficientItemEditForm from '../../../common/DeficientItemEditForm';
import DeficientItemModel from '../../../common/models/deficientItem';
import Actions from '../../../common/DeficientItemEditForm/Actions';
import UserModel from '../../../common/models/user';

interface Props extends ModalProps {
  onClose: () => void;
  movingItems: string[];
  nextState: string;
  deficientItems: DeficientItemModel[];
  user: UserModel;
  isOnline: boolean;
  updates: DeficientItemModel;
  isSaving: boolean;
  onChangeReasonIncomplete(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onChangeDueDate(evt: ChangeEvent<HTMLInputElement>): void;
  onChangeResponsibilityGroup(evt: ChangeEvent<HTMLSelectElement>): void;
  onChangeProgressNote(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onGoBack(): void;
  onUpdateIncomplete(): void;
  onCloseDI(): void;
  onUnpermittedPending(): void;
  onUpdatePending(): void;
  onAddProgressNote(): void;
}

const BulkUpdateModal: FunctionComponent<Props> = ({
  onClose,
  movingItems,
  nextState,
  deficientItems,
  user,
  isOnline,
  updates,
  isSaving,
  onChangeReasonIncomplete,
  onChangePlanToFix,
  onChangeDueDate,
  onChangeResponsibilityGroup,
  onChangeProgressNote,
  onGoBack,
  onUpdateIncomplete,
  onCloseDI,
  onUnpermittedPending,
  onUpdatePending,
  onAddProgressNote
}) => {
  const movingItemsLength = movingItems.length;
  const deficientItem =
    deficientItems.find((item) => item.id === movingItems[0]) ||
    ({} as DeficientItemModel);
  return (
    <div className={styles.modal} data-testid="bulk-update-modal">
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="bulk-update-modal-close"
      >
        ×
      </button>
      <header className={baseStyles.modal__header}>
        <h4
          className={baseStyles.modal__heading}
          data-testid="bulk-update-modal-heading"
        >
          Move To {utilString.titleize(utilString.dedash(nextState))}
        </h4>
      </header>

      <div className={baseStyles.modal__main}>
        <div className={baseStyles.modal__main__content}>
          <h6 className={baseStyles.modal__subHeading}>
            You&apos;re moving {movingItemsLength} deficient item
            {movingItemsLength > 1 && 's'}
          </h6>
          <DeficientItemEditForm
            deficientItem={deficientItem}
            isBulkUpdate={true} // eslint-disable-line react/jsx-boolean-value
            updates={updates}
            onChangeReasonIncomplete={onChangeReasonIncomplete}
            onChangePlanToFix={onChangePlanToFix}
            onChangeDueDate={onChangeDueDate}
            onChangeResponsibilityGroup={onChangeResponsibilityGroup}
            onChangeProgressNote={onChangeProgressNote}
          />
        </div>
        <footer className={baseStyles.modal__main__footer}>
          <button
            className={baseStyles.modal__main__footerClose}
            onClick={onClose}
            data-testid="bulk-update-modal-abort"
          >
            Abort
          </button>
          <Actions
            isOnline={isOnline}
            nextState={nextState}
            isBulkUpdate={true} // eslint-disable-line react/jsx-boolean-value
            inline={true} // eslint-disable-line react/jsx-boolean-value
            showHeader={false}
            deficientItem={deficientItem}
            user={user}
            updates={updates}
            isSaving={isSaving}
            onGoBack={onGoBack}
            onUpdateIncomplete={onUpdateIncomplete}
            onClose={onCloseDI}
            onUnpermittedPending={onUnpermittedPending}
            onUpdatePending={onUpdatePending}
            onAddProgressNote={onAddProgressNote}
          />
        </footer>
      </div>
    </div>
  );
};

export default Modal(BulkUpdateModal, false, styles.modal);
