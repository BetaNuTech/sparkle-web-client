import inspectionModel from '../common/models/inspection';

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
  updatedAt: 1622676604,
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
  updatedAt: 1622469870,
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
  updatedAt: 1622714485,
};


export default [fullInspection, inspectionA, inspectionB];
