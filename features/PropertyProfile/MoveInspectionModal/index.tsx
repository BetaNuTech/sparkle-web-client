import clsx from 'clsx';
import { FunctionComponent } from 'react';
import firebase from 'firebase/app';
import Image from 'next/image';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import baseStyles from '../../../common/Modal/styles.module.scss';
import InspectionModel from '../../../common/models/inspection';
import UserModel from '../../../common/models/user';
import useMoveInspection from '../hooks/useMoveInspection';
import SkeletonLoader from '../../../common/SkeletonLoader';
import PropertiesGroup from './Group';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  inspection: InspectionModel;
  firestore: firebase.firestore.Firestore;
  user: UserModel;
  onConfirm(property: string): void;
  isMoving: boolean;
}

const MoveInspectionModal: FunctionComponent<Props> = ({
  onClose,
  inspection,
  firestore,
  user,
  onConfirm,
  isMoving
}) => {
  const {
    isLoaded,
    currentPropertyName,
    selectedPropertyName,
    selectedProperty,
    onSelectProperty,
    teams,
    propertiesByTeam
  } = useMoveInspection(firestore, user, inspection);
  return (
    <div className={styles.modal} data-testid="move-inspection-modal">
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>Reassign Inspection</h4>
        <h5>Reassign {inspection?.templateName} under a new property</h5>
      </header>
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="move-inspection-modal-close"
      >
        ×
      </button>

      <div className={clsx(baseStyles.modal__main)}>
        <div className={styles.selection}>
          <p className="-c-gray-med-dark -fz-medium-large -mb-xsm">
            {currentPropertyName}
          </p>
          <div
            className="-c-primary -fz-medium-large"
            data-testid="move-inspection-selected-property"
          >
            {selectedPropertyName}
          </div>
        </div>
        <div
          className={clsx(
            baseStyles.modal__main__content,
            styles.main,
            isMoving && styles['main--loading']
          )}
        >
          {isMoving && (
            <Image
              className={styles.loader}
              loader={sparkleImgLoader}
              src="/img/sparkle-loader.gif"
              alt="loader"
              width="100"
              height="100"
              layout="fixed"
            />
          )}
          {!isLoaded && <SkeletonLoader className="-pl -pr" />}
          {isLoaded && !isMoving && (
            <ul>
              {teams.map((team) => {
                const teamProperties = propertiesByTeam.get(team.id) || [];
                return (
                  <PropertiesGroup
                    key={team.id}
                    selectedProperty={selectedProperty}
                    onSelectProperty={onSelectProperty}
                    team={team}
                    properties={teamProperties}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <div className={clsx(baseStyles.modal__main__footer, '-jc-flex-end')}>
          <button
            className={styles.action}
            disabled={!selectedProperty || isMoving}
            onClick={() => onConfirm(selectedProperty)}
          >
            Confirm Move
          </button>
        </div>
      </div>
    </div>
  );
};

const sparkleImgLoader = ({ src }) => src;

export default Modal(MoveInspectionModal, false);
