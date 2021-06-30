import { FunctionComponent } from 'react';
import clsx from 'clsx';
import userModel from '../../../../common/models/user';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import ListItem from '../ListItem';
import styles from '../styles.module.scss';

interface Props {
  user: userModel;
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  openInspectionDeletePrompt: () => void;
}

const InspectionList: FunctionComponent<Props> = ({
  user,
  inspections,
  templateCategories,
  openInspectionDeletePrompt
}) => {
  if (inspections) {
    return (
      <ul
        className={clsx(styles.propertyProfile__grid)}
        data-testid="property-profile-grid-inspections"
      >
        {inspections.map((lineItem) => (
          <ListItem
            user={user}
            key={lineItem.id}
            inspection={lineItem}
            templateCategories={templateCategories}
            openInspectionDeletePrompt={openInspectionDeletePrompt}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default InspectionList;
