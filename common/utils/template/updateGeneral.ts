import pipe from '../pipe';
import TemplateModel from '../../models/template';
import ComposableSettings, { UserChanges } from './composableSettings';

const PREFIX = 'utils: template: updateGeneral';

// Manage local updates for template's general settings
export default function updateGeneral(
  updatedItem: TemplateModel,
  currentItem: TemplateModel,
  userChanges: UserChanges
): TemplateModel {
  return pipe(
    setName,
    setDescription,
    setCategory,
    setTrackDeficientItem,
    setRequireDeficientItemNoteAndPhoto
  )(
    {} as TemplateModel, // result
    {
      updatedItem,
      currentItem,
      userChanges
    } as ComposableSettings
  );
}

// Set template name
const setName = (result: TemplateModel, settings: ComposableSettings) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.name === 'string';
  const hasPreviousUpdate = typeof updatedItem.name === 'string';
  const value = `${userChanges.name || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentItem.name || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.name = updatedItem.name;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.name = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.name;
  }

  return result;
};

// Set template description
const setDescription = (
  result: TemplateModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.description === 'string';
  const hasPreviousUpdate = typeof updatedItem.description === 'string';
  const value = `${userChanges.description || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentItem.description || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.description = updatedItem.description;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.description = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.description;
  }

  return result;
};

// Set template category
const setCategory = (result: TemplateModel, settings: ComposableSettings) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.category === 'string';
  const hasPreviousUpdate = typeof updatedItem.category === 'string';
  const value = userChanges.category;
  const isDifferentThanCurrent = value !== (currentItem.category || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.category = updatedItem.category;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.category = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.category;
  }

  return result;
};

// Set template trackDeficientItems
const setTrackDeficientItem = (
  result: TemplateModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.trackDeficientItems === 'boolean';
  const hasPreviousUpdate =
    typeof updatedItem.trackDeficientItems === 'boolean';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.trackDeficientItems = updatedItem.trackDeficientItems;
  }

  // Add user unselected change to updates
  if (
    isChanging &&
    userChanges.trackDeficientItems !== currentItem.trackDeficientItems
  ) {
    result.trackDeficientItems = userChanges.trackDeficientItems;
  } else if (isChanging) {
    delete result.trackDeficientItems;
  }

  // if user updating trackDeficientItems to true
  // and requireDeficientItemNoteAndPhoto is not updated or if its false
  // set requireDeficientItemNoteAndPhoto as true
  if (
    isChanging &&
    userChanges.trackDeficientItems &&
    !updatedItem.requireDeficientItemNoteAndPhoto
  ) {
    result.requireDeficientItemNoteAndPhoto = userChanges.trackDeficientItems;
  }

  return result;
};

// Set template requireDeficientItemNoteAndPhoto
const setRequireDeficientItemNoteAndPhoto = (
  result: TemplateModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging =
    typeof userChanges.requireDeficientItemNoteAndPhoto === 'boolean';
  const hasPreviousUpdate =
    typeof updatedItem.requireDeficientItemNoteAndPhoto === 'boolean';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.requireDeficientItemNoteAndPhoto =
      updatedItem.requireDeficientItemNoteAndPhoto;
  }

  // Add user unselected change to updates
  if (
    isChanging &&
    userChanges.requireDeficientItemNoteAndPhoto !==
      currentItem.requireDeficientItemNoteAndPhoto
  ) {
    result.requireDeficientItemNoteAndPhoto =
      userChanges.requireDeficientItemNoteAndPhoto;
  } else if (isChanging) {
    delete result.requireDeficientItemNoteAndPhoto;
  }

  // if user updating requireDeficientItemNoteAndPhoto to true
  // and trackDeficientItems is not updated or if its false
  // set trackDeficientItems as true
  if (
    isChanging &&
    userChanges.requireDeficientItemNoteAndPhoto &&
    !updatedItem.trackDeficientItems
  ) {
    result.trackDeficientItems = userChanges.requireDeficientItemNoteAndPhoto;
  }

  return result;
};
