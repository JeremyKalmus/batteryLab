import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Select, Slider, Switch } from 'antd';
import ScatterPlotChart from '../components/charts/ScatterPlotChart';
import BoxPlotChart from '../components/charts/BoxPlotChart';
import { mockTests, mockChemistryStats, generateCycleData } from '../data/mockData';

const { TabPane } = Tabs;
const { Option } = Select;

const DegradationAnalytics: React.FC = () => {
  const [selectedChemistries, setSelectedChemistries] = useState<string[]>(['NMC', 'LFP', 'LCO', 'NCA']);
  const [temperatureRange, setTemperatureRange] = useState<[number, number]>([20, 50]);
  const [cRateRange, setCRateRange] = useState<[number, number]>([0.5, 2.0]);
  const [showRegression, setShowRegression] = useState(false);
  const [regressionType, setRegressionType] = useState<'linear' | 'exponential' | 'polynomial'>('linear');

  const testData = mockTests
    .filter(test => 
      selectedChemistries.includes(test.chemistry) &&
      test.temperature >= temperatureRange[0] &&
      test.temperature <= temperatureRange[1] &&
      test.cRate >= cRateRange[0] &&
      test.cRate <= cRateRange[1]
    )
    .map(generateCycleData);

  const filteredChemistryStats = mockChemistryStats.filter(stat => 
    selectedChemistries.includes(stat.chemistry)
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card 
        title="Analysis Filters" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={6}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#475569' }}>
              Chemistry Types
            </label>
            <Select
              mode="multiple"
              value={selectedChemistries}
              onChange={setSelectedChemistries}
              style={{ width: '100%' }}
              placeholder="Select chemistries"
            >
              <Option value="NMC">NMC</Option>
              <Option value="LFP">LFP</Option>
              <Option value="LCO">LCO</Option>
              <Option value="NCA">NCA</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#475569' }}>
              Temperature Range (°C): {temperatureRange[0]} - {temperatureRange[1]}
            </label>
            <Slider
              range
              min={10}
              max={60}
              value={temperatureRange}
              onChange={(value) => setTemperatureRange(value as [number, number])}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#475569' }}>
              C-Rate Range: {cRateRange[0]} - {cRateRange[1]}
            </label>
            <Slider
              range
              min={0.1}
              max={3.0}
              step={0.1}
              value={cRateRange}
              onChange={(value) => setCRateRange(value as [number, number])}
            />
          </Col>
          <Col xs={24} md={6}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showRegression}
                  onChange={setShowRegression}
                  size="small"
                />
                <span className="text-sm" style={{ color: '#475569' }}>Show Regression</span>
              </div>
              {showRegression && (
                <Select
                  value={regressionType}
                  onChange={setRegressionType}
                  style={{ width: '100%' }}
                  size="small"
                >
                  <Option value="linear">Linear</Option>
                  <Option value="exponential">Exponential</Option>
                  <Option value="polynomial">Polynomial</Option>
                </Select>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Analytics Tabs */}
      <Card 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <Tabs defaultActiveKey="scatter" type="card">
          <TabPane tab="Cycle vs Capacity Fade" key="scatter">
            <ScatterPlotChart
              data={testData}
              xField="cycle"
              yField="capacityRetention"
              title="Cycle Count vs Capacity Fade"
              xLabel="Cycle Number"
              yLabel="Capacity Retention (%)"
              showRegression={showRegression}
              regressionType={regressionType}
            />
          </TabPane>
          
          <TabPane tab="Capacity at 500 Cycles" key="box500">
            <BoxPlotChart
              data={filteredChemistryStats}
              field="capacityRetention500"
              title="Capacity Retention at 500 Cycles by Chemistry"
              yLabel="Capacity Retention (%)"
            />
          </TabPane>
          
          <TabPane tab="Capacity at 1000 Cycles" key="box1000">
            <BoxPlotChart
              data={filteredChemistryStats}
              field="capacityRetention1000"
              title="Capacity Retention at 1000 Cycles by Chemistry"
              yLabel="Capacity Retention (%)"
            />
          </TabPane>
          
          <TabPane tab="Capacity at 2000 Cycles" key="box2000">
            <BoxPlotChart
              data={filteredChemistryStats}
              field="capacityRetention2000"
              title="Capacity Retention at 2000 Cycles by Chemistry"
              yLabel="Capacity Retention (%)"
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Analysis Summary" 
            style={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: '#64748b' }}>Total Tests Analyzed:</span>
                <span className="font-semibold">{testData.length}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#64748b' }}>Chemistry Types:</span>
                <span className="font-semibold">{selectedChemistries.length}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#64748b' }}>Temperature Range:</span>
                <span className="font-semibold">{temperatureRange[0]}°C - {temperatureRange[1]}°C</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#64748b' }}>C-Rate Range:</span>
                <span className="font-semibold">{cRateRange[0]} - {cRateRange[1]}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DegradationAnalytics;