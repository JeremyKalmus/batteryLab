import React from 'react';
import Plot from 'react-plotly.js';
import { TestData } from '../../types/battery';
import { chemistryColors } from '../../data/mockData';
import { generateRegressionData } from '../../utils/chartHelpers';

interface ScatterPlotChartProps {
  data: TestData[];
  xField: keyof any;
  yField: keyof any;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  showRegression?: boolean;
  regressionType?: 'linear' | 'exponential' | 'polynomial';
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  data,
  title = "Scatter Plot Analysis",
  xLabel = "X Axis",
  yLabel = "Y Axis",
  showRegression = false,
  regressionType = 'linear'
}) => {
  const traces: any[] = [];
  
  // Group data by chemistry
  const dataByChemistry = data.reduce((acc, testData) => {
    const chemistry = testData.test.chemistry;
    if (!acc[chemistry]) acc[chemistry] = [];
    acc[chemistry].push(testData);
    return acc;
  }, {} as { [key: string]: TestData[] });

  // Create scatter traces for each chemistry
  Object.entries(dataByChemistry).forEach(([chemistry, tests]) => {
    const allCycles = tests.flatMap(test => test.cycles);
    const xValues = allCycles.map(cycle => cycle.cycle);
    const yValues = allCycles.map(cycle => (cycle.capacity / tests[0].test.initialCapacity) * 100);

    traces.push({
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'markers',
      name: chemistry,
      marker: {
        color: chemistryColors[chemistry],
        size: 6,
        opacity: 0.7
      },
      hovertemplate: `<b>${chemistry}</b><br>` +
                     `Cycle: %{x}<br>` +
                     `Capacity Retention: %{y:.1f}%<br>` +
                     `<extra></extra>`
    });

    // Add regression line if enabled
    if (showRegression && xValues.length > 1) {
      const regressionData = generateRegressionData(xValues, yValues, regressionType);
      if (regressionData.x.length > 0) {
        traces.push({
          x: regressionData.x,
          y: regressionData.y,
          type: 'scatter',
          mode: 'lines',
          name: `${chemistry} - ${regressionType} fit`,
          line: {
            color: chemistryColors[chemistry],
            width: 2,
            dash: 'dash'
          },
          hoverinfo: 'skip',
          showlegend: false
        });
      }
    }
  });

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: title,
          font: { size: 16, color: '#1e293b' }
        },
        xaxis: {
          title: xLabel,
          gridcolor: '#f1f5f9',
          zerolinecolor: '#e2e8f0',
          titlefont: { color: '#475569' },
          tickfont: { color: '#64748b' }
        },
        yaxis: {
          title: yLabel,
          gridcolor: '#f1f5f9',
          zerolinecolor: '#e2e8f0',
          titlefont: { color: '#475569' },
          tickfont: { color: '#64748b' }
        },
        plot_bgcolor: '#fafaf9',
        paper_bgcolor: '#ffffff',
        font: { color: '#475569' },
        hovermode: 'closest',
        showlegend: true,
        legend: {
          x: 1,
          xanchor: 'left',
          y: 1,
          font: { color: '#475569' }
        }
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d']
      }}
      style={{ width: '100%', height: '500px' }}
    />
  );
};

export default ScatterPlotChart;