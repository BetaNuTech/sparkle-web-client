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
        'Projects that are less than $5K and don’t require a contract (+2 Bids)'
    },
    'small:hybrid': {
      title: 'Hybrid Capital Project',
      description:
        'Large capital projects that are $5K - $24K (+2 Bids)'
    },
    'large:am': {
      title: 'Asset Management Project',
      description:
        'Projects costing over $25K (+3 Bids)'
    },
    'large:sc': {
      title: 'Structural Capital Project',
      description:
        'Any project that requires structural work, regardless of cost (+3 Bids)'
    }
  }
};
