import { FunctionComponent } from 'react';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import ListItem from '../ListItem';
import styles from './styles.module.scss';

interface Props {
  propertyId: string;
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  forceVisible: boolean;
}

const InspectionList: FunctionComponent<Props> = ({
  propertyId,
  inspections,
  templateCategories,
  forceVisible
}) => {
  if (inspections) {
    return (
      <ul
        className={styles.propertyProfile__inspectionsList}
        data-testid="property-profile-mobile-inspections"
      >
        {inspections.map((lineItem) => (
          <ListItem
            propertyId={propertyId}
            key={lineItem.id}
            inspection={lineItem}
            templateCategories={templateCategories}
            forceVisible={forceVisible}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default InspectionList;
