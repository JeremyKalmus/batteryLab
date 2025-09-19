import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Checkbox } from 'antd';
import Plot from 'react-plotly.js';
import BoxPlotChart from '../components/charts/BoxPlotChart';
import { mockChemistryStats, chemistryColors } from '../data/mockData';

const { TabPane } = Tabs;

const ChemistryComparison: React.FC = () => {
  const [visibleChemistries, setVisibleChemistries] = useState<string[]>(['NMC', 'LFP', 'LCO', 'NCA']);

  const filteredStats = mockChemistryStats.filter(stat => 
    visibleChemistries.includes(stat.chemistry)
  );

  const handleChemistryToggle = (chemistry: string) => {
    setVisibleChemistries(prev => 
      prev.includes(chemistry) 
        ? prev.filter(c => c !== chemistry)
        : [...prev, chemistry]
    );
  };

  // Cycle-to-failure distribution
  const cyclesToFailureTrace = filteredStats.map(stat => ({
    x: [stat.chemistry],
    y: [stat.avgCyclesToFailure],
    type: 'bar' as const,
    name: stat.chemistry,
    marker: { color: chemistryColors[stat.chemistry] },
    text: [stat.avgCyclesToFailure.toLocaleString()],
    textposition: 'auto' as const
  }));

  // Efficiency violin plot data
  const violinTraces = filteredStats.map(stat => {
    // Generate sample data for violin plot
    const sampleData = Array.from({ length: 50 }, () => 
      stat.efficiency + (Math.random() - 0.5) * 4
    );
    
    return {
      y: sampleData,
      type: 'violin' as const,
      name: stat.chemistry,
      marker: { color: chemistryColors[stat.chemistry] },
      box: { visible: true },
      line: { color: chemistryColors[stat.chemistry] },
      meanline: { visible: true }
    };
  });

  return (
    <div className="space-y-6">
      {/* Chemistry Selection */}
      <Card 
        title="Chemistry Selection" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <Row gutter={[16, 16]}>
          {mockChemistryStats.map(stat => (
            <Col key={stat.chemistry} xs={12} sm={6}>
              <Checkbox
                checked={visibleChemistries.includes(stat.chemistry)}
                onChange={() => handleChemistryToggle(stat.chemistry)}
                style={{ color: chemistryColors[stat.chemistry] }}
              >
                <span style={{ color: chemistryColors[stat.chemistry], fontWeight: 'bold' }}>
                  {stat.chemistry}
                </span>
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Comparison Charts */}
      <Card 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <Tabs defaultActiveKey="cycles" type="card">
          <TabPane tab="Cycle-to-Failure Distribution" key="cycles">
            <Plot
              data={cyclesToFailureTrace}
              layout={{
                title: {
                  text: 'Average Cycles to Failure by Chemistry',
                  font: { size: 16, color: '#1e293b' }
                },
                xaxis: {
                  title: 'Chemistry Type',
                  gridcolor: '#f1f5f9',
                  titlefont: { color: '#475569' },
                  tickfont: { color: '#64748b' }
                },
                yaxis: {
                  title: 'Average Cycles to Failure',
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
              style={{ width: '100%', height: '450px' }}
            />
          </TabPane>

          <TabPane tab="Efficiency Distribution" key="efficiency">
            <Plot
              data={violinTraces}
              layout={{
                title: {
                  text: 'Charge/Discharge Efficiency Distribution',
                  font: { size: 16, color: '#1e293b' }
                },
                xaxis: {
                  title: 'Chemistry Type',
                  gridcolor: '#f1f5f9',
                  titlefont: { color: '#475569' },
                  tickfont: { color: '#64748b' }
                },
                yaxis: {
                  title: 'Efficiency (%)',
                  gridcolor: '#f1f5f9',
                  zerolinecolor: '#e2e8f0',
                  titlefont: { color: '#475569' },
                  tickfont: { color: '#64748b' }
                },
                plot_bgcolor: '#fafaf9',
                paper_bgcolor: '#ffffff',
                font: { color: '#475569' },
                violinmode: 'group',
                showlegend: false
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d']
              }}
              style={{ width: '100%', height: '450px' }}
            />
          </TabPane>

          <TabPane tab="Capacity Retention at 500 Cycles" key="retention500">
            <BoxPlotChart
              data={filteredStats}
              field="capacityRetention500"
              title="Capacity Retention at 500 Cycles"
              yLabel="Capacity Retention (%)"
            />
          </TabPane>

          <TabPane tab="Capacity Retention at 1000 Cycles" key="retention1000">
            <BoxPlotChart
              data={filteredStats}
              field="capacityRetention1000"
              title="Capacity Retention at 1000 Cycles"
              yLabel="Capacity Retention (%)"
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Side-by-side Statistics */}
      <Row gutter={[24, 24]}>
        {filteredStats.map(stat => (
          <Col key={stat.chemistry} xs={24} md={12} lg={6}>
            <Card 
              title={stat.chemistry}
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              headStyle={{ 
                backgroundColor: chemistryColors[stat.chemistry],
                color: 'white',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <div className="space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Avg Cycles to Failure</div>
                  <div className="text-lg font-semibold">{stat.avgCyclesToFailure.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Retention @ 500</div>
                  <div className="text-lg font-semibold">{stat.capacityRetention500}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Retention @ 1000</div>
                  <div className="text-lg font-semibold">{stat.capacityRetention1000}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Efficiency</div>
                  <div className="text-lg font-semibold">{stat.efficiency}%</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ChemistryComparison;