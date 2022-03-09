import { FunctionComponent } from 'react';
import TemplateModel from '../../../../common/models/template';
import TemplateCategoryModel from '../../../../common/models/templateCategory';
import General from './General';
import Sections from './Sections';
import SectionItems from './SectionItems';
import Items from './Items';
import ItemValues from './ItemValues';

interface Props {
  step: string;
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
}

const EditSteps: FunctionComponent<Props> = ({
  step,
  template,
  templateCategories
}) => {
  switch (step) {
    case 'sections':
      return <Sections template={template} />;
    case 'section-items':
      return <SectionItems />;
    case 'items':
      return <Items />;
    case 'item-values':
      return <ItemValues />;
    default:
      return (
        <General template={template} templateCategories={templateCategories} />
      );
  }
};

export default EditSteps;
