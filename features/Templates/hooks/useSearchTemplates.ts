import { ChangeEvent, KeyboardEvent } from 'react';
import useSearching from '../../../common/hooks/useSearching';
import TemplateModel from '../../../common/models/template';
import TemplateCategoryModel from '../../../common/models/templateCategory';
import useCategorizedTemplates from '../../../common/hooks/useCategorizedTemplates';
import CategorizedTemplates from '../../../common/models/templates/categorizedTemplates';

interface useSearchTemplatesResult {
  categorizedTemplate: CategorizedTemplates[];
  searchValue: string;
  onSearchKeyDown: (
    ev: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

export default function useSearchTemplates(
  templates: TemplateModel[],
  templateCategories: TemplateCategoryModel[],
  deletedIds: string[]
): useSearchTemplatesResult {
  // Templates search setup
  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(templates, ['name', 'description']);

  // remove deleted items from list and assign types
  const filteredTemplates = filteredItems
    .filter((item) => deletedIds.indexOf(item.id) < 0)
    .map((itm) => itm as TemplateModel);

  const { categories: categorizedTemplate } = useCategorizedTemplates(
    templateCategories,
    filteredTemplates
  );
  return {
    categorizedTemplate,
    searchValue,
    onSearchKeyDown,
    onClearSearch
  };
}
