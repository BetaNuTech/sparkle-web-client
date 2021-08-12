export default {
  stateColors: {
    open: 'gray',
    approved: 'primary',
    rejected: 'alert',
    incomplete: 'orange',
    complete: 'info'
  },
  nextState: {
    open: 'Approval',
    approved: 'Completion',
    rejected: 'Reopening',
    incomplete: 'Reopening',
    complete: ''
  }
};
