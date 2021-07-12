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
  onSortChange?(sortKey: string): void;
  sortBy?: string;
  sortDir?: string;
}

const Grid: FunctionComponent<Props> = ({
  user,
  inspections,
  templateCategories,
  openInspectionDeletePrompt,
  onSortChange,
  sortBy,
  sortDir
}) => {
  if (inspections) {
    return (
      <>
        <GridHeader
          user={user}
          onSortChange={onSortChange}
          sortBy={sortBy}
          sortDir={sortDir}
        />
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
