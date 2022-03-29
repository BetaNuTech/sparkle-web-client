import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import inspectionModel from '../../../common/models/inspection';
import templateCategoryModel from '../../../common/models/templateCategory';

import GridHeader from './GridHeader';
import List from './List';

interface Props {
  user: userModel;
  propertyId: string;
  inspections: inspectionModel[];
  templateCategories: templateCategoryModel[];
  openInspectionDeletePrompt: (inspection: inspectionModel) => void;
  onMoveInspection: (inspection: inspectionModel) => void;
  onSortChange?(sortKey: string): void;
  sortBy?: string;
  sortDir?: string;
  forceVisible: boolean;
}

const Grid: FunctionComponent<Props> = ({
  user,
  propertyId,
  inspections,
  templateCategories,
  openInspectionDeletePrompt,
  onMoveInspection,
  onSortChange,
  sortBy,
  sortDir,
  forceVisible
}) => {
  if (!inspections) {
    return <></>;
  }

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
        propertyId={propertyId}
        inspections={inspections}
        templateCategories={templateCategories}
        openInspectionDeletePrompt={openInspectionDeletePrompt}
        onMoveInspection={onMoveInspection}
        forceVisible={forceVisible}
      />
    </>
  );
};

export default Grid;
