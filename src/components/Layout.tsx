import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon as DashboardIcon, TrendingUpIcon, BarChart3Icon, FileTextIcon, DatabaseIcon, FlaskConicalIcon } from 'lucide-react';

const { Header, Sider, Content } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardIcon size={18} />,
      label: 'Dashboard',
      onClick: () => navigate('/')
    },
    {
      key: '/analytics',
      icon: <TrendingUpIcon size={18} />,
      label: 'Degradation Analytics',
      onClick: () => navigate('/analytics')
    },
    {
      key: '/comparison',
      icon: <BarChart3Icon size={18} />,
      label: 'Chemistry Comparison',
      onClick: () => navigate('/comparison')
    },
    {
      key: '/reports',
      icon: <FileTextIcon size={18} />,
      label: 'Test Report Generator',
      onClick: () => navigate('/reports')
    },
    {
      key: '/data',
      icon: <DatabaseIcon size={18} />,
      label: 'Data Management',
      onClick: () => navigate('/data')
    }
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={240}
        theme="light"
        style={{
          borderRight: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}>
          <div className="flex items-center gap-3">
            <FlaskConicalIcon size={32} style={{ color: '#2563eb' }} />
            {!collapsed && (
              <div>
                <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                  Battery Lab
                </Title>
                <span className="text-xs" style={{ color: '#64748b' }}>Degradation Analytics</span>
              </div>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            borderRight: 0,
            marginTop: '16px',
            backgroundColor: '#f8fafc'
          }}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
            {menuItems.find(item => item.key === location.pathname)?.label || 'Battery Degradation Lab'}
          </Title>
        </Header>
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#fafaf9',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;