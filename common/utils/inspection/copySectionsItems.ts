import pipe from '../pipe';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

// Copy all items from a source section to belong to
// a target section without updating arguments
export default function copySectionsItems(
  items: Record<string, inspectionTemplateItemModel>,
  updatedItems: Record<string, inspectionTemplateItemModel>,
  sourceSectionId: string,
  targetSectionId: string
): Record<string, inspectionTemplateItemModel> {
  const result = {} as Record<string, inspectionTemplateItemModel>;

  return pipe(
    copySourceItems,
    pointItemsToSource,
    resetAllItemsCommonAttrs,
    resetItemsMainInputValues,
    resetItemsTextInputValues,
    resetItemsNoteInputValues,
    resetItemsSignatureInputValues
  )(result, items, updatedItems, sourceSectionId, targetSectionId);
}

// Deep copy all items from a specified source section
function copySourceItems(
  result: Record<string, inspectionTemplateItemModel>,
  items: Record<string, inspectionTemplateItemModel>,
  updatedItems: Record<string, inspectionTemplateItemModel>,
  sourceSectionId: string
): Record<string, inspectionTemplateItemModel> {
  // Current item state
  const currentItems = Object.keys(items).filter(
    (id) => items[id].sectionId === sourceSectionId
  );

  // Local item, unpublished, state
  const localUpdates = Object.keys(updatedItems).filter(
    (id) => updatedItems[id].sectionId === sourceSectionId
  );

  // find updated section's items
  const itemsToClone = currentItems.length ? currentItems : localUpdates;

  // Deep clone matched items
  itemsToClone.forEach((id) => {
    const item = items[id] || updatedItems[id];
    result[id] = JSON.parse(JSON.stringify(item));
    delete result[id].id;
  });

  return result;
}

// Point all final items to new target section
function pointItemsToSource(
  result: Record<string, inspectionTemplateItemModel>,
  items: Record<string, inspectionTemplateItemModel>,
  u: Record<string, inspectionTemplateItemModel>,
  s: string,
  targetSectionId: string
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    result[id].sectionId = targetSectionId;
  });

  return result;
}

// Reset item attributes common to all
// inspection item types
function resetAllItemsCommonAttrs(
  result: Record<string, inspectionTemplateItemModel>
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    const item = result[id];

    // Sanity check
    if (item.id) {
      delete item.id;
    }

    // Remove any admin edits
    if (item.adminEdits) {
      delete item.adminEdits;
    }

    // Reset deficient
    if (typeof item.deficient === 'boolean') {
      item.deficient = false;
    }

    // Reset item NA
    if (typeof item.isItemNA === 'boolean') {
      item.isItemNA = false;
    }

    // Reset Inspector Notes
    if (typeof item.inspectorNotes === 'string') {
      item.inspectorNotes = '';
    }

    // Reset photo data
    if (item.photosData) {
      delete item.photosData;
    }
  });

  return result;
}

// Reset all main input items to their defaults
function resetItemsMainInputValues(
  result: Record<string, inspectionTemplateItemModel>
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    const item = result[id];
    const isMain =
      ['signature', 'text_input'].includes(item.itemType) === false &&
      !item.isTextInputItem; // ignore signature & text_input
    const isNotNote =
      `${item.mainInputType || ''}`.toLowerCase() !== 'oneaction_notes';

    if (isMain && isNotNote) {
      item.mainInputSelection = -1;
      item.mainInputSelected = false;
    }
  });

  return result;
}

// Reset all text input items to their defaults
function resetItemsTextInputValues(
  result: Record<string, inspectionTemplateItemModel>
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    const item = result[id];
    const isText = item.itemType === 'text_input' || item.isTextInputItem;
    const isNotNote =
      `${item.mainInputType || ''}`.toLowerCase() !== 'oneaction_notes';

    if (isText && isNotNote) {
      item.textInputValue = '';
    }
  });

  return result;
}

// Reset all note input items to their defaults
function resetItemsNoteInputValues(
  result: Record<string, inspectionTemplateItemModel>
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    const item = result[id];
    if (
      item.itemType !== 'text_input' &&
      !item.isTextInputItem &&
      `${item.mainInputType || ''}`.toLowerCase() === 'oneaction_notes'
    ) {
      item.mainInputNotes = '';
    }
  });

  return result;
}

// Reset all signature input items to their defaults
function resetItemsSignatureInputValues(
  result: Record<string, inspectionTemplateItemModel>
): Record<string, inspectionTemplateItemModel> {
  Object.keys(result).forEach((id) => {
    const item = result[id];
    if (item.itemType === 'signature') {
      item.signatureDownloadURL = '';
      item.signatureTimestampKey = '';
    }
  });

  return result;
}
