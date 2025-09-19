import React from 'react';
import Plot from 'react-plotly.js';
import { ChemistryStats } from '../../types/battery';
import { chemistryColors } from '../../data/mockData';

interface BoxPlotChartProps {
  data: ChemistryStats[];
  field: keyof ChemistryStats;
  title?: string;
  yLabel?: string;
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  data,
  field,
  title = "Box Plot Comparison",
  yLabel = "Value"
}) => {
  const traces = data.map(stat => {
    // Generate some sample data points around the main value for box plot
    const mainValue = stat[field] as number;
    const sampleData = Array.from({ length: 20 }, () => 
      mainValue + (Math.random() - 0.5) * mainValue * 0.2
    );

    return {
      y: sampleData,
      type: 'box' as const,
      name: stat.chemistry,
      marker: { color: chemistryColors[stat.chemistry] },
      boxpoints: 'outliers',
      hovertemplate: `<b>${stat.chemistry}</b><br>` +
                     `${yLabel}: %{y:.1f}<br>` +
                     `<extra></extra>`
    };
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
          title: 'Chemistry Type',
          gridcolor: '#f1f5f9',
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
        showlegend: false
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d']
      }}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default BoxPlotChart;