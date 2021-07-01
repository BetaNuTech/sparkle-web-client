import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import inspectionModel from '../../../common/models/inspection';
import templateCategoryModel from '../../../common/models/templateCategory';

import GridHeader from './GridHeader';
import List from './List';

interface Props {
  user: userModel;
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  openInspectionDeletePrompt: () => void;
}

const Grid: FunctionComponent<Props> = ({
  user,
  inspections,
  templateCategories,
  openInspectionDeletePrompt
}) => {
  if (inspections) {
    return (
      <>
        <GridHeader user={user} />
        <List
          user={user}
          inspections={inspections}
          templateCategories={templateCategories}
          openInspectionDeletePrompt={openInspectionDeletePrompt}
        />
      </>
    );
  }
  return null;
};

export default Grid;
