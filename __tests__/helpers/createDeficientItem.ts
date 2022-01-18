import {
  deficientItemStateOrder,
  deficientItemResponsibilityGroups
} from '../../config/deficientItems';
import inspectionsConfig from '../../config/inspections';
import DeficientItemModel from '../../common/models/deficientItem';
import StateHistory from '../../common/models/deficientItems/deficientItemStateHistory';
import PlansToFix from '../../common/models/deficientItems/deficientItemPlansToFix';
import CompleteNowReason from '../../common/models/deficientItems/deficientItemCompleteNowReason';
import ResponsibilityGroup from '../../common/models/deficientItems/deficientItemResponsibilityGroup';
import DueDate from '../../common/models/deficientItems/deficientItemDueDate';
import DeferredDate from '../../common/models/deficientItems/deficientItemDeferredDate';
import ProgressNote from '../../common/models/deficientItems/deficientItemProgressNote';
import CompletedPhoto from '../../common/models/deficientItems/deficientItemCompletedPhoto';
import ReasonIncomplete from '../../common/models/deficientItems/deficientItemReasonIncomplete';

const SRC_ITEM_TYPES = Object.keys(inspectionsConfig.inspectionValueNames);
const SRC_ITEM_VALUES = inspectionsConfig.inspectionValueNames;
const DI_STATES = [...deficientItemStateOrder];
const RESPONSIBILITY_GROUP_VALUES = deficientItemResponsibilityGroups.map(
  ({ value }) => value
);
const PLANS_TO_FIX = ['work on it', 'do it', 'clean exterior', 'power wash'];
const PROGRESS_NOTES = ['looks better', 'okay', 'back to square one', 'woah'];
const DOWNLOAD_URL = [
  /* eslint-disable max-len */
  'https://firebasestorage.googleapis.com/v0/b/storage.appspot.com/o/deficientItemImagesStaging%2F-KYLYDoEoEwbxJ5AjWaX%2F-Lchlj4YikI6eqsNt4SN%2F-LecC3gBBXWfCE6RaTYi.jpg?alt=media&token=4620580c-f6dc-445d-8f65-b684f813f22f',
  'https://firebasestorage.googleapis.com/v0/b/storage.appspot.com/o/deficientItemImagesStaging%2F-KYLYDoEoEwbxJ5AjWaX%2F-LcY0VWdyHk-0-ZXaPYL%2F-LeIhwmEVX3K3G8IIapY.jpg?alt=media&token=c7d56117-fce6-47ca-99f7-a775f8227439',
  'https://firebasestorage.googleapis.com/v0/b/storage.appspot.com/o/deficientItemImagesStaging%2F-KYLYDoEoEwbxJ5AjWaX%2F-LcY0VWdyHk-0-ZXaPYL%2F-Lec5UCvoLdQ3Ig3VLhh.jpg?alt=media&token=833dca41-9995-48b9-bd45-dc7c52557f2f'
  /* eslint-enable max-len */
];
const STORAGE_PATH = [
  'deficientItemImagesStaging/-KYLYDoEoEwbxJ5AjWaX/-Lchlj4YikI6eqsNt4SN/-LecC3gBBXWfCE6RaTYi.jpg',
  'deficientItemImagesStaging/-KYLYDoEoEwbxJ5AjWaX/-LcY0VWdyHk-0-ZXaPYL/-LeIhwmEVX3K3G8IIapY.jpg',
  'deficientItemImagesStaging/-KYLYDoEoEwbxJ5AjWaX/-LcY0VWdyHk-0-ZXaPYL/-Lec5UCvoLdQ3Ig3VLhh.jpg'
];

const DEFAULT = Object.freeze({
  createdAt: 1555029625,
  updatedAt: 1555511726,
  inspection: '',
  item: '',
  property: '',
  archive: false,
  startDates: null,
  currentStartDate: 1555511726,
  stateHistory: null,
  state: '',
  dueDates: null,
  currentDueDate: 1556462117,
  plansToFix: null,
  currentPlanToFix: '',
  responsibilityGroups: null,
  currentResponsibilityGroup: '',
  progressNotes: null,
  reasonsIncomplete: null,
  currentReasonIncomplete: null,
  completedPhotos: null,
  itemDataLastUpdatedDate: 1555029625,
  sectionTitle: 'Section Test',
  sectionSubtitle: null,
  sectionType: 'single',
  itemAdminEdits: null,
  itemInspectorNotes: null,
  itemTitle: 'Item Title',
  itemMainInputType: '',
  itemMainInputSelection: 0,
  hasItemPhotoData: false
});

const uuid = (() => {
  let i = 0;
  return () => {
    i += 1;
    return `${i}`;
  };
})();

interface Traits {
  multi?: string;
  stateHistory?: number;
  stateHistoryUser?: string;
  plansToFix?: number;
  plansToFixUser?: string;
  completeNowReasons?: number;
  completeNowReasonsUser?: string;
  responsibilityGroups?: number;
  responsibilityGroupsUser?: string;
  progressNotes?: number;
  progressNotesUser?: string;
  dueDates?: number;
  dueDatesUser?: string;
  deferredDates?: number;
  deferredDatesUser?: string;
  completedPhotos?: number;
  completedPhotosUser?: string;
  reasonsIncomplete?: number;
  reasonsIncompleteUser?: string;
}

// Generate a mock Deficient Item instance
export default function createDeficientItem(
  config = {},
  traits: Traits = {}
): DeficientItemModel {
  const createdAt = Math.round(Date.now() / 1000) - 10000;
  const itemMainInputType = getRandom(SRC_ITEM_TYPES);
  const srcItemValues = SRC_ITEM_VALUES[itemMainInputType];
  const sectionSubtitle = traits.multi ? traits.multi : '';

  const settings = {
    createdAt,
    updatedAt: createdAt,
    inspection: uuid(),
    item: uuid(),
    property: uuid(),
    state: 'requires-action', // default
    currentStartDate: createdAt,
    currentDueDate: createdAt + 100000,
    itemDataLastUpdatedDate: createdAt,
    itemMainInputType, // randomize
    hasItemPhotoData: false,
    itemMainInputSelection: srcItemValues.indexOf(getRandom(srcItemValues)), // randomize
    sectionType: traits.multi ? 'multi' : 'single',
    sectionSubtitle,
    ...config
  } as DeficientItemModel;

  const result = { ...DEFAULT, ...settings };

  // Add state history trait
  if (traits.stateHistory) {
    const historyCount = traits.stateHistory > 0 ? traits.stateHistory : 1;
    result.stateHistory = createStateHistoryTree(
      historyCount,
      traits.stateHistoryUser || ''
    );
  }

  // Add plans to fix trait
  if (traits.plansToFix) {
    const plansToFixCount = traits.plansToFix > 0 ? traits.plansToFix : 1;
    result.plansToFix = createPlansToFixTree(
      result.currentDueDate,
      plansToFixCount,
      traits.plansToFixUser || ''
    );
  }

  // Add complete now reasons trait
  if (traits.completeNowReasons) {
    const completeNowReasonsCount =
      traits.completeNowReasons > 0 ? traits.completeNowReasons : 1;
    result.completeNowReasons = createCompleteNowReasonsTree(
      completeNowReasonsCount,
      traits.completeNowReasonsUser || ''
    );
  }

  // Add responsibility groups trait
  if (traits.responsibilityGroups) {
    const responsibleGroupsCount =
      traits.responsibilityGroups > 0 ? traits.responsibilityGroups : 1;
    result.responsibilityGroups = createGroupsResponsibleTree(
      result.currentDueDate,
      responsibleGroupsCount,
      traits.responsibilityGroupsUser || ''
    );
  }

  // Add progress notes trait
  if (traits.progressNotes) {
    const progressNotesCount =
      traits.progressNotes > 0 ? traits.progressNotes : 1;
    result.progressNotes = createProgressNotesTree(
      result.currentDueDate,
      progressNotesCount,
      traits.progressNotesUser || ''
    );
  }

  // Add Due Dates trait
  if (traits.dueDates) {
    const dueDatesCount = traits.dueDates > 0 ? traits.dueDates : 1;
    result.dueDates = createDueDatesTree(
      result.currentDueDate,
      dueDatesCount,
      traits.dueDatesUser || ''
    );
  }

  // Add Defer Dates trait
  if (traits.deferredDates) {
    const deferDatesCount = traits.deferredDates > 0 ? traits.deferredDates : 1;
    result.deferredDates = createDeferDatesTree(
      result.currentDeferredDate || result.currentDueDate,
      deferDatesCount,
      traits.deferredDatesUser || ''
    );
  }

  // Add Completed Photos trait
  if (traits.completedPhotos) {
    const completedPhotosCount =
      traits.completedPhotos > 0 ? traits.completedPhotos : 1;
    result.completedPhotos = createCompletedPhotosTree(
      result.currentDueDate,
      completedPhotosCount,
      traits.completedPhotosUser || ''
    );
  }

  // Add Reasons Incomplete
  if (traits.reasonsIncomplete) {
    const reasonsIncompleteCount =
      traits.reasonsIncomplete > 0 ? traits.reasonsIncomplete : 1;
    result.reasonsIncomplete = createReasonsIncompleteTree(
      result.currentDueDate,
      reasonsIncompleteCount,
      traits.reasonsIncompleteUser || ''
    );
  }

  return result;
}

// Get a random item in array
function getRandom(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Create a state history instance
// from a deficiency item
function createStateHistoryTree(
  count = 1,
  user = ''
): Record<string, StateHistory> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      state: getRandom(DI_STATES),
      createdAt: Math.round((now + 1) / 1000) // UNIX timestamp
    };

    // Add optional user to history state
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a previous plans to fix
// tree from current due date
function createPlansToFixTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, PlansToFix> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      planToFix: getRandom(PLANS_TO_FIX),
      startDate: currentDueDate - i * 10000,
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a previous complete now reason
// tree from current due date
function createCompleteNowReasonsTree(
  count = 1,
  user = ''
): Record<string, CompleteNowReason> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      completeNowReason: getRandom(PLANS_TO_FIX),
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a previous groups
// responsible history tree
function createGroupsResponsibleTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, ResponsibilityGroup> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      groupResponsible: getRandom(RESPONSIBILITY_GROUP_VALUES),
      startDate: currentDueDate - i * 10000,
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a previous due
// dates history tree
function createDueDatesTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, DueDate> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      dueDate: currentDueDate - i * 5000,
      startDate: currentDueDate - i * 10000,
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a previous defer
// dates history tree
function createDeferDatesTree(
  currentDeferredDate: number,
  count = 1,
  user = ''
): Record<string, DeferredDate> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      deferredDate: currentDeferredDate - i * 5000,
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a progress notes
// history tree
function createProgressNotesTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, ProgressNote> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      startDate: currentDueDate - i * 10000,
      progressNote: getRandom(PROGRESS_NOTES),
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a completed photos history tree
export function createCompletedPhotosTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, CompletedPhoto> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      caption: getRandom(PROGRESS_NOTES),
      startDate: currentDueDate - i * 10000,
      downloadURL: getRandom(DOWNLOAD_URL),
      storageDBPath: getRandom(STORAGE_PATH),
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create a reasons incomplete history tree
function createReasonsIncompleteTree(
  currentDueDate: number,
  count = 1,
  user = ''
): Record<string, ReasonIncomplete> {
  const now = Date.now();
  const result = Object.create(null);

  for (let i = 0; i < count; i += 1) {
    const id = uuid();
    result[id] = {
      startDate: currentDueDate - i * 10000,
      reasonIncomplete: getRandom(PROGRESS_NOTES),
      createdAt: Math.round((now + i) / 1000) // UNIX timestamp
    };

    // Add optional user reference
    if (user) {
      result[id].user = user;
    }
  }

  return result;
}

// Create API response record
export function toNormalized(deficientItem: DeficientItemModel): any {
  if (!deficientItem.id) {
    throw Error('toNormalized requires a deficiency with an ID');
  }

  const attributes = JSON.parse(JSON.stringify(deficientItem));
  delete attributes.id;

  return {
    id: deficientItem.id,
    type: 'deficient-item',
    attributes
  };
}
