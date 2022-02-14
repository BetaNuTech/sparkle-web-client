import deficientItemModal from '../common/models/deficientItem';
import DeficientItemLocalPhotos from '../common/models/deficientItems/unpublishedPhotos';

export const deficientItem: deficientItemModal = {
  id: 'deficiency-1',
  createdAt: 1620952610,
  updatedAt: 1620952610,
  property: 'property-1',
  inspection: 'inspection-1',
  item: 'item-1',
  stateHistory: {},
  state: 'completed',
  sectionTitle: 'A',
  sectionType: 'single',
  sectionSubtitle: '',
  itemTitle: 'Five',
  itemMainInputType: 'FiveActions_oneToFive',
  itemMainInputSelection: 2,
  itemScore: 3,
  itemAdminEdits: {},
  hasItemPhotoData: true,
  willRequireProgressNote: true,
  isDuplicate: false
};

export const deficientItemWithNotes = {
  id: 'deficiency-1',
  createdAt: 1620952610,
  updatedAt: 1620952610,
  property: 'property-1',
  inspection: 'inspection-1',
  item: 'item-1',
  stateHistory: {},
  state: 'completed',
  sectionTitle: 'A',
  sectionType: 'single',
  sectionSubtitle: '',
  itemTitle: 'Five',
  itemMainInputType: 'FiveActions_oneToFive',
  itemMainInputSelection: 2,
  itemScore: 3,
  itemAdminEdits: {},
  hasItemPhotoData: true,
  willRequireProgressNote: true,
  isDuplicate: false,
  itemInspectorNotes: 'this is inspector notes'
};

export const unpublishedPhotoDataEntry: DeficientItemLocalPhotos = {
  id: 'unpublised-photo-data-1',
  caption: 'caption-1',
  createdAt: 1,
  inspection: 'inpsection-1',
  item: 'item-1',
  property: 'property-1',
  deficiency: 'deficiency-1',
  photoData:
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  startDate: 1,
  size: 1
};
