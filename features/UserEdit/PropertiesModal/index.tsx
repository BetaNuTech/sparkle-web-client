import clsx from 'clsx';
import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import baseStyles from '../../../common/Modal/styles.module.scss';
import ModalItem from '../ModalItem';

interface Props extends ModalProps {
  onClose: () => void;
  properties: propertyModel[];
  onSelect(propertyId: string): void;
  selectedProperties: string[];
}

const PropertiesModal: FunctionComponent<Props> = ({
  onClose,
  properties,
  onSelect,
  selectedProperties
}) => {
  const sortedProperties = [...properties].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return (
    <div
      className="-flex-direction-column -full-height"
      data-testid="user-edit-properties-modal"
    >
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>Properties</h4>
        <h5>Update user property associations</h5>
      </header>
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="user-edit-properties-close"
      >
        ×
      </button>

      <div className={clsx(baseStyles.modal__main)}>
        <ul>
          {sortedProperties.map((property) => {
            const isSelected = selectedProperties.includes(property.id);
            return (
              <ModalItem
                key={property.id}
                item={property}
                isSelected={isSelected}
                onClick={() => onSelect(property.id)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Modal(PropertiesModal, false);
