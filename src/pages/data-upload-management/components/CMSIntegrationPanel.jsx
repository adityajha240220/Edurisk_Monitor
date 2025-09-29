import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CMSIntegrationPanel = ({ onSyncTrigger, onSettingsUpdate }) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 3600000));
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [selectedSystems, setSelectedSystems] = useState(['erp', 'lms']);

  const cmsSystemsData = [
    {
      id: 'erp',
      name: 'School ERP System',
      status: 'connected',
      lastSync: new Date(Date.now() - 1800000),
      recordsCount: 1247,
      errorCount: 0,
      endpoint: 'https://school-erp.edu.in/api/v1'
    },
    {
      id: 'lms',
      name: 'Learning Management System',
      status: 'connected',
      lastSync: new Date(Date.now() - 3600000),
      recordsCount: 892,
      errorCount: 3,
      endpoint: 'https://lms.college.edu.in/api/v2'
    },
    {
      id: 'attendance',
      name: 'Attendance System',
      status: 'warning',
      lastSync: new Date(Date.now() - 7200000),
      recordsCount: 1156,
      errorCount: 12,
      endpoint: 'https://attendance.school.edu.in/api'
    },
    {
      id: 'fees',
      name: 'Fee Management System',
      status: 'error',
      lastSync: new Date(Date.now() - 86400000),
      recordsCount: 0,
      errorCount: 45,
      endpoint: 'https://fees.institute.edu.in/api/v1'
    }
  ];

  const syncFrequencyOptions = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily at 2:00 AM' },
    { value: 'weekly', label: 'Weekly on Sunday' },
    { value: 'manual', label: 'Manual Only' }
  ];

  const recentSyncLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1800000),
      system: 'School ERP System',
      status: 'success',
      recordsProcessed: 156,
      recordsUpdated: 23,
      errors: 0,
      duration: '2.3s'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000),
      system: 'Learning Management System',
      status: 'success',
      recordsProcessed: 89,
      recordsUpdated: 12,
      errors: 0,
      duration: '1.8s'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7200000),
      system: 'Attendance System',
      status: 'warning',
      recordsProcessed: 234,
      recordsUpdated: 45,
      errors: 3,
      duration: '4.1s'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 86400000),
      system: 'Fee Management System',
      status: 'error',
      recordsProcessed: 0,
      recordsUpdated: 0,
      errors: 15,
      duration: '0.5s'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'disconnected':
        return <Icon name="Circle" size={16} className="text-muted-foreground" />;
      default:
        return <Icon name="Circle" size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'connected': case'success':
        return `${baseClasses} bg-success/10 text-success`;
      case 'warning':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'error':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleManualSync = (systemId) => {
    onSyncTrigger?.(systemId);
    // Simulate sync process
    setTimeout(() => {
      setLastSync(new Date());
    }, 2000);
  };

  const handleSyncAll = () => {
    selectedSystems?.forEach(systemId => {
      onSyncTrigger?.(systemId);
    });
    setLastSync(new Date());
  };

  return (
    <div className="space-y-6">
      {/* CMS Integration Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">CMS Auto-Integration</h3>
            <p className="text-sm text-muted-foreground">
              Real-time connectivity with school and college management systems
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-success font-medium">Live</span>
            </div>
            <Button
              variant="default"
              onClick={handleSyncAll}
              iconName="RefreshCw"
              iconPosition="left"
              disabled={selectedSystems?.length === 0}
            >
              Sync All
            </Button>
          </div>
        </div>

        {/* Auto-Sync Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Auto-Sync Status</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSyncEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-foreground">
                {autoSyncEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sync Frequency</label>
            <Select
              options={syncFrequencyOptions}
              value={syncFrequency}
              onChange={setSyncFrequency}
              disabled={!autoSyncEnabled}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Last Sync</label>
            <p className="text-sm text-muted-foreground">
              {formatTimeAgo(lastSync)}
            </p>
          </div>
        </div>

        {/* Connected Systems */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Connected Systems</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cmsSystemsData?.map((system) => (
              <div key={system?.id} className="border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(system?.status)}
                    <div>
                      <h5 className="text-sm font-medium text-foreground">{system?.name}</h5>
                      <p className="text-xs text-muted-foreground">{system?.endpoint}</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(system?.status)}>
                    {system?.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Records</p>
                    <p className="text-sm font-medium text-foreground">
                      {system?.recordsCount?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Errors</p>
                    <p className={`text-sm font-medium ${
                      system?.errorCount > 0 ? 'text-error' : 'text-success'
                    }`}>
                      {system?.errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatTimeAgo(system?.lastSync)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`system-${system?.id}`}
                      checked={selectedSystems?.includes(system?.id)}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          setSelectedSystems([...selectedSystems, system?.id]);
                        } else {
                          setSelectedSystems(selectedSystems?.filter(id => id !== system?.id));
                        }
                      }}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor={`system-${system?.id}`} className="text-xs text-muted-foreground">
                      Include in auto-sync
                    </label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManualSync(system?.id)}
                    iconName="RefreshCw"
                    disabled={system?.status === 'error'}
                  >
                    Sync Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Sync Logs */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Sync Activity</h3>
          <Button variant="outline" size="sm" iconName="Download">
            Export Logs
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  System
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Records
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentSyncLogs?.map((log) => (
                <tr key={log?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {log?.system}
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(log?.status)}>
                      {log?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div>
                      <span className="font-medium">{log?.recordsProcessed}</span> processed
                      {log?.recordsUpdated > 0 && (
                        <span className="text-muted-foreground"> • {log?.recordsUpdated} updated</span>
                      )}
                      {log?.errors > 0 && (
                        <span className="text-error"> • {log?.errors} errors</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {log?.duration}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatTimeAgo(log?.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CMSIntegrationPanel;