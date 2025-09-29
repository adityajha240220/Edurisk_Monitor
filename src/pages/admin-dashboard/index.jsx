import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DataUploadPanel from './components/DataUploadPanel';
import UserManagementPanel from './components/UserManagementPanel';
import SystemSettingsPanel from './components/SystemSettingsPanel';
import SystemStatsCards from './components/SystemStatsCards';
import ActivityLogPanel from './components/ActivityLogPanel';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard'
    },
    {
      id: 'data-upload',
      label: 'Data Management',
      icon: 'Upload'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: 'Users'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: 'Settings'
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: 'Activity'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <SystemStatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Upload"
                    iconPosition="left"
                    onClick={() => setActiveTab('data-upload')}
                    className="justify-start"
                  >
                    Upload Student Data
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="UserPlus"
                    iconPosition="left"
                    onClick={() => setActiveTab('user-management')}
                    className="justify-start"
                  >
                    Add New User
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Settings"
                    iconPosition="left"
                    onClick={() => setActiveTab('system-settings')}
                    className="justify-start"
                  >
                    Configure System
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="FileText"
                    iconPosition="left"
                    className="justify-start"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">Database Connection</span>
                    </div>
                    <span className="text-sm text-success">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">CMS Integration</span>
                    </div>
                    <span className="text-sm text-success">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="text-sm text-foreground">Alert System</span>
                    </div>
                    <span className="text-sm text-warning">Degraded</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">Backup Status</span>
                    </div>
                    <span className="text-sm text-success">Up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'data-upload':
        return <DataUploadPanel />;
      case 'user-management':
        return <UserManagementPanel />;
      case 'system-settings':
        return <SystemSettingsPanel />;
      case 'activity-log':
        return <ActivityLogPanel />;
      default:
        return <SystemStatsCards />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" userName="Admin" isAuthenticated={true} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">System administration and management</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap nav-transition ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-200">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;