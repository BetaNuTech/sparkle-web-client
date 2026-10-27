import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';
import Modal, { Props as ModalProps } from '../../../../common/Modal/index';
import styles from '../../../../common/Modal/styles.module.scss';
import WarningIcon from '../../../../public/icons/sparkle/warning.svg';
import { yardiCustomReason } from '../../../../common/models/yardi/customValues';

interface Props extends ModalProps {
  workOrderId: string;
  reasons: yardiCustomReason[];
  onConfirm(reason: string): any;
}

// Confirm cancelling a work order, collecting
// a reason when Yardi offers or requires one
const CancelPrompt: FunctionComponent<Props> = ({
  workOrderId,
  reasons,
  onConfirm,
  onClose
}) => {
  const [reason, setReason] = useState('');
  const isReasonRequired = reasons.some((r) => r.required);
  const canConfirm = !isReasonRequired || Boolean(reason);

  const confirmAndClose = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <>
      <header className={styles.modalPrompt__header}>
        <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
          <WarningIcon />
        </span>
        <h5 className={styles.modalPrompt__heading}>
          Cancel work order {workOrderId}?
        </h5>
      </header>

      <div className={styles.modalPrompt__main}>
        <div className={styles.modalPrompt__main__content}>
          <p className={styles.modal__description}>
            This sets the work order&apos;s status to Canceled in Yardi.
          </p>
          {reasons.length > 0 && (
            <>
              <label
                className={styles.modal__formLabel}
                htmlFor="cancel-work-order-reason"
              >
                Reason{isReasonRequired ? ' *' : ''}
              </label>
              <select
                id="cancel-work-order-reason"
                value={reason}
                onChange={(evt) => setReason(evt.target.value)}
                data-testid="cancel-work-order-reason"
              >
                <option value="">
                  {isReasonRequired ? 'Select a reason…' : 'None'}
                </option>
                {reasons.map((r) => (
                  <option key={r.reason} value={r.reason}>
                    {r.reason}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <footer className={styles.modalPrompt__main__footer}>
          <button
            className={clsx('button', 'gray', styles.modal__mainFooterbutton)}
            onClick={onClose}
            data-testid="cancel-work-order-close"
          >
            KEEP
          </button>
          <button
            className={clsx('button', 'alert', styles.modal__mainFooterbutton)}
            onClick={confirmAndClose}
            disabled={!canConfirm}
            data-testid="cancel-work-order-confirm"
          >
            CANCEL WORK ORDER
          </button>
        </footer>
      </div>
    </>
  );
};

export default Modal(CancelPrompt, true);
