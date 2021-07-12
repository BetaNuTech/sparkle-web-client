import { useEffect, useState } from 'react';
import categoryModel from '../models/category';
import templateModel from '../../../common/models/template';
import templateCategoryModel from '../../../common/models/templateCategory';

interface useCategorizedTemplateResult {
  memo: string;
  handlers: any;
  categories: Array<categoryModel>;
}

// Actions
const handlers = {};

// Hooks for loading all templates for a property
export default function useCategorizedTemplates(
  templateCategories: Array<templateCategoryModel>,
  templates: Array<templateModel>
): useCategorizedTemplateResult {
  const [memo, setMemo] = useState('[]');

  // No templates payload
  const payload = {
    categories: <categoryModel[]>[],
    handlers,
    memo
  };

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(payload.categories);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  // If we do not have templates
  if (templates.length === 0) {
    return payload;
  }

  // Default Uncategorized group
  const uncategorized = {
    id: '',
    name: 'Uncategorized',
    templates: <templateModel[]>[]
  };

  // Custom category groups
  const categories = templateCategories.map(({ id, name }) => ({
    id,
    name,
    templates: <templateModel[]>[]
  }));

  // Add templates to their category group
  templates.forEach((template) => {
    let categoryGroup = uncategorized;

    if (template.category) {
      const category = categories.find(({ id }) => id === template.category);
      categoryGroup = category || uncategorized;
    }

    categoryGroup.templates.push(template);
  });

  // Add all populated category groups
  // with uncategorized last
  [...categories, uncategorized].forEach((categoryGroup) => {
    if (categoryGroup.templates.length) {
      payload.categories.push(categoryGroup);
    }
  });

  // Sort each group's templates alphabetically by name
  payload.categories.forEach((category) => {
    category.templates = category.templates.sort(sortByName); // eslint-disable-line
  });

  // Sort each category alphabetically by name
  payload.categories = payload.categories.sort(sortByName); // eslint-disable-line

  return payload;
}

// Sort by alphabtical order
// moveing uncategorized (unidentified) to end
function sortByName(a: any, b: any): number {
  const isAUncategorized: boolean = !a.id; // eslint-disable-line
  const isBUncategorized: boolean = !b.id; // eslint-disable-line
  // If category is not present
  if (a.id && isBUncategorized) {
    return -1;
  }
  if (isAUncategorized && b.id) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  // if they are same
  return 0;
}
