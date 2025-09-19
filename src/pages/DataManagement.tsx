import React, { useState } from 'react';
import { Card, Upload, Table, Button, Tag, Modal, Form, Input, Select, message, Row, Col } from 'antd';
import { UploadIcon, FileIcon, EditIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { mockTests } from '../data/mockData';
import moment from 'moment';

const { Dragger } = Upload;
const { Option } = Select;

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  chemistry: string;
  cyclesLogged: number;
  status: 'uploaded' | 'processed' | 'error';
}

const DataManagement: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'NMC_Test_Batch_1.csv',
      size: 2456789,
      uploadDate: '2024-01-15T10:30:00Z',
      chemistry: 'NMC',
      cyclesLogged: 1250,
      status: 'processed'
    },
    {
      id: '2',
      name: 'LFP_Cycling_Data.xlsx',
      size: 5678901,
      uploadDate: '2024-01-20T14:22:00Z',
      chemistry: 'LFP',
      cyclesLogged: 2100,
      status: 'processed'
    }
  ]);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [form] = Form.useForm();

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.csv,.xlsx,.xls',
    action: '/api/upload',
    beforeUpload: (file: File) => {
      const isValidType = file.type === 'text/csv' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      
      if (!isValidType) {
        message.error('You can only upload CSV or Excel files!');
        return false;
      }
      
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('File must be smaller than 50MB!');
        return false;
      }
      
      return false; // Prevent actual upload in demo
    },
    onChange: (info: any) => {
      const { status, name, size } = info.file;
      if (status === 'done') {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name,
          size,
          uploadDate: new Date().toISOString(),
          chemistry: 'NMC', // Default, would be determined from file
          cyclesLogged: Math.floor(Math.random() * 2000) + 500,
          status: 'uploaded'
        };
        setUploadedFiles(prev => [...prev, newFile]);
        message.success(`${name} uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
      }
    }
  };

  const handleEdit = (test: any) => {
    setEditingTest(test);
    form.setFieldsValue(test);
    setEditModalVisible(true);
  };

  const handleEditSubmit = (values: any) => {
    console.log('Updating test:', values);
    message.success('Test metadata updated successfully!');
    setEditModalVisible(false);
    setEditingTest(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will permanently delete the uploaded file and associated data.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setUploadedFiles(prev => prev.filter(file => file.id !== id));
        message.success('File deleted successfully!');
      }
    });
  };

  const fileColumns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <FileIcon size={16} style={{ color: '#64748b' }} />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => moment(date).format('MMM DD, YYYY HH:mm')
    },
    {
      title: 'Chemistry',
      dataIndex: 'chemistry',
      key: 'chemistry',
      render: (chemistry: string) => (
        <Tag color="blue">{chemistry}</Tag>
      )
    },
    {
      title: 'Cycles Logged',
      dataIndex: 'cyclesLogged',
      key: 'cyclesLogged',
      render: (cycles: number) => cycles.toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'processed' ? 'green' : status === 'uploaded' ? 'blue' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UploadedFile) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            size="small"
            icon={<EditIcon size={14} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<TrashIcon size={14} />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      )
    }
  ];

  const testColumns = [
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
      render: (chemistry: string) => <Tag color="blue">{chemistry}</Tag>
    },
    {
      title: 'Temperature (°C)',
      dataIndex: 'temperature',
      key: 'temperature'
    },
    {
      title: 'C-Rate',
      dataIndex: 'cRate',
      key: 'cRate'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="text"
          size="small"
          icon={<EditIcon size={14} />}
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <Card 
        title="Upload Test Data" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        extra={<UploadIcon size={20} style={{ color: '#475569' }} />}
      >
        <Dragger {...uploadProps} style={{ padding: '20px' }}>
          <p className="ant-upload-drag-icon">
            <UploadIcon size={48} style={{ color: '#2563eb' }} className="mx-auto" />
          </p>
          <p className="ant-upload-text text-lg font-medium">
            Click or drag files to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ color: '#64748b' }}>
            Support for CSV and Excel (.xlsx, .xls) files up to 50MB. 
            Multiple file selection is supported.
          </p>
        </Dragger>
      </Card>

      {/* Uploaded Files */}
      <Card 
        title="Uploaded Files" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        extra={
          <div className="text-sm" style={{ color: '#64748b' }}>
            {uploadedFiles.length} files uploaded
          </div>
        }
      >
        <Table
          columns={fileColumns}
          dataSource={uploadedFiles}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* Test Metadata Management */}
      <Card 
        title="Test Metadata Management" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        extra={
          <Button type="primary" icon={<PlusIcon size={16} />}>
            Add New Test
          </Button>
        }
      >
        <Table
          columns={testColumns}
          dataSource={mockTests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Test Metadata"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingTest(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Cell ID"
                name="cellId"
                rules={[{ required: true, message: 'Please enter cell ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Chemistry"
                name="chemistry"
                rules={[{ required: true, message: 'Please select chemistry' }]}
              >
                <Select>
                  <Option value="NMC">NMC</Option>
                  <Option value="LFP">LFP</Option>
                  <Option value="LCO">LCO</Option>
                  <Option value="NCA">NCA</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Temperature (°C)"
                name="temperature"
                rules={[{ required: true, message: 'Please enter temperature' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="C-Rate"
                name="cRate"
                rules={[{ required: true, message: 'Please enter C-rate' }]}
              >
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Charge Voltage (V)"
                name={['testConditions', 'chargeVoltage']}
              >
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Discharge Voltage (V)"
                name={['testConditions', 'dischargeVoltage']}
              >
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DataManagement;