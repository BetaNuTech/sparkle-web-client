import yardiWorkOrder from '../../common/models/yardi/workOrder';

export const yardiWorkOrderOne: yardiWorkOrder = {
  id: 'yardi-work-order-1',
  category: 'doors',
  createdAt: 1633974809,
  description: 'There are tons of spider webs',
  origin: 'OL',
  permissionToEnter: false,
  priority: 'top',
  problemNotes: 'There are tons of spider webs hanging around',
  requestDate: '2021-10-11',
  requestorEmail: 'email@gmail.com',
  requestorName: 'Michael Jackobs',
  requestorPhone: '5049271122',
  status: 'web',
  technicianNotes: 'very complicated',
  tenantCaused: false,
  unit: '1724',
  updatedAt: 1633974809,
  updatedBy: 'service',
  resident: 'yardi-resident-1'
};

export const yardiWorkOrderTwo: yardiWorkOrder = {
  id: 'yardi-work-order-1',
  createdAt: 1633974809,
  description: 'There are tons of spider webs',
  origin: 'OL',
  priority: 'top',
  problemNotes: 'There are tons of spider webs hanging around',
  requestDate: '2021-10-11',
  tenantCaused: false,
  unit: '1724',
  updatedAt: 1633974809,
  resident: 'yardi-resident-1'
};

export default [yardiWorkOrderOne, yardiWorkOrderTwo];
