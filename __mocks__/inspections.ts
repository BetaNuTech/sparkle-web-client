import inspectionModel from '../common/models/inspection';
import inspectionTemplateSectionModel from '../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../common/models/inspectionTemplateItem';
import inspectionTemplateItemModelPhotoData from '../common/models/inspectionTemplateItemPhotoData';
// eslint-disable-next-line max-len
import inspectionTemplateItemModelUnpublishedPhotoData from '../common/models/inspections/templateItemUnpublishedPhotoData';
// eslint-disable-next-line max-len
import inspectionTemplateItemModelUnpublishedSignature from '../common/models/inspections/templateItemUnpublishedSignature';

export const fullInspection: inspectionModel = {
  id: 'inspection-1',
  creationDate: 1620952610,
  deficienciesExist: false,
  inspectionCompleted: true,
  inspectorName: 'matt jensen',
  itemsCompleted: 8,
  totalItems: 8,
  score: 100,
  property: 'property-1',
  inspector: 'ZmsDbQZP6kTVDsF2xmChK3l3V273',
  templateName: 'Kitchen Sink',
  templateCategory: 'rDJx8PqjTKUMr2a4hPHd',
  updatedAt: 1622676604
};

export const inspectionA: inspectionModel = {
  id: 'inspection-2',
  creationDate: 1620866714,
  deficienciesExist: true,
  inspectionCompleted: true,
  inspectorName: 'matt jensen',
  itemsCompleted: 7,
  totalItems: 7,
  score: 91.8918918918919,
  property: 'property-1',
  inspector: 'ZmsDbQZP6kTVDsF2xmChK3l3V273',
  templateName: 'Kitchen Sink',
  templateCategory: 'category-2',
  updatedAt: 1622469870
};

export const inspectionB: inspectionModel = {
  id: 'inspection-3',
  creationDate: 1620876714,
  deficienciesExist: false,
  inspectionCompleted: false,
  inspectorName: 'matt jensen',
  itemsCompleted: 1,
  totalItems: 8,
  score: 0,
  property: '3e1c1a56d1bd381af398',
  inspector: 'noMMrCMEAQUrvfebtIvi9bbaMVt2',
  templateName: 'Kitchen Sink',
  templateCategory: 'category-3',
  updatedAt: 1622714485
};

export const singleSection: inspectionTemplateSectionModel = {
  id: 'section-1',
  added_multi_section: false,
  index: 1,
  section_type: 'single',
  title: 'one'
};

export const originalMultiSection: inspectionTemplateSectionModel = {
  id: 'section-2',
  added_multi_section: false,
  index: 2,
  section_type: 'multi',
  title: 'three'
};

export const addedMultiSection: inspectionTemplateSectionModel = {
  id: 'section-3',
  added_multi_section: true,
  index: 0,
  section_type: 'multi',
  title: 'two'
};

export const unselectedCheckmarkItem: inspectionTemplateItemModel = {
  id: 'item-1',
  deficient: false,
  isItemNA: false,
  isTextInputItem: false,
  index: 3,
  itemType: 'main',
  title: 'Four',
  sectionId: singleSection.id,
  mainInputType: 'twoactions_checkmarkx',
  mainInputSelected: false,
  mainInputSelection: -1,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: true,
  photos: true
};

export const selectedCheckmarkItem: inspectionTemplateItemModel = {
  id: 'item-2',
  deficient: false,
  index: 0,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'One',
  sectionId: singleSection.id,
  mainInputType: 'twoactions_checkmarkx',
  mainInputSelected: true,
  mainInputSelection: 0,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: true,
  photos: true
};

export const unselectedThumbsItem: inspectionTemplateItemModel = {
  id: 'item-3',
  deficient: false,
  index: 1,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Two',
  sectionId: singleSection.id,
  mainInputType: 'twoactions_thumbs',
  mainInputSelected: false,
  mainInputSelection: -1,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: true,
  photos: true
};

export const selectedThumbsItem: inspectionTemplateItemModel = {
  id: 'item-4',
  deficient: false,
  index: 1,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Two',
  sectionId: singleSection.id,
  mainInputType: 'twoactions_thumbs',
  mainInputSelected: true,
  mainInputSelection: 1,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: true,
  photos: true
};

export const unselectedCheckedExclaimItem: inspectionTemplateItemModel = {
  id: 'item-5',
  deficient: false,
  index: 6,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Six',
  sectionId: singleSection.id,
  mainInputType: 'threeactions_checkmarkexclamationx',
  mainInputSelected: false,
  mainInputSelection: -1,
  mainInputFourValue: 0,
  mainInputOneValue: 3,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 5,
  notes: true,
  photos: true
};

export const selectedCheckedExclaimItem: inspectionTemplateItemModel = {
  id: 'item-6',
  deficient: false,
  index: 5,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Six',
  sectionId: singleSection.id,
  mainInputType: 'threeactions_checkmarkexclamationx',
  mainInputSelected: true,
  mainInputSelection: 1,
  mainInputFourValue: 0,
  mainInputOneValue: 3,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 5,
  notes: true,
  photos: true
};

export const unselectedAbcItem: inspectionTemplateItemModel = {
  id: 'item-7',
  deficient: false,
  index: 2,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Two',
  sectionId: singleSection.id,
  mainInputType: 'threeactions_abc',
  mainInputSelected: false,
  mainInputSelection: -1,
  mainInputFourValue: 0,
  mainInputOneValue: 1,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: true,
  photos: true
};

export const unselectedOneToFiveItem: inspectionTemplateItemModel = {
  id: 'item-8',
  deficient: false,
  index: 4,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Five',
  sectionId: singleSection.id,
  mainInputType: 'fiveactions_onetofive',
  mainInputSelected: false,
  mainInputSelection: -1,
  mainInputFourValue: 5,
  mainInputOneValue: 2,
  mainInputThreeValue: 4,
  mainInputTwoValue: 3,
  mainInputZeroValue: 1,
  notes: true,
  photos: true
};

export const unselectedOneActionNote: inspectionTemplateItemModel = {
  id: 'item-9',
  deficient: false,
  index: 5,
  isItemNA: false,
  isTextInputItem: false,
  itemType: 'main',
  title: 'Six',
  sectionId: singleSection.id,
  mainInputType: 'oneaction_notes',
  mainInputNotes: '',
  mainInputSelected: false,
  mainInputFourValue: 0,
  mainInputZeroValue: 0,
  mainInputOneValue: 0,
  mainInputTwoValue: 0,
  mainInputThreeValue: 0,
  notes: true,
  photos: true
};

export const emptyTextInputItem: inspectionTemplateItemModel = {
  id: 'item-10',
  deficient: false,
  index: 7,
  isItemNA: false,
  isTextInputItem: true,
  itemType: 'text_input',
  title: 'eight',
  sectionId: singleSection.id,
  mainInputSelected: false,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  signatureDownloadURL: '',
  signatureTimestampKey: '',
  textInputValue: ''
};

export const answeredTextInputItem: inspectionTemplateItemModel = {
  id: 'item-11',
  deficient: false,
  index: 8,
  itemType: 'text_input',
  title: 'nine',
  sectionId: singleSection.id,
  isItemNA: false,
  isTextInputItem: true,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputSelected: false,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  notes: false,
  photos: false,
  textInputValue: 'test'
};

export const unselectedSignatureInputItem: inspectionTemplateItemModel = {
  id: 'item-12',
  deficient: false,
  index: 9,
  isItemNA: false,
  itemType: 'signature',
  title: 'ten',
  sectionId: singleSection.id,
  isTextInputItem: false,
  mainInputFourValue: 0,
  mainInputOneValue: 0,
  mainInputSelected: false,
  mainInputThreeValue: 0,
  mainInputTwoValue: 0,
  mainInputZeroValue: 3,
  signatureDownloadURL: '',
  signatureTimestampKey: '',
  notes: false,
  photos: false
};

export const sections = [
  singleSection,
  originalMultiSection,
  addedMultiSection
];

export const inspectionItems = [
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedThumbsItem,
  unselectedCheckedExclaimItem,
  selectedCheckedExclaimItem,
  unselectedAbcItem,
  unselectedOneToFiveItem,
  unselectedOneActionNote,
  emptyTextInputItem,
  answeredTextInputItem,
  unselectedSignatureInputItem
];

export const photoDataEntry: inspectionTemplateItemModelPhotoData = {
  id: 'photo-data-1',
  caption: 'test caption',
  downloadURL:
    'https://firebasestorage.googleapis.com/v0/b/test.appspot.com/o/inspectionItemImages%2Fproperty-id%2Fitem-id%2F1639158738461.jpg?alt=media&token=123' // eslint-disable-line
};

export const unpublishedSignatureEntry: inspectionTemplateItemModelUnpublishedSignature = {
  id: 'unpublised-signature-data-1',
  createdAt: 1,
  inspection: fullInspection.id,
  item: unselectedSignatureInputItem.id,
  signature:
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
};

export const unpublishedPhotoDataEntry: inspectionTemplateItemModelUnpublishedPhotoData = {
  id: 'unpublised-photo-data-1',
  caption: 'caption-1',
  createdAt: 1,
  inspection: fullInspection.id,
  item: unselectedCheckmarkItem.id,
  photoData:
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
};
export const unpublishedPhotoDataEntryNoCaption: inspectionTemplateItemModelUnpublishedPhotoData = {
  id: 'unpublised-photo-data-2',
  caption: '',
  createdAt: 1,
  inspection: fullInspection.id,
  item: unselectedCheckmarkItem.id,
  photoData:
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
};

export default [fullInspection, inspectionA, inspectionB];
