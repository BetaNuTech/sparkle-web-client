import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import userModel from '../../common/models/user';
import useProperty from '../../common/hooks/useProperty';
import usePropertyTemplates from './hooks/usePropertyTemplates';
import CategoryItem from './CategoryItem';
import useCategorizedTemplates from './hooks/useCategorizedTemplates';
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
  const { data: templates } = usePropertyTemplates(firestore, propertyId);

  // Fetch all data in template categories
  const { data: templateCategories } = useTemplateCategories(firestore);

  const { categories: sortedCategories } = useCategorizedTemplates(
    templateCategories,
    templates
  );

  return (
    <>
      <MobileHeader
        title="Select a Template"
        isOnline={isOnline}
        isStaging={isStaging}
        className={styles.createInspection__header}
      />
      <div className={styles.createInspection__box}>
        <ul className={styles.createInspection__box__list}>
          {sortedCategories.map((sc) => (
            <CategoryItem key={`${sc.id}`} category={sc} />
          ))}
        </ul>
      </div>
    </>
  );
};
// TODO remove
/* eslint-enable */

export default CreateInspection;
