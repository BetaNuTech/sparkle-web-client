import deficientItemModal from '../common/models/deficientItem';

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
