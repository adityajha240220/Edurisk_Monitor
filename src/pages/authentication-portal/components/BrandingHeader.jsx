import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandingHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
          <Icon name="Shield" size={32} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">EduRisk Monitor</h1>
          <p className="text-sm text-muted-foreground">Educational Risk Management Platform</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome to EduRisk Monitor
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Comprehensive platform for educational institutions to monitor student risk levels, 
          manage interventions, and improve academic outcomes through data-driven insights.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">Student Monitoring</p>
            <p className="text-xs text-muted-foreground">Real-time risk assessment</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
            <Icon name="AlertTriangle" size={20} className="text-accent" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">Alert System</p>
            <p className="text-xs text-muted-foreground">Automated notifications</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-full">
            <Icon name="BarChart3" size={20} className="text-success" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">Analytics</p>
            <p className="text-xs text-muted-foreground">Comprehensive reporting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingHeader;