import React from 'react';
import Plot from 'react-plotly.js';
import { TestData } from '../../types/battery';
import { chemistryColors } from '../../data/mockData';

interface CapacityFadeChartProps {
  data: TestData[];
  title?: string;
  height?: number;
}

const CapacityFadeChart: React.FC<CapacityFadeChartProps> = ({ 
  data, 
  title = "Capacity Fade Trend",
  height = 400 
}) => {
  const traces = data.map(testData => ({
    x: testData.cycles.map(cycle => cycle.cycle),
    y: testData.cycles.map(cycle => (cycle.capacity / testData.test.initialCapacity) * 100),
    type: 'scatter' as const,
    mode: 'lines+markers' as const,
    name: `${testData.test.cellId} (${testData.test.chemistry})`,
    line: { 
      color: chemistryColors[testData.test.chemistry],
      width: 2 
    },
    marker: { 
      size: 4,
      color: chemistryColors[testData.test.chemistry]
    },
    hovertemplate: `<b>%{fullData.name}</b><br>` +
                   `Cycle: %{x}<br>` +
                   `Capacity Retention: %{y:.1f}%<br>` +
                   `<extra></extra>`
  }));

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: title,
          font: { size: 16, color: '#1e293b' }
        },
        xaxis: {
          title: 'Cycle Number',
          gridcolor: '#f1f5f9',
          zerolinecolor: '#e2e8f0',
          titlefont: { color: '#475569' },
          tickfont: { color: '#64748b' }
        },
        yaxis: {
          title: 'Capacity Retention (%)',
          gridcolor: '#f1f5f9',
          zerolinecolor: '#e2e8f0',
          titlefont: { color: '#475569' },
          tickfont: { color: '#64748b' },
          range: [60, 105]
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
      style={{ width: '100%', height: `${height}px` }}
    />
  );
};

export default CapacityFadeChart;