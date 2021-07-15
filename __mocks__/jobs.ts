import jobModel from '../common/models/job';

export const openImprovementJob: jobModel = {
  id: 'job-1',
  title: 'Install Playground Equipement',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'open',
  type: 'improvement'
};

export const openMaintenanceJob: jobModel = {
  id: 'job-2',
  title: 'Swimming pool cleaning',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'open',
  type: 'maintenance'
};

export const openMaintenanceExpeditedJob: jobModel = {
  id: 'job-9',
  title: 'Sidewalk repair',
  need: '',
  authorizedRules: 'expedite',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'open',
  type: 'maintenance'
};

export const approvedImprovementJob: jobModel = {
  id: 'job-3',
  title: 'Replace leasing office tiling',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'approved',
  type: 'improvement'
};

export const approvedMaintenanceJob: jobModel = {
  id: 'job-4',
  title: 'Solar roof fitting',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-2',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'approved',
  type: 'maintenance'
};

export const authorizedImprovementJob: jobModel = {
  id: 'job-5',
  title: 'Security camera installation',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'approved',
  type: 'improvement'
};

export const authorizedMaintenanceJob: jobModel = {
  id: 'job-6',
  title: 'Water Tank cleaning',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'approved',
  type: 'maintenance'
};

export const completeImprovementJob: jobModel = {
  id: 'job-7',
  title: 'Wifi Installation',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-2',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'complete',
  type: 'improvement'
};

export const completeMaintenanceJob: jobModel = {
  id: 'job-8',
  title: 'Electrical checkup',
  need: '',
  authorizedRules: 'default',
  scopeOfWork: '',
  trelloCardURL: '',
  property: 'property-1',
  createdAt: 1624289498,
  updatedAt: 1624289498,
  state: 'complete',
  type: 'maintenance'
};

export default [
  openImprovementJob,
  openMaintenanceJob,
  approvedImprovementJob,
  approvedMaintenanceJob,
  authorizedImprovementJob,
  authorizedMaintenanceJob,
  completeImprovementJob,
  completeMaintenanceJob
];
