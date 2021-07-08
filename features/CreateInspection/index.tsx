import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import userModel from '../../common/models/user';
import useProperty from '../../common/hooks/useProperty';
import useTemplates from './hooks/usePropertyTemplates';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import MobileHeader from '../../common/MobileHeader';
import styles from './styles.module.scss';

interface CreateInspectionProps {
  user: userModel;
  propertyId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

// TODO renable linting
/* eslint-disable */
const CreateInspection: FunctionComponent<CreateInspectionProps> = ({
  user,
  propertyId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the list of all templates against property
  const { data: templates } = useTemplates(firestore, propertyId);

  // Fetch all data in template categories
  const { data: templateCategories } = useTemplateCategories(firestore);

  return (
    <MobileHeader
      title="Select a Template"
      isOnline={isOnline}
      isStaging={isStaging}
      className={styles.createInspection__header}
    />
  );
};
// TODO remove
/* eslint-enable */

export default CreateInspection;
