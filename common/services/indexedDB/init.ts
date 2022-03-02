// db.ts
import Dexie, { Table } from 'dexie';
import UnpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';
import unpublishedSignature from '../../models/inspections/templateItemUnpublishedSignature';
import unpublishedTemplateUpdate from '../../models/inspections/unpublishedTemplateUpdate';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';
import DeficientItemLocalPhotos from '../../models/deficientItems/unpublishedPhotos';
import TemplateModel from '../../models/template';

export class InitDexie extends Dexie {
  // 'inspectionItemPhotos' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  inspectionItemPhotos!: Table<UnpublishedPhotoDataModal>;

  inspectionSignature!: Table<unpublishedSignature>;

  inspectionTemplateUpdates!: Table<unpublishedTemplateUpdate>;

  deficientItemUpdates!: Table<DeficientItemLocalUpdates>;

  deficientItemPhotos!: Table<DeficientItemLocalPhotos>;

  templateUpdates!: Table<TemplateModel>;

  constructor() {
    super('sparkle-database');
    // each time we update or add table, we need to update version to upgrade database
    this.version(7).stores({
      // Primary key and indexed props for all tables
      inspectionItemPhotos: 'id, createdAt, inspection, item, property',

      inspectionSignature: 'id, createdAt, inspection, item, property',

      inspectionTemplateUpdates: 'id, inspection, property',

      deficientItemUpdates: 'id, createdAt, property, inspection, deficiency',

      deficientItemPhotos:
        'id, createdAt, property, deficiency, inspection, item',

      templateUpdates: 'id'
    });
  }
}

const db = new InitDexie();
export default db;
