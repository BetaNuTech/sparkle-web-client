// db.ts
import Dexie, { Table } from 'dexie';
import UnpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';
import unpublishedSignature from '../../models/inspections/templateItemUnpublishedSignature';
import unpublishedTemplateUpdate from '../../models/inspections/unpublishedTemplateUpdate';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';

export class InitDexie extends Dexie {
  // 'inspectionItemPhotos' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  inspectionItemPhotos!: Table<UnpublishedPhotoDataModal>;

  inspectionSignature!: Table<unpublishedSignature>;

  inspectionTemplateUpdates!: Table<unpublishedTemplateUpdate>;

  deficientItemUpdates!: Table<DeficientItemLocalUpdates>;

  constructor() {
    super('sparkle-database');
    // each time we update or add table, we need to update version to upgrade database
    this.version(4).stores({
      inspectionItemPhotos:
        'id, createdAt,caption,inspection,item,photoData,property,size', // Primary key and indexed props
      inspectionSignature:
        'id, createdAt,inspection,item,signature,property,size', // Primary key and indexed props
      inspectionTemplateUpdates: 'id, inspection, property, template', // Primary key and indexed props

      deficientItemUpdates: `id,createdAt, property, inspection, deficiency, state, currentDueDate, 
        currentReasonIncomplete, currentDeferredDate, currentPlanToFix, 
        currentCompleteNowReason, currentResponsibilityGroup, currentStartDate` // Primary key and indexed props
    });
  }
}

const db = new InitDexie();
export default db;
