import pipe from '../pipe';
import copySectionsItems from './copySectionsItems';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateSectionModel from '../../models/inspectionTemplateSection';
import uuid from '../uuidv4'; // eslint-disable-line

export interface userUpdate {
  id?: string;
  cloneOf?: string;
}

interface composableSettings {
  updatedTemplate: inspectionTemplateModel | null;
  currentTemplate: inspectionTemplateModel | null;
  userChanges: userUpdate;
}

const PREFIX = 'utils: inspection: updateTemplateSection:';

// Manage local updates to inspection section
export default function updateTemplateSection(
  updatedTemplate: inspectionTemplateModel | null,
  currentTemplate: inspectionTemplateModel | null,
  userChanges: userUpdate | null
): inspectionTemplateModel {
  const changeCount = Object.keys(userChanges).length;

  if (changeCount < 1) {
    throw Error(`${PREFIX} only one change can be provided`);
  }

  // Apply user changes
  return pipe(
    mergePreviousUpdates,
    setAddedMultiSection
    // setRemovedMultiSection,
  )(
    {} as inspectionTemplateModel, // result
    {
      updatedTemplate,
      currentTemplate,
      userChanges
    } as composableSettings
  );
}

// Merge any prior updates
// into the final results
function mergePreviousUpdates(
  result: inspectionTemplateModel,
  settings: composableSettings
): inspectionTemplateModel {
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
  result: inspectionTemplateModel,
  settings: composableSettings
): inspectionTemplateModel {
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
  const newSectionId = uuid();
  const clonedSection = JSON.parse(
    JSON.stringify(sectionTarget)
  ) as inspectionTemplateSectionModel;
  delete clonedSection.id;
  clonedSection.index += 1;
  clonedSection.added_multi_section = true;
  result.sections[newSectionId] = clonedSection; // Add a new section at random ID

  // Increment section indexes
  const updatedSections = updateSectionIndexes(sections, clonedSection.index);

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
    const { index } = section;

    // Update record index without creating negative index
    if (index >= startIndex && index + incrementBy > -1) {
      section.index += incrementBy;
      result[id] = section;
    }
  });

  // Return result copy
  return result;
}
