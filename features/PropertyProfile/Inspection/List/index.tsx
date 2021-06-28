import { FunctionComponent } from 'react';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import ListItem from '../ListItem';
import styles from './styles.module.scss';

interface Props {
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
}

const InspectionList: FunctionComponent<Props> = ({
  inspections,
  templateCategories
}) => {
  if (inspections) {
    return (
      <ul
        className={styles.propertyProfile__inspectionsList}
        data-testid="property-profile-mobile-inspections"
      >
        {inspections.map((lineItem) => (
          <ListItem
            key={lineItem.id}
            inspection={lineItem}
            templateCategories={templateCategories}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default InspectionList;
