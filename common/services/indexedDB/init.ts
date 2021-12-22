// db.ts
import Dexie, { Table } from 'dexie';
import UnpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';

export class InitDexie extends Dexie {
  // 'inspectionItemPhotos' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  inspectionItemPhotos!: Table<UnpublishedPhotoDataModal>;

  constructor() {
    super('sparkle-database');
    this.version(1).stores({
      inspectionItemPhotos: 'id, createdAt,caption,inspection,item,photoData' // Primary key and indexed props
    });
  }
}

const db = new InitDexie();
export default db;
