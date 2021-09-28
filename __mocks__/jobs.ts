import jobModel from '../common/models/job';
import { photoAttachment } from './attachments';

export const openImprovementJob: jobModel = {
  id: 'job-1',
  title: 'Install Playground Equipement',
  need: 'for kids play zone',
  authorizedRules: 'default',
  scopeOfWork: 'install equipments in garden area',
  scopeOfWorkAttachments: [photoAttachment],
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1483209000,
  updatedAt: 1485887400,
  state: 'open',
  type: 'small:pm',
  minBids: 2
};

export const openMaintenanceJob: jobModel = {
  id: 'job-2',
  title: 'Swimming pool cleaning',
  need: 'pool has gone dirty',
  authorizedRules: 'default',
  scopeOfWork: 'clean pool, add chemicals',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1488306600,
  updatedAt: 1490985000,
  state: 'open',
  type: 'small:pm',
  minBids: 2
};

export const openMaintenanceExpeditedJob: jobModel = {
  id: 'job-9',
  title: 'Sidewalk repair',
  need: '',
  authorizedRules: 'expedite',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1493577000,
  updatedAt: 1496255400,
  state: 'open',
  type: 'small:pm',
  minBids: 1
};

export const approvedImprovementJob: jobModel = {
  id: 'job-3',
  title: 'Replace leasing office tiling',
  need: 'office tiles needs to be replaced',
  authorizedRules: 'default',
  scopeOfWork: 'Replace floor tiles',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1498847400,
  updatedAt: 1501525800,
  state: 'approved',
  type: 'small:pm',
  minBids: 2
};

export const approvedImprovementHybridJob: jobModel = {
  id: 'job-31',
  title: 'Replace leasing office tiling',
  need: 'office tiles needs to be replaced',
  authorizedRules: 'default',
  scopeOfWork: 'Replace floor tiles',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1498847400,
  updatedAt: 1501525800,
  state: 'approved',
  type: 'small:hybrid',
  minBids: 2
};

export const approvedMaintenanceJob: jobModel = {
  id: 'job-4',
  title: 'Solar roof fitting',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: 'https://trello.com/c/lxfZsLN4',
  property: 'property-2',
  createdAt: 1504204200,
  updatedAt: 1506796200,
  state: 'approved',
  type: 'small:pm',
  minBids: 2
};

export const approvedExpeditedMaintenanceJob: jobModel = {
  id: 'job-41',
  title: 'Solar roof fitting',
  need: '',
  authorizedRules: 'expedite',
  scopeOfWork: '',
  trelloCardURL: 'https://trello.com/c/lxfZsLN4',
  property: 'property-2',
  createdAt: 1504204200,
  updatedAt: 1506796200,
  state: 'approved',
  type: 'small:pm',
  minBids: 1
};

export const approvedLargeJob: jobModel = {
  id: 'job-41',
  title: 'Solar roof fitting',
  need: '',
  authorizedRules: 'large',
  scopeOfWork: '',
  trelloCardURL: 'https://trello.com/c/lxfZsLN4',
  property: 'property-2',
  createdAt: 1504204200,
  updatedAt: 1506796200,
  state: 'approved',
  type: 'large:am',
  minBids: 3
};

export const authorizedImprovementJob: jobModel = {
  id: 'job-5',
  title: 'Security camera installation',
  need: 'to increase survilleance in society',
  authorizedRules: 'default',
  scopeOfWork: 'install cameras and control room',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1509474600,
  updatedAt: 1512066600,
  state: 'authorized',
  type: 'small:hybrid',
  minBids: 1
};

export const authorizedMaintenanceJob: jobModel = {
  id: 'job-6',
  title: 'Water Tank cleaning',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1514745000,
  updatedAt: 1517423400,
  state: 'authorized',
  type: 'small:hybrid',
  minBids: 2
};

export const completeImprovementJob: jobModel = {
  id: 'job-7',
  title: 'Wifi Installation',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-2',
  createdAt: 1519842600,
  updatedAt: 1522521000,
  state: 'complete',
  type: 'small:hybrid',
  minBids: 2
};

export const completeMaintenanceJob: jobModel = {
  id: 'job-8',
  title: 'Electrical checkup',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1525113000,
  updatedAt: 1527791400,
  state: 'complete',
  type: 'small:hybrid',
  minBids: 2
};

export default [
  openImprovementJob,
  openMaintenanceJob,
  openMaintenanceExpeditedJob,
  approvedImprovementJob,
  approvedMaintenanceJob,
  approvedImprovementHybridJob,
  approvedExpeditedMaintenanceJob,
  authorizedImprovementJob,
  authorizedMaintenanceJob,
  completeImprovementJob,
  completeMaintenanceJob
];
