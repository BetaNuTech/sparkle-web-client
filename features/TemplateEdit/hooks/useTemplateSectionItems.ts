import TemplateItemModel from '../../../common/models/inspectionTemplateItem';
import TemplateModel from '../../../common/models/template';
import utilArray from '../../../common/utils/array';
import deepmerge from '../../../common/utils/deepmerge';

interface Result {
  templateSectionItems: Map<string, TemplateItemModel[]>;
}

export default function useTemplateSectionItems(
  currentTemplate: TemplateModel,
  updatedTemplate: TemplateModel
): Result {
  const templateItems = deepmerge(
    currentTemplate.items || {},
    updatedTemplate.items || {}
  );
  const itemsList = Object.keys(templateItems).map((id) => ({
    id,
    ...templateItems[id]
  }));

  // Grouping of items by their section
  const templateSectionItems = utilArray.groupBy<string, TemplateItemModel>(
    itemsList,
    (item) => item.sectionId
  );

  // Sort each group of section items by index
  templateSectionItems.forEach((item) =>
    item.sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex)
  );

  return {
    templateSectionItems
  };
}
