import React from 'react';
import { Card, Statistic } from 'antd';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  icon?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  suffix, 
  prefix, 
  trend, 
  color = '#1e293b',
  icon 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUpIcon size={16} style={{ color: '#059669' }} />;
    if (trend === 'down') return <TrendingDownIcon size={16} style={{ color: '#dc2626' }} />;
    return <ActivityIcon size={16} style={{ color: '#2563eb' }} />;
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow"
      style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: '#475569' }}>{title}</span>
        {icon || getTrendIcon()}
      </div>
      <Statistic 
        value={value}
        suffix={suffix}
        prefix={prefix}
        valueStyle={{ 
          color,
          fontSize: '24px',
          fontWeight: '600'
        }}
      />
    </Card>
  );
};

export default KPICard;