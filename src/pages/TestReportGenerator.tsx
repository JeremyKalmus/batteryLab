import React, { useState } from 'react';
import { Card, Form, Select, DatePicker, Button, Checkbox, Row, Col, Table, message } from 'antd';
import { DownloadIcon, FileTextIcon } from 'lucide-react';
import { mockTests } from '../data/mockData';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const TestReportGenerator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleGenerateReport = async (values: any) => {
    setLoading(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = {
      testIds: values.testIds || [],
      dateRange: values.dateRange || [],
      format: values.format || 'PDF',
      includeCharts: values.includeCharts || false,
      includeRawData: values.includeRawData || false
    };

    console.log('Generating report with:', reportData);
    
    // Here you would typically generate and download the actual report
    message.success(`${reportData.format} report generated successfully!`);
    setLoading(false);
  };

  const columns = [
    {
      title: 'Select',
      dataIndex: 'id',
      key: 'select',
      render: (id: string) => (
        <Checkbox
          checked={selectedTests.includes(id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTests([...selectedTests, id]);
              form.setFieldsValue({ testIds: [...selectedTests, id] });
            } else {
              const newSelection = selectedTests.filter(testId => testId !== id);
              setSelectedTests(newSelection);
              form.setFieldsValue({ testIds: newSelection });
            }
          }}
        />
      )
    },
    {
      title: 'Test ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-sm">{text}</span>
    },
    {
      title: 'Cell ID',
      dataIndex: 'cellId',
      key: 'cellId'
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
      {/* Report Configuration */}
      <Card 
        title="Report Configuration" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        extra={<FileTextIcon size={20} style={{ color: '#475569' }} />}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerateReport}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Export Format"
                name="format"
                initialValue="PDF"
              >
                <Select>
                  <Option value="PDF">PDF Report</Option>
                  <Option value="CSV">CSV Data</Option>
                  <Option value="XLSX">Excel Workbook</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                label="Date Range"
                name="dateRange"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item label="Report Options">
                <div className="space-y-2">
                  <Form.Item name="includeCharts" valuePropName="checked" noStyle>
                    <Checkbox>Include Charts</Checkbox>
                  </Form.Item>
                  <Form.Item name="includeRawData" valuePropName="checked" noStyle>
                    <Checkbox>Include Raw Data</Checkbox>
                  </Form.Item>
                  <Form.Item name="includeSummary" valuePropName="checked" noStyle>
                    <Checkbox defaultChecked>Include Summary Statistics</Checkbox>
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="testIds" hidden>
            <Select mode="multiple" />
          </Form.Item>

          <Row justify="end">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<DownloadIcon size={16} />}
                size="large"
                disabled={selectedTests.length === 0}
              >
                Generate Report
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Test Selection Table */}
      <Card 
        title="Select Tests for Report" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        extra={
          <div className="text-sm" style={{ color: '#64748b' }}>
            {selectedTests.length} of {mockTests.length} tests selected
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={mockTests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* Report Preview */}
      {selectedTests.length > 0 && (
        <Card 
          title="Report Preview" 
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
              <h4 className="font-semibold mb-2">Report Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span style={{ color: '#64748b' }}>Selected Tests:</span>
                  <div className="font-semibold">{selectedTests.length}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Chemistries:</span>
                  <div className="font-semibold">
                    {Array.from(new Set(mockTests.filter(test => selectedTests.includes(test.id)).map(test => test.chemistry))).length}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Active Tests:</span>
                  <div className="font-semibold">
                    {mockTests.filter(test => selectedTests.includes(test.id) && test.status === 'active').length}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Total Cycles:</span>
                  <div className="font-semibold">
                    {mockTests.filter(test => selectedTests.includes(test.id)).reduce((sum, test) => sum + test.currentCycle, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm" style={{ color: '#64748b' }}>
              Selected tests: {selectedTests.join(', ')}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestReportGenerator;