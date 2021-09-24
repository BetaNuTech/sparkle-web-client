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
    'small:pm': 'info',
    'small:hybrid': 'info',
    'large:am': 'info',
    'large:sc': 'info'
  },
  types: {
    'small:pm': 'Property Management Project',
    'small:hybrid': 'Hybrid Capital Project',
    'large:am': 'Asset Management Project',
    'large:sc': 'Structural Capital Projects'
  }
};
