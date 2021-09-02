import { FunctionComponent } from 'react';
import inspectionModel from '../../../common/models/inspection';
import templateCategoryModel from '../../../common/models/templateCategory';
import List from './List';

interface Props {
  propertyId: string;
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  forceVisible: boolean;
  isMobile?: boolean;
}

const Inspection: FunctionComponent<Props> = ({
  propertyId,
  inspections,
  templateCategories,
  forceVisible
}) => {
  if (inspections) {
    return (
      <List
        propertyId={propertyId}
        inspections={inspections}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );
  }
  return null;
};

export default Inspection;
