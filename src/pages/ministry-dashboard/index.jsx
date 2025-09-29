import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import RiskTrendChart from './components/RiskTrendChart';
import DistrictPerformanceChart from './components/DistrictPerformanceChart';
import HighRiskInstitutes from './components/HighRiskInstitutes';
import GeographicRiskMap from './components/GeographicRiskMap';
import AlertMonitoring from './components/AlertMonitoring';
import FilterControls from './components/FilterControls';

const MinistryDashboard = () => {
  const [filters, setFilters] = useState({
    timeRange: '30days',
    district: 'all',
    institutionType: 'all',
    riskLevel: 'all'
  });

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 248000,
    highRiskStudents: 12400,
    interventionSuccessRate: 78.5,
    dropoutPrevention: 92.3,
    activeAlerts: 23,
    criticalInstitutes: 8
  });

  useEffect(() => {
    // Simulate data filtering based on selected filters
    const updateDashboardData = () => {
      // This would typically make an API call with the current filters
      console.log('Updating dashboard data with filters:', filters);
    };

    updateDashboardData();
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const kpiData = [
    {
      title: "Total Students Monitored",
      value: dashboardData?.totalStudents?.toLocaleString(),
      change: "+2.3%",
      changeType: "positive",
      icon: "Users",
      color: "blue"
    },
    {
      title: "High-Risk Students",
      value: dashboardData?.highRiskStudents?.toLocaleString(),
      change: "-1.2%",
      changeType: "positive",
      icon: "AlertTriangle",
      color: "red"
    },
    {
      title: "Intervention Success Rate",
      value: `${dashboardData?.interventionSuccessRate}%`,
      change: "+4.1%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "green"
    },
    {
      title: "Dropout Prevention Rate",
      value: `${dashboardData?.dropoutPrevention}%`,
      change: "+1.8%",
      changeType: "positive",
      icon: "Shield",
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="ministry" 
        userName="Prof.(Dr.) Kanika Kaur" 
        isAuthenticated={true} 
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Ministry Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive state-wide educational analytics and policy insights for strategic decision-making
            </p>
          </div>

          {/* Filter Controls */}
          <FilterControls onFiltersChange={handleFiltersChange} />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                color={kpi?.color}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <RiskTrendChart />
            <DistrictPerformanceChart />
          </div>

          {/* Geographic Risk Map */}
          <div className="mb-8">
            <GeographicRiskMap />
          </div>

          {/* High-Risk Institutes */}
          <div className="mb-8">
            <HighRiskInstitutes />
          </div>

          {/* Alert Monitoring */}
          <div className="mb-8">
            <AlertMonitoring />
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Policy Impact Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Policy Impact Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Early Warning System</span>
                  <span className="text-sm font-medium text-success">+15% effectiveness</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Counseling Programs</span>
                  <span className="text-sm font-medium text-success">+23% participation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Financial Aid Distribution</span>
                  <span className="text-sm font-medium text-success">+8% coverage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dropout Rate Reduction</span>
                  <span className="text-sm font-medium text-success">-12% overall</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Integration Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alert System</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Freshness</span>
                  <span className="text-sm font-medium text-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Connected Institutions</span>
                  <span className="text-sm font-medium text-foreground">1,247 / 1,250</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">📊</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Generate Monthly Report</div>
                      <div className="text-xs text-muted-foreground">Comprehensive analytics report</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">🚨</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Review Critical Alerts</div>
                      <div className="text-xs text-muted-foreground">{dashboardData?.activeAlerts} pending alerts</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">📋</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Policy Implementation</div>
                      <div className="text-xs text-muted-foreground">Track policy effectiveness</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MinistryDashboard;