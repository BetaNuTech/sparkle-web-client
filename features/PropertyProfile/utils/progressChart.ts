// Calculate progress
export const getProgressPercent = (
  itemsCompleted: number,
  totalItems: number
): string => ((itemsCompleted / totalItems) * 100).toFixed(2);

// Get Chart.js Doughnut data
export const getChartData = (progress: number): any => ({
  labels: ['Completed', 'Incomplete'],
  datasets: [
    {
      data: [progress, 100 - progress],
      cutout: '70%',
      backgroundColor: ['#032ca6', '#9d9d9d']
    }
  ]
});

// Get Chart.js Doughnut options
export const getChartOptions = (): any => ({
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
});

// Get Chart.js Legend config
export const getChartLabel = (): any => ({
  id: 'custom_canvas_percentage',
  afterDraw: (chart) => {
    const ctx = chart.canvas.getContext('2d');
    const dataSet = chart.data.datasets[0];
    const text = `${dataSet.data[0]}%`;
    const textX = Math.round((chart.width - ctx.measureText(text).width) / 2);
    const textY = chart.height / 1.8;
    ctx.fillText(text, textX, textY);
  }
});

export default {
  getProgressPercent,
  getChartData,
  getChartOptions,
  getChartLabel
};
