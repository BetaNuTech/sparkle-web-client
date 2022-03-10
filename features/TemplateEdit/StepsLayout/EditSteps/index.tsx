import { FunctionComponent } from 'react';
import TemplateModel from '../../../../common/models/template';
import TemplateCategoryModel from '../../../../common/models/templateCategory';
import TemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import TemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import General from './General';
import Sections from './Sections';
import SectionItems from './SectionItems';
import Items from './Items';
import ItemValues from './ItemValues';

interface Props {
  step: string;
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
  sortedSections: TemplateSectionModel[];
}

const EditSteps: FunctionComponent<Props> = ({
  step,
  template,
  templateCategories,
  templateSectionItems,
  sortedSections,
  forceVisible
}) => {
  switch (step) {
    case 'sections':
      return <Sections template={template} forceVisible={forceVisible} />;
    case 'section-items':
      return (
        <SectionItems
          sortedSections={sortedSections}
          templateSectionItems={templateSectionItems}
          forceVisible={forceVisible}
        />
      );
    case 'items':
      return (
        <Items
          sortedSections={sortedSections}
          templateSectionItems={templateSectionItems}
          forceVisible={forceVisible}
        />
      );
    case 'item-values':
      return <ItemValues />;
    default:
      return (
        <General template={template} templateCategories={templateCategories} />
      );
  }
};

export default EditSteps;
