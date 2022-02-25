// db.ts
import Dexie, { Table } from 'dexie';
import UnpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';
import unpublishedSignature from '../../models/inspections/templateItemUnpublishedSignature';
import unpublishedTemplateUpdate from '../../models/inspections/unpublishedTemplateUpdate';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';
import DeficientItemLocalPhotos from '../../models/deficientItems/unpublishedPhotos';

export class InitDexie extends Dexie {
  // 'inspectionItemPhotos' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  inspectionItemPhotos!: Table<UnpublishedPhotoDataModal>;

  inspectionSignature!: Table<unpublishedSignature>;

  inspectionTemplateUpdates!: Table<unpublishedTemplateUpdate>;

  deficientItemUpdates!: Table<DeficientItemLocalUpdates>;

  deficientItemPhotos!: Table<DeficientItemLocalPhotos>;

  constructor() {
    super('sparkle-database');
    // each time we update or add table, we need to update version to upgrade database
    this.version(6).stores({
<<<<<<< HEAD
      inspectionItemPhotos: 'id, createdAt,inspection,item,property', // Primary key and indexed props

      inspectionSignature: 'id, createdAt,inspection,item,property', // Primary key and indexed props

      inspectionTemplateUpdates: 'id, inspection, property', // Primary key and indexed props

      deficientItemUpdates: `id,createdAt, property, inspection, deficiency`, // Primary key and indexed props

      deficientItemPhotos: `id, createdAt,property,deficiency,inspection, item` // Primary key and indexed props
=======
      inspectionItemPhotos: 'id, createdAt, inspection, item, property', // Primary key and indexed props

      inspectionSignature: 'id, createdAt, inspection, item, property', // Primary key and indexed props

      inspectionTemplateUpdates: 'id, inspection, property', // Primary key and indexed props

      deficientItemUpdates: 'id, createdAt, property, inspection, deficiency', // Primary key and indexed props

      deficientItemPhotos:
        'id, createdAt, property, deficiency, inspection, item' // Primary key and indexed props
>>>>>>> 9ef84cae8bee0d9a286bdc13f2ed6a7606bdb4c0
    });
  }
}

const db = new InitDexie();
export default db;
