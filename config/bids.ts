export default {
  stateColors: {
    open: 'purple',
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
    authorizedJob: 'Authorized Job',
    complete: ''
  }
};
