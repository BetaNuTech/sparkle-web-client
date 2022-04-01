import clsx from 'clsx';
import { FunctionComponent, useMemo } from 'react';
import Modal, { Props as ModalProps } from '../../Modal';
import baseStyles from '../../Modal/styles.module.scss';
import ResidentModel from '../../models/yardi/resident';
import WorkOrderModel from '../../models/yardi/workOrder';
import { phoneNumber } from '../../utils/humanize';
import { toContacts, YardiContact } from '../../utils/yardi';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  data: ResidentModel | WorkOrderModel;
  type: string;
}

const ContactModal: FunctionComponent<Props> = ({ onClose, data, type }) => {
  const contacts = useMemo(
    () =>
      type === 'resident'
        ? createResidentAndOccupantsContacts(data as ResidentModel)
        : toContacts(data),
    [data, type]
  );

  return (
    <>
      <button className={baseStyles.modal__closeButton} onClick={onClose}>
        ×
      </button>
      <div className={clsx(baseStyles.modal__main)}>
        <div className={clsx(baseStyles.modal__main__content)}>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.value} className={styles.contact}>
                {contact.category === 'email' ? (
                  <a
                    href={`mailto:${contact.value}`}
                    data-testid="property-residents-contact-email"
                  >
                    {contact.name} Email
                  </a>
                ) : (
                  <a
                    href={`tel:${contact.value}`}
                    className="-ta-center"
                    data-testid="property-residents-contact-phone"
                  >
                    {contact.name} - {phoneNumber(contact.value)}{' '}
                    {contact.subCategory ? `(${contact.subCategory})` : ''}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

ContactModal.defaultProps = {
  type: 'resident'
};

export default Modal(ContactModal, false, styles.contactModal);

// Create list of contacts for a resident
// and all their occupants
function createResidentAndOccupantsContacts(
  resident: ResidentModel
): YardiContact[] {
  const residentContact = toContacts(resident);
  const occupantContacts = (resident.occupants || [])
    .map(toContacts)
    .reduce((acc, contacts) => {
      acc.push(...contacts); // Flatten matrix to array
      return acc;
    }, []);

  return [...residentContact, ...occupantContacts];
}
