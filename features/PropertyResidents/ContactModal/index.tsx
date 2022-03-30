import clsx from 'clsx';
import { FunctionComponent, useMemo } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import baseStyles from '../../../common/Modal/styles.module.scss';
import ResidentModel from '../../../common/models/yardi/resident';
import { phoneNumber } from '../../../common/utils/humanize';
import { toContacts, YardiContact } from '../../../common/utils/yardi';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  resident: ResidentModel;
}

const ContactModal: FunctionComponent<Props> = ({ onClose, resident }) => {
  const contacts = useMemo(
    () => createResidentAndOccupantsContacts(resident),
    [resident]
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
                    {contact.name} - {phoneNumber(contact.value)} (
                    {contact.subCategory})
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
