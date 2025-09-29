import React from 'react';
import Icon from '../../../components/AppIcon';
import { useSystemStats } from '../../../hooks/useSystemStats';

const SystemStatsCards = () => {
  const { statsForDisplay, loading, error } = useSystemStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="w-12 h-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-6 bg-muted rounded"></div>
              <div className="w-24 h-4 bg-muted rounded"></div>
              <div className="w-32 h-3 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={24} className="text-error mx-auto mb-2" />
        <p className="text-error font-medium">Failed to load statistics</p>
        <p className="text-muted-foreground text-sm mt-1">{error}</p>
      </div>
    );
  }

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsForDisplay?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.iconColor} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(stat?.changeType)}`}>
              <Icon name={getChangeIcon(stat?.changeType)} size={16} />
              <span className="text-sm font-medium">{stat?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{stat?.value}</h3>
            <p className="text-sm font-medium text-foreground">{stat?.title}</p>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemStatsCards;