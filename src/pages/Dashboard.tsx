import React from 'react';
import { Row, Col, Card, Table } from 'antd';
import KPICard from '../components/charts/KPICard';
import CapacityFadeChart from '../components/charts/CapacityFadeChart';
import { mockTests, mockKPIData, generateCycleData } from '../data/mockData';
import { BatteryIcon, ZapIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
import moment from 'moment';

const Dashboard: React.FC = () => {
  const testData = mockTests.map(generateCycleData);
  const recentTests = mockTests.slice(0, 10);

  const columns = [
    {
      title: 'Test ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-sm">{text}</span>
    },
    {
      title: 'Chemistry',
      dataIndex: 'chemistry',
      key: 'chemistry',
      render: (chemistry: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
          {chemistry}
        </span>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Current Cycle',
      dataIndex: 'currentCycle',
      key: 'currentCycle',
      render: (cycle: number) => cycle.toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : status === 'completed' ? 'blue' : 'red';
        return (
          <span className={`px-2 py-1 bg-${color}-100 text-${color}-800 rounded-md text-xs font-medium capitalize`}>
            {status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Cells Tested"
            value={mockKPIData.totalCells}
            icon={<BatteryIcon size={20} style={{ color: '#2563eb' }} />}
            color="#2563eb"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Avg Cycles to 80%"
            value={mockKPIData.avgCyclesTo80}
            icon={<ZapIcon size={20} style={{ color: '#d97706' }} />}
            color="#d97706"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Tests in Progress"
            value={mockKPIData.testsInProgress}
            icon={<ClockIcon size={20} style={{ color: '#059669' }} />}
            color="#059669"
            trend="up"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Completed Tests"
            value={mockKPIData.completedTests}
            icon={<CheckCircleIcon size={20} style={{ color: '#64748b' }} />}
            color="#64748b"
          />
        </Col>
      </Row>

      {/* Capacity Fade Trend Chart */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title="Capacity Fade Trend - All Tests" 
            style={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
            bodyStyle={{ padding: '16px', backgroundColor: '#ffffff' }}
          >
            <CapacityFadeChart data={testData} height={450} />
          </Card>
        </Col>
      </Row>

      {/* Recent Tests Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title="Recent Test Activity" 
            style={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <Table
              columns={columns}
              dataSource={recentTests}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;