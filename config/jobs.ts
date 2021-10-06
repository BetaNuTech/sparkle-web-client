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
    'small:pm': {
      title: 'Property Management Project',
      description:
        'PMT will collect a minimum of 2 competitive bids from national and/or local vendors. (3+ bids recommended)'
    },
    'small:hybrid': {
      title: 'Hybrid Capital Project',
      description:
        'PMT will collect a minimum of 2 competitive bids from national and/or local vendors. (3+ bids recommended)'
    },
    'large:am': {
      title: 'Asset Management Project',
      description:
        'Collect a minimum of 3 competitive bids from national and/or local vendors'
    },
    'large:sc': {
      title: 'Structural Capital Project',
      description:
        'Collect a minimum of 3 competitive bids from national and/or local vendors.'
    }
  }
};
