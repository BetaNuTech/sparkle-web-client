import pipe from '../pipe';
import copySectionsItems from './copySectionsItems';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';
import inspectionTemplateSectionModel from '../../models/inspectionTemplateSection';
import deepmerge from '../deepmerge';
import uuid from '../uuidv4'; // eslint-disable-line

export interface userUpdate {
  cloneOf: string;
}

interface composableSettings {
  updatedTemplate: inspectionTemplateUpdateModel | null;
  currentTemplate: inspectionTemplateUpdateModel | null;
  userChanges: userUpdate;
  targetId: string;
}

const PREFIX = 'utils: inspection: updateTemplateSection:';

// Manage local updates to inspection section
export default function updateTemplateSection(
  updatedTemplate: inspectionTemplateUpdateModel | null,
  currentTemplate: inspectionTemplateUpdateModel | null,
  userChanges: userUpdate | null,
  targetId: string
): inspectionTemplateUpdateModel {
  const changeCount = Object.keys(userChanges || {}).length;

  if (userChanges && changeCount < 1) {
    throw Error(`${PREFIX} only one change can be provided`);
  }

  // Apply user changes
  return pipe(
    mergePreviousUpdates,
    setAddedMultiSection,
    setRemovedMultiSection
  )(
    {} as inspectionTemplateUpdateModel, // result
    {
      updatedTemplate,
      currentTemplate,
      userChanges,
      targetId
    } as composableSettings
  );
}

// Merge any prior updates
// into the final results
function mergePreviousUpdates(
  result: inspectionTemplateUpdateModel,
  settings: composableSettings
): inspectionTemplateUpdateModel {
  const { updatedTemplate } = settings;
  if (!updatedTemplate) return result;

  if (updatedTemplate.sections) {
    result.sections = JSON.parse(JSON.stringify(updatedTemplate.sections));
  }

  if (updatedTemplate.items) {
    result.items = JSON.parse(JSON.stringify(updatedTemplate.items));
  }

  return result;
}

// Clone an existing ecction
function setAddedMultiSection(
  result: inspectionTemplateUpdateModel,
  settings: composableSettings
): inspectionTemplateUpdateModel {
  const { currentTemplate, updatedTemplate, userChanges } = settings;
  const isCloningSection = userChanges && Boolean(userChanges.cloneOf);
  const sections = currentTemplate.sections || {};
  const previousSections = updatedTemplate.sections || {};

  if (!isCloningSection) {
    return result;
  }

  const sectionTarget =
    sections[userChanges.cloneOf] ||
    previousSections[userChanges.cloneOf] ||
    null;
  if (!sectionTarget) {
    throw Error(
      `${PREFIX} invalid section clone target: "${userChanges.cloneOf}"`
    );
  }

  // Setup sections & items
  result.items = result.items || {};
  result.sections = result.sections || {};

  // Clone seection
  const newSectionId = uuid(20);
  const clonedSection = JSON.parse(
    JSON.stringify(sectionTarget)
  ) as inspectionTemplateSectionModel;
  delete clonedSection.id;
  clonedSection.index += 1;
  clonedSection.added_multi_section = true;
  result.sections[newSectionId] = clonedSection; // Add a new section at random ID

  // Increment section indexes
  const mergedSections = deepmerge(sections, previousSections);
  const updatedSections = updateSectionIndexes(
    mergedSections,
    clonedSection.index
  );

  // Merge section index updates into results
  Object.keys(updatedSections).forEach((id) => {
    result.sections[id] =
      result.sections[id] || ({} as inspectionTemplateSectionModel); // setup
    const section = result.sections[id];
    const updatedSection = updatedSections[id];

    if (section.index !== updatedSection.index) {
      result.sections[id].index = updatedSection.index;
    }
  });

  // Create Multi Section's items
  // cloned and refered to pristine state
  const clonedItems = copySectionsItems(
    currentTemplate.items || {},
    updatedTemplate.items || {},
    userChanges.cloneOf,
    newSectionId
  );

  // Give new ID's to cloned items
  // and add them to the result items
  Object.keys(clonedItems).forEach((id) => {
    const newItemId = uuid();
    result.items[newItemId] = clonedItems[id];
    delete result.items[newItemId].id;
  });

  return result;
}

function setRemovedMultiSection(
  result: inspectionTemplateUpdateModel,
  settings: composableSettings
): inspectionTemplateUpdateModel {
  const { currentTemplate, updatedTemplate, userChanges, targetId } = settings;
  const isRemovingSection = !userChanges;
  const currentSections = currentTemplate.sections || {};
  const sections = {
    ...currentSections,
    ...(updatedTemplate.sections || {})
  };
  const sectionToRemove =
    (updatedTemplate.sections || {})[targetId] ||
    (currentTemplate.sections || {})[targetId] ||
    null;

  if (!isRemovingSection) {
    return result;
  }

  if (!sectionToRemove) {
    throw Error(`${PREFIX} invalid section removal ID provided: "${targetId}"`);
  }

  // Setup section updates
  result.sections = result.sections || {};

  // Decrement section indexes
  const updatedSections = updateSectionIndexes(
    sections,
    sectionToRemove.index,
    -1
  );

  // Merge section index updates into results
  Object.keys(updatedSections).forEach((id) => {
    result.sections[id] =
      result.sections[id] || ({} as inspectionTemplateSectionModel); // setup
    const section = result.sections[id];
    const updatedSection = updatedSections[id];

    if (section.index !== updatedSection.index) {
      result.sections[id].index = updatedSection.index;
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
}

// Increment/Decrement the index of each
// Inspection section by defined increment
function updateSectionIndexes(
  sections: Record<string, inspectionTemplateSectionModel>,
  startIndex = 0,
  incrementBy = 1
): Record<string, inspectionTemplateSectionModel> {
  const result = {};
  Object.keys(sections).forEach((id) => {
    const section = JSON.parse(
      JSON.stringify(sections[id])
    ) as inspectionTemplateSectionModel;
    const { index = 0 } = section || {};

    // Update record index without creating negative index
    if (index >= startIndex && index + incrementBy > -1) {
      section.index += incrementBy;
      result[id] = section;
    }
  });

  // Return result copy
  return result;
}
