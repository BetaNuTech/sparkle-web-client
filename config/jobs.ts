export default {
  stateColors: {
    open: 'purple',
    approved: 'primary',
    authorized: 'green',
    complete: 'info'
  },
  nextState: {
    open: 'Approval',
    approved: 'Authorization',
    authorized: 'Completed Bid',
    complete: ''
  },
  typeColors: {
    'asset management project': 'info',
    'property management project': 'info',
    'hybrid capital project': 'info'
  },
  types: {
    'asset management project': 'Asset Management Project',
    'property management project': 'Property Management Project',
    'hybrid capital project': 'Hybrid Capital Project'
  }
};
