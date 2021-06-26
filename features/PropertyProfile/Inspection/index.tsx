import { FunctionComponent } from 'react';
import inspectionModel from '../../../common/models/inspection';
import templateCategoryModel from '../../../common/models/templateCategory';

import List from './List';

interface Props {
  inspections: Array<inspectionModel>;
  templateCategories: Array<templateCategoryModel>;
  isMobile?: boolean;
}

const Inspection: FunctionComponent<Props> = ({
  inspections,
  templateCategories
}) => {
  if (inspections) {
    return (
      <List inspections={inspections} templateCategories={templateCategories} />
    );
  }
  return null;
};

export default Inspection;
