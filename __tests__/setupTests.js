jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null
}));
window.URL.createObjectURL = function () {}; // eslint-disable-line
