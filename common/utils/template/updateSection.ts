import pipe from '../pipe';
import TemplateModel from '../../models/template';
import TemplateSectionModel from '../../models/inspectionTemplateSection';
import {
  ComposableSectionSettings,
  UserSectionChanges
} from './composableSettings';
import { uuid } from '../uuidv4';
import deepClone from '../deepClone';
import updateIndexes, {
  mergeIndexedRecords,
  removeAtIndex
} from './updateIndexes';

// Manage local updates for template section
export default function updateSection(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel,
  userChanges: UserSectionChanges,
  targetId: string
): TemplateModel {
  return pipe(
    mergePreviousUpdates,
    setAddedSection,
    setRemovedSection,
    setSectionTitle,
    setSectionType,
    setSectionIndex,
    clearEmptyRecords
  )(
    {} as TemplateModel, // result
    {
      updatedTemplate,
      currentTemplate,
      userChanges,
      targetId
    } as ComposableSectionSettings
  );
}

// Merge any prior updates
// into the final results
const mergePreviousUpdates = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { updatedTemplate } = settings;
  result.sections = {};

  if (updatedTemplate) {
    result = deepClone(updatedTemplate); // eslint-disable-line no-param-reassign
    result.sections = deepClone(updatedTemplate.sections || {});
  }

  return result;
};

// Add new section into template updates
const setAddedSection = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate } = settings;
  const isAddingSection =
    userChanges && typeof userChanges?.new === 'boolean' && userChanges?.new;
  const currentSections = currentTemplate.sections || {};
  const previousSections = updatedTemplate.sections || {};

  if (!isAddingSection) {
    return result;
  }

  const sectionsCount = Object.keys({
    ...currentSections,
    ...previousSections
  }).filter((id, i, arr) => arr.indexOf(id) === i).length; // unique

  const sectionId = uuid(20);
  const section = {
    section_type: 'single',
    title: '',
    index: sectionsCount
  };

  result.sections = result.sections || {};
  result.sections[sectionId] = section;

  return result;
};

// Remove section from template updates
// along with any associated items
const setRemovedSection = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isRemovingSection = userChanges === null;

  if (!isRemovingSection) {
    return result;
  }

  const currentSections = deepClone(currentTemplate.sections || {});
  const previousSections = deepClone(updatedTemplate.sections || {});
  const mergedIndexes = mergeIndexedRecords(currentSections, previousSections);
  const removeTargetIndex = mergedIndexes[targetId]?.index;
  // Item delete update
  if (currentSections[targetId]) {
    result.sections[targetId] = null; // publish removal
  } else {
    delete result.sections[targetId]; // delete local update only
  }

  // Decrement section indexes
  const updatedIndexes = removeAtIndex(mergedIndexes, removeTargetIndex);

  // Merge indirectly updated section
  // indexes into results
  Object.keys(updatedIndexes).forEach((id) => {
    const newIndex = updatedIndexes[id].index;
    const currentIndex = (currentSections[id] || {}).index;
    const previousIndex = (previousSections[id] || {}).index;

    // Update section index
    if (newIndex !== previousIndex) {
      result.sections[id] = result.sections[id] || ({} as TemplateSectionModel);
      result.sections[id].index = newIndex;
    }

    // Remove index matching current (remote) state
    if (result.sections[id] && result.sections[id].index === currentIndex) {
      delete result.sections[id].index;
    }
  });

  const currentItems = deepClone(currentTemplate.items || {});
  const previousItems = deepClone(updatedTemplate.items || {});
  const itemIds = [...Object.keys(currentItems), ...Object.keys(previousItems)];

  // Delete any section items
  // from resulting local updates
  itemIds
    // unique
    .filter((itemId, i, arr) => arr.indexOf(itemId) === i)
    // Only items belonging to section
    .filter((itemId) => {
      const previousItem = previousItems[itemId] || {};
      const currentItem = currentItems[itemId] || {};
      const sectionId = previousItem.sectionId || currentItem.sectionId;
      return sectionId === targetId;
    })
    .forEach((itemId) => {
      if (currentItems[itemId]) {
        result.items = result.items || {};
        result.items[itemId] = null; // publish removal
      } else if (result.items) {
        delete result.items[itemId]; // delete local update only
      }
    });

  return result;
};

const setSectionTitle = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentSections = currentTemplate.sections || {};
  const currentSection = currentSections[targetId] || {};
  const isChanging = targetId && typeof userChanges?.title === 'string';

  if (!isChanging) {
    return result;
  }

  const value = `${userChanges?.title || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentSection.title || '');
  // Add publishable changes
  // or remove local only updates
  if (isDifferentThanCurrent) {
    result.sections[targetId] =
      result.sections[targetId] || ({} as TemplateSectionModel);
    result.sections[targetId].title = value;
  } else if (result.sections[targetId]) {
    delete result.sections[targetId].title;
  }

  return result;
};

const setSectionType = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentSections = currentTemplate.sections || {};
  const currentSection = currentSections[targetId] || {};
  const isChanging =
    targetId &&
    userChanges &&
    userChanges.section_type &&
    typeof userChanges.section_type === 'string';

  if (!isChanging) {
    return result;
  }

  const value = userChanges.section_type;
  const isDifferentThanCurrent = value !== currentSection.section_type;

  // Add publishable changes
  // or remove local only updates
  if (isDifferentThanCurrent) {
    result.sections[targetId] =
      result.sections[targetId] || ({} as TemplateSectionModel);
    result.sections[targetId].section_type = value;
  } else if (result.sections[targetId]) {
    delete result.sections[targetId].section_type;
  }

  return result;
};

const setSectionIndex = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isChanging = targetId && typeof userChanges?.index === 'number';

  if (!isChanging) {
    return result;
  }

  // Increment section indexes
  const currentSections = deepClone(currentTemplate.sections || {});
  const previousSections = deepClone(updatedTemplate.sections || {});
  const mergedIndexes = mergeIndexedRecords(currentSections, previousSections);
  const updatedIndexes = updateIndexes(
    mergedIndexes,
    userChanges.index,
    targetId
  );

  // Merge all index updates into results
  Object.keys(updatedIndexes).forEach((id) => {
    const newIndex = updatedIndexes[id].index;
    const currentIndex = (currentSections[id] || {}).index;
    const previousIndex = (previousSections[id] || {}).index;

    // Update index
    if (newIndex !== previousIndex) {
      result.sections[id] = result.sections[id] || ({} as TemplateSectionModel);
      result.sections[id].index = newIndex;
    }

    // Remove index matching current
    if (result.sections[id] && result.sections[id].index === currentIndex) {
      delete result.sections[id].index;
    }
  });

  return result;
};

const clearEmptyRecords = (result: TemplateModel) => {
  // Remove empty section updates
  Object.keys(result.sections || {}).forEach((id) => {
    if (
      result.sections[id] !== null && // keep publishable deletes
      Object.keys(result.sections[id]).length === 0
    ) {
      delete result.sections[id];
    }
  });

  // Remove empty item updates
  Object.keys(result.items || {}).forEach((id) => {
    if (
      result.items[id] !== null && // keep publishable deletes
      Object.keys(result.items[id]).length === 0
    ) {
      delete result.items[id];
    }
  });

  return result;
};
