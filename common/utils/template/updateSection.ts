import pipe from '../pipe';
import TemplateModel from '../../models/template';
import TemplateSectionModel from '../../models/inspectionTemplateSection';
import {
  ComposableSectionSettings,
  UserSectionChanges
} from './composableSettings';
import { uuid } from '../uuidv4';
import deepClone from '../deepClone';
import deepmerge from '../deepmerge';

const PREFIX = 'utils: template: updateSection';

// Manage local updates for template section
export default function updateSection(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel,
  userChanges: UserSectionChanges,
  targetId: string
): TemplateModel {
  const changeCount = Object.keys(userChanges || {}).length;

  if (userChanges && changeCount < 1) {
    throw Error(`${PREFIX} only one change can be provided`);
  }

  return pipe(
    mergePreviousUpdates,
    setAddedSection,
    setRemovedSection,
    setSectionTitle,
    setSectionType,
    setSectionIndex
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
  if (!updatedTemplate) return result;

  if (updatedTemplate.sections) {
    result.sections = deepClone(updatedTemplate.sections || {});
  }

  if (updatedTemplate.items) {
    result.items = deepClone(updatedTemplate.items);
  }
  return result;
};

// Add new section into template updates
const setAddedSection = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate } = settings;
  const isAddingSection = userChanges && Boolean(userChanges?.new);
  const currentSections = currentTemplate.sections || {};
  const previousSections = updatedTemplate.sections || {};
  if (!isAddingSection) {
    return result;
  }

  const sections = {
    ...currentSections,
    ...previousSections
  };

  const section = {
    id: uuid(20),
    added_multi_section: false,
    section_type: 'single',
    title: '',
    index: Object.keys(sections).length
  };

  result.sections = result.sections || {};

  result.sections[section.id] = section;
  return result;
};

// remove section from template updates
const setRemovedSection = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isRemovingSection = !userChanges;
  const currentSections = currentTemplate.sections || {};
  const previousSections = updatedTemplate.sections || {};

  if (!isRemovingSection) {
    return result;
  }

  const sections = {
    ...currentSections,
    ...previousSections
  };
  const sectionToRemove =
    (previousSections || {})[targetId] ||
    (currentSections || {})[targetId] ||
    null;

  if (!sectionToRemove) {
    throw Error(`${PREFIX} invalid section removal ID provided: "${targetId}"`);
  }

  // Setup section updates
  result.sections = result.sections || {};

  // Decrement section indexes
  const updatedSections = updateIndexesOnRemove(
    sections,
    sectionToRemove.index
  );

  // Merge section index updates into results
  Object.keys(updatedSections).forEach((id) => {
    result.sections[id] = result.sections[id] || ({} as TemplateSectionModel); // setup
    const resultSection = result.sections[id];
    const updatedSection = updatedSections[id];

    // Update section index
    if (resultSection.index !== updatedSection.index) {
      resultSection.index = updatedSection.index;
    }
  });

  // Add delete section update
  if (currentSections[targetId]) {
    result.sections[targetId] = null; // publish removal
  } else {
    delete result.sections[targetId]; // ignore update
  }

  // Delete any removed section items
  // from resulting local updates
  Object.keys(result.items || {})
    .filter((itemId) => result.items[itemId].sectionId === targetId)
    .forEach((itemId) => {
      delete result.items[itemId];
    });

  return result;
};

// Set template section title
const setSectionTitle = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const sections = currentTemplate.sections || {};
  const currentSection = sections[targetId] || {};

  const isChanging = targetId && typeof userChanges?.title === 'string';

  if (!isChanging) {
    return result;
  }

  const value = `${userChanges?.title || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentSection.title || '');

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.sections = {
      ...(result.sections || {}),
      [targetId]: { ...(result.sections || {})[targetId], title: value }
    };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.sections || {})[targetId] || {}).title;
  }

  return result;
};

// Set template section type
const setSectionType = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;

  const sections = currentTemplate.sections || {};
  const currentSection = sections[targetId] || {};

  const isChanging = targetId && typeof userChanges?.section_type === 'string';

  if (!isChanging) {
    return result;
  }
  const value = userChanges?.section_type;
  const isDifferentThanCurrent = value !== (currentSection.section_type || '');

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.sections = {
      ...(result.sections || {}),
      [targetId]: { ...(result.sections || {})[targetId], section_type: value }
    };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.sections || {})[targetId] || {}).section_type;
  }

  return result;
};

// Set template section type
const setSectionIndex = (
  result: TemplateModel,
  settings: ComposableSectionSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;

  const sections = currentTemplate.sections || {};
  const previousSections = updatedTemplate.sections || {};

  const isChanging = targetId && typeof userChanges?.index === 'number';

  if (!isChanging) {
    return result;
  }

  const value = userChanges?.index;

  // Add user change to updates
  if (isChanging) {
    result.sections = {
      ...(result.sections || {}),
      [targetId]: { ...(result.sections || {})[targetId], index: value }
    };

    // Increment section indexes
    const mergedSections = deepmerge(sections, previousSections);
    const updatedSections = updateIndexes(mergedSections, value, targetId);

    // Merge section index updates into results
    Object.keys(updatedSections).forEach((id) => {
      result.sections[id] = result.sections[id] || ({} as TemplateSectionModel); // setup
      const resultSection = result.sections[id];
      const updatedSection = updatedSections[id];
      const currentSectionIndex = (sections[id] || {}).index;

      // Update section index
      if (resultSection.index !== updatedSection.index) {
        resultSection.index = updatedSection.index;
      }
      // Remove index matching current
      if (resultSection.index === currentSectionIndex) {
        delete resultSection.index;
      }

      // Remove section without updates
      if (Object.keys(resultSection).length === 0) {
        delete result.sections[id];
      }
    });
  }

  return result;
};

// Increment/Decrement the index of each template
// section base on an updated section index
function updateIndexes(
  sections: Record<string, TemplateSectionModel>,
  srcStartIndex = 0,
  targetId: string
): Record<string, TemplateSectionModel> {
  const result = {};
  const indexToBePlaced = Number(srcStartIndex); // clone
  const indexToBeChanged = sections[targetId].index;

  Object.keys(sections).forEach((key: string) => {
    const section = deepClone(sections[key]) as TemplateSectionModel;
    let indexTarget = indexToBeChanged;
    let isMoving = false;

    // Check if section index is less than updated
    // previous index and it's not before starting index
    if (
      indexToBePlaced < indexToBeChanged &&
      section.index < indexToBeChanged &&
      section.index >= indexToBePlaced
    ) {
      indexTarget = section.index + 1;
      isMoving = true;

      // Check if section index is greater than
      // updated previous index and it's before
      // updated section's new index
    } else if (
      section.index > indexToBeChanged &&
      section.index <= indexToBePlaced
    ) {
      indexTarget = section.index - 1;
      isMoving = true;
    }

    // Check if current section is same as
    // updating section, then assign the
    // updated index
    if (section.id === targetId) {
      indexTarget = indexToBePlaced;
      isMoving = true;
    }

    // Apply updates to results
    if (isMoving) {
      section.index = indexTarget;
      result[key] = section;
    }
  });

  return result;
}

// Decrement indexes proceeding a
// removed section
function updateIndexesOnRemove(
  sections: Record<string, TemplateSectionModel>,
  srcStartIndex = 0
) {
  const result = {};

  Object.keys(sections).forEach((id: string) => {
    const section = deepClone(sections[id]) as TemplateSectionModel;

    if (section.index > srcStartIndex) {
      section.index -= 1;
      result[id] = section;
    }
  });

  return result;
}
