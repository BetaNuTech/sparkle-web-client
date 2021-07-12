import templateModel from '../common/models/template';

export const templateA: templateModel = {
  id: 'template-1',
  name: 'Hall',
  description: 'Template for hall inspection',
  category: 'category-2',
  trackDeficientItems: true
};

export const templateB: templateModel = {
  id: 'template-2',
  name: 'Parking',
  description: 'Template for parking inspection',
  category: 'category-1',
  trackDeficientItems: true
};

export const templateC: templateModel = {
  id: 'template-3',
  name: 'Quicker Template',
  description: '',
  category: '',
  trackDeficientItems: true
};

export const templateD: templateModel = {
  id: 'template-4',
  name: 'Washroom',
  description: 'Template for washroom inspection',
  category: 'category-2',
  trackDeficientItems: true
};

export const templateE: templateModel = {
  id: 'template-5',
  name: 'Living',
  description: 'Template for living room inspection',
  category: 'category-1',
  trackDeficientItems: true
};

export const templateF: templateModel = {
  id: 'template-6',
  name: 'Quick Template',
  description: '',
  category: '',
  trackDeficientItems: true
};

export default [
  templateA,
  templateB,
  templateC,
  templateD,
  templateE,
  templateF
];
