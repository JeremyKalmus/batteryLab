import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DegradationAnalytics from './pages/DegradationAnalytics';
import ChemistryComparison from './pages/ChemistryComparison';
import TestReportGenerator from './pages/TestReportGenerator';
import DataManagement from './pages/DataManagement';

const theme = {
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#059669',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgBase: '#fafaf9',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    colorText: '#1e293b',
    colorTextSecondary: '#475569',
    colorTextTertiary: '#64748b',
    colorFill: '#f1f5f9',
    colorFillSecondary: '#e2e8f0',
    colorFillTertiary: '#cbd5e1',
    colorFillQuaternary: '#f8fafc'
  }
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<DegradationAnalytics />} />
            <Route path="/comparison" element={<ChemistryComparison />} />
            <Route path="/reports" element={<TestReportGenerator />} />
            <Route path="/data" element={<DataManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;