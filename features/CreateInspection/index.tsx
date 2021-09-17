import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import userModel from '../../common/models/user';
import templateModel from '../../common/models/template';
import useProperty from '../../common/hooks/useProperty';
import LoadingHud from '../../common/LoadingHud';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import MobileHeader from '../../common/MobileHeader';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import inspectionService from './services/inspection';
import usePropertyTemplates from './hooks/usePropertyTemplates';
import useCategorizedTemplates from './hooks/useCategorizedTemplates';
import CategoryItem from './CategoryItem';
import styles from './styles.module.scss';

interface CreateInspectionProps {
  user: userModel;
  propertyId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const CreateInspection: FunctionComponent<CreateInspectionProps> = ({
  user,
  propertyId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const [apiState, setApiState] = useState(false);

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the list of all templates against property
  const { data: templates } = usePropertyTemplates(firestore, propertyId);

  // Fetch all data in template categories
  const { data: templateCategories } = useTemplateCategories(firestore);

  const { categories: sortedCategories } = useCategorizedTemplates(
    templateCategories,
    templates
  );

  const createInspection = (template: templateModel) => {
    if (!isOnline) {
      // Check if we are in offline state show the notification
      return sendNotification('You must be online to create an inspection', {
        type: 'error'
      });
    }

    // Set api loading state
    setApiState(true);

    // Send request
    inspectionService
      .createRecord(template, propertyId, sendNotification)
      .then((inspectionId) => {
        Router.push(
          `/properties/${propertyId}/update-inspection/${inspectionId}/`
        );
      })
      .finally(() => {
        // Update api loading state to false
        setApiState(false);
      });
  };

  return (
    <>
      {apiState && <LoadingHud title="Creating Inspection..." />}
      <MobileHeader
        title="Select a Template"
        isOnline={isOnline}
        isStaging={isStaging}
        className={styles.createInspection__header}
      />
      <div className={styles.createInspection__box}>
        {templates.length > 0 ? (
          <ul className={styles.createInspection__box__list}>
            {sortedCategories.map((sc) => (
              <CategoryItem
                key={`${sc.id}`}
                category={sc}
                createInspection={createInspection}
              />
            ))}
          </ul>
        ) : (
          <ul className={styles.createInspection__box__list}>
            <li className={styles.createInspection__category__item}>
              <h2 className="-fw-thin -c-gray-light -ta-center">
                Property has no templates
              </h2>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default CreateInspection;
