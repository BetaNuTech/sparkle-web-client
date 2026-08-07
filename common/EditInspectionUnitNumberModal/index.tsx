import clsx from 'clsx';
import { FunctionComponent, useEffect, useState } from 'react';
import getConfig from 'next/config';
import Modal, { Props as ModalProps } from '../Modal';
import baseStyles from '../Modal/styles.module.scss';
import InspectionModel from '../models/inspection';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

export const MAX_UNIT_NUMBER_LENGTH = 24;

interface Props extends ModalProps {
  onClose: () => void;
  inspection: InspectionModel;
  onConfirm(unitNumber: string): void;
  isUpdating: boolean;
}

const EditUnitNumberModal: FunctionComponent<Props> = ({
  onClose,
  inspection,
  onConfirm,
  isUpdating
}) => {
  const currentUnitNumber = inspection?.unitNumber || '';
  const [unitNumber, setUnitNumber] = useState(currentUnitNumber);

  // Sync input with the queued
  // inspection's current unit number
  useEffect(() => {
    setUnitNumber(inspection?.unitNumber || '');
  }, [inspection?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const finalUnitNumber = unitNumber.trim();
  const hasUpdates = finalUnitNumber !== currentUnitNumber;

  return (
    <div className={styles.modal} data-testid="edit-unit-number-modal">
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>Unit #</h4>
        <h5>Set an optional unit for {inspection?.templateName}</h5>
      </header>
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="edit-unit-number-modal-close"
      >
        ×
      </button>

      <div className={clsx(baseStyles.modal__main)}>
        <div className={clsx(baseStyles.modal__main__content, styles.main)}>
          {isUpdating ? (
            <img
              src={`${basePath}/img/sparkle-loader.gif`}
              alt="loader"
              width="60"
            />
          ) : (
            <input
              type="text"
              className={styles.input}
              placeholder="Unit #"
              maxLength={MAX_UNIT_NUMBER_LENGTH}
              value={unitNumber}
              onChange={(evt) => setUnitNumber(evt.target.value)}
              data-testid="edit-unit-number-input"
            />
          )}
        </div>
        <div className={clsx(baseStyles.modal__main__footer, '-jc-flex-end')}>
          <button
            className={styles.action}
            disabled={!hasUpdates || isUpdating}
            onClick={() => onConfirm(finalUnitNumber)}
            data-testid="edit-unit-number-confirm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal(EditUnitNumberModal, false);
