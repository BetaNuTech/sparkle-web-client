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
    improvement: 'info',
    maintenance: 'info'
  },
  types: {
    improvement: 'Improvement',
    maintenance: 'Maintenance'
  }
};
