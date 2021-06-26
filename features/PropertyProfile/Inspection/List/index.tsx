import { FunctionComponent } from 'react';
import clsx from 'clsx';
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
      <ul className={styles.propertyProfile__inspectionsList}>
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
