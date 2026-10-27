import yardiCustomValues from '../../common/models/yardi/customValues';

const customValues: yardiCustomValues = {
  id: 'prop1',
  priorities: ['High', 'Medium', 'Low'],
  categories: [
    { name: 'Plumbing', subCategories: ['Leak', 'Clog'] },
    { name: 'Electrical', subCategories: [] },
    { name: 'Doors', subCategories: ['n/a'] }
  ],
  statuses: [
    { name: 'Call', type: 'standard' },
    { name: 'Scheduled', type: 'standard' },
    { name: 'On Hold', type: 'standard' },
    { name: 'Canceled', type: 'standard' },
    { name: 'Work Completed', type: 'standard' },
    { name: 'Web', type: 'custom' }
  ],
  reasons: [
    { status: 'On Hold', reason: 'Awaiting parts', required: true },
    { status: 'On Hold', reason: 'Resident unavailable', required: true },
    { status: 'Canceled', reason: 'Duplicate', required: false },
    { status: 'Canceled', reason: 'Resident request', required: false }
  ],
  resolutions: ['Fixed', 'Replaced']
};

export default customValues;
