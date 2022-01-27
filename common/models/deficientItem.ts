import DeficientItemStartDate from './deficientItems/deficientItemStartDate';
import DeficientItemStateHistory from './deficientItems/deficientItemStateHistory';
import DeficientItemDueDate from './deficientItems/deficientItemDueDate';
import DeficientItemDeferredDate from './deficientItems/deficientItemDeferredDate';
import DeficientItemPlansToFix from './deficientItems/deficientItemPlansToFix';
import DeficientItemResponsibilityGroup from './deficientItems/deficientItemResponsibilityGroup';
import DeficientItemProgressNote from './deficientItems/deficientItemProgressNote';
import DeficientItemReasonIncomplete from './deficientItems/deficientItemReasonIncomplete';
import DeficientItemCompletedPhoto from './deficientItems/deficientItemCompletedPhoto';
import DeficientItemCompleteNowReason from './deficientItems/deficientItemCompleteNowReason';
import DeficientItemAdminEdit from './deficientItems/deficientItemAdminEdit';

interface DeficientItem {
  id?: string;
  createdAt: number; // UNIX timestamp
  updatedAt: number; // UNIX timestamp
  property: string;
  inspection: string;
  item: string;
  startDates?: Record<string, DeficientItemStartDate>;
  currentStartDate?: number; // UNIX timestamp
  stateHistory: Record<string, DeficientItemStateHistory>;
  state: string;
  dueDates?: Record<string, DeficientItemDueDate>;
  currentDueDate?: number; // UNIX timestamp
  currentDueDateDay?: string;
  deferredDates?: Record<string, DeficientItemDeferredDate>;
  currentDeferredDate?: number; // UNIX timestamp
  currentDeferredDateDay?: string;
  plansToFix?: Record<string, DeficientItemPlansToFix>;
  currentPlanToFix?: string;
  responsibilityGroups?: Record<string, DeficientItemResponsibilityGroup>;
  currentResponsibilityGroup?: string;
  progressNotes?: Record<string, DeficientItemProgressNote>;
  progressNote?: string;
  reasonsIncomplete?: Record<string, DeficientItemReasonIncomplete>;
  currentReasonIncomplete?: string;
  completedPhotos?: Record<string, DeficientItemCompletedPhoto>;
  currentCompleteNowReason?: string;
  completeNowReasons?: Record<string, DeficientItemCompleteNowReason>;
  itemDataLastUpdatedDate?: number; // UNIX timestamp
  sectionTitle: string;
  sectionSubtitle: string;
  sectionType: string;
  itemAdminEdits: Record<string, DeficientItemAdminEdit>;
  itemInspectorNotes?: string;
  itemTitle: string;
  itemMainInputType: string;
  itemMainInputSelection: number;
  itemPhotosData?: Record<string, DeficientItemCompletedPhoto>;
  itemScore: number;
  hasItemPhotoData: boolean;
  trelloCardURL?: string;
  willRequireProgressNote: boolean;
  isDuplicate: boolean;
}

export default DeficientItem;
