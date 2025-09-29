import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents,
      icon: 'Users',
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    {
      title: 'High Risk',
      value: stats?.highRisk,
      icon: 'AlertTriangle',
      color: 'bg-error',
      textColor: 'text-error-foreground',
      trend: stats?.highRiskTrend
    },
    {
      title: 'Medium Risk',
      value: stats?.mediumRisk,
      icon: 'AlertCircle',
      color: 'bg-warning',
      textColor: 'text-warning-foreground',
      trend: stats?.mediumRiskTrend
    },
    {
      title: 'Low Risk',
      value: stats?.lowRisk,
      icon: 'CheckCircle',
      color: 'bg-success',
      textColor: 'text-success-foreground',
      trend: stats?.lowRiskTrend
    },
    {
      title: 'Pending Sessions',
      value: stats?.pendingSessions,
      icon: 'Calendar',
      color: 'bg-accent',
      textColor: 'text-accent-foreground'
    },
    {
      title: 'Completed Sessions',
      value: stats?.completedSessions,
      icon: 'CheckSquare',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-error' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-success' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 hover-lift">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${card?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.textColor} />
            </div>
            {card?.trend !== undefined && (
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(card?.trend)?.icon} 
                  size={16} 
                  className={getTrendIcon(card?.trend)?.color} 
                />
                <span className={`text-xs font-medium ${getTrendIcon(card?.trend)?.color}`}>
                  {Math.abs(card?.trend)}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">{card?.value}</p>
            <p className="text-sm text-muted-foreground">{card?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStatsCards;