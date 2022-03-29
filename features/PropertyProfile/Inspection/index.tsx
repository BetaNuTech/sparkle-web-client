import { FunctionComponent } from 'react';
import inspectionModel from '../../../common/models/inspection';
import templateCategoryModel from '../../../common/models/templateCategory';
import List from './List';

interface Props {
  propertyId: string;
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  openInspectionDeletePrompt: (inspection: inspectionModel) => void;
  onMoveInspection: (inspection: inspectionModel) => void;
  forceVisible: boolean;
  isMobile?: boolean;
}

const Inspection: FunctionComponent<Props> = ({
  propertyId,
  inspections,
  templateCategories,
  openInspectionDeletePrompt,
  onMoveInspection,
  forceVisible
}) => {
  if (inspections) {
    return (
      <List
        propertyId={propertyId}
        inspections={inspections}
        templateCategories={templateCategories}
        openInspectionDeletePrompt={openInspectionDeletePrompt}
        onMoveInspection={onMoveInspection}
        forceVisible={forceVisible}
      />
    );
  }
  return null;
};

export default Inspection;
