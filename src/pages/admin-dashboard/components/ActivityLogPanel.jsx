import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ActivityLogPanel = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'User Login' },
    { value: 'data_upload', label: 'Data Upload' },
    { value: 'user_management', label: 'User Management' },
    { value: 'system_config', label: 'System Config' },
    { value: 'alert_sent', label: 'Alert Sent' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'admin', label: 'Admin Users' },
    { value: 'mentor', label: 'Mentors' },
    { value: 'hod', label: 'HODs' },
    { value: 'ministry', label: 'Ministry Officials' }
  ];

  const mockActivities = [
    {
      id: 1,
      type: 'data_upload',
      user: 'Prof.(Dr.) Kanika Kaur',
      userRole: 'hod',
      action: 'Uploaded student attendance data for Engineering Department',
      timestamp: '2025-01-14 11:30 AM',
      status: 'success',
      details: '247 records processed successfully'
    },
    {
      id: 2,
      type: 'alert_sent',
      user: 'System',
      userRole: 'system',
      action: 'Orange risk alert sent to guardians',
      timestamp: '2025-01-14 11:15 AM',
      status: 'success',
      details: '15 SMS and 12 email alerts delivered'
    },
    {
      id: 3,
      type: 'user_management',
      user: 'Dr.Atul Kumar',
      userRole: 'admin',
      action: 'Created new mentor account for Prof. Vikram Singh',
      timestamp: '2025-01-14 10:45 AM',
      status: 'success',
      details: 'Account pending email verification'
    },
    {
      id: 4,
      type: 'login',
      user: 'Dr.Seema Sharma',
      userRole: 'ministry',
      action: 'Logged into ministry dashboard',
      timestamp: '2025-01-14 10:30 AM',
      status: 'success',
      details: 'IP: 203.192.45.123'
    },
    {
      id: 5,
      type: 'system_config',
      user: 'Dr.Uma Giri ',
      userRole: 'admin',
      action: 'Updated risk threshold settings',
      timestamp: '2025-01-14 09:20 AM',
      status: 'success',
      details: 'Yellow: 60%, Orange: 40%'
    },
    {
      id: 6,
      type: 'data_upload',
      user: 'Prof.S.S. Aggarwal',
      userRole: 'mentor',
      action: 'Failed to upload test scores data',
      timestamp: '2025-01-14 09:00 AM',
      status: 'error',
      details: 'Invalid CSV format detected'
    }
  ];

  const filteredActivities = mockActivities?.filter(activity => {
    const matchesType = filterType === 'all' || activity?.type === filterType;
    const matchesUser = filterUser === 'all' || activity?.userRole === filterUser;
    return matchesType && matchesUser;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return 'LogIn';
      case 'data_upload': return 'Upload';
      case 'user_management': return 'UserPlus';
      case 'system_config': return 'Settings';
      case 'alert_sent': return 'Bell';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login': return 'text-accent';
      case 'data_upload': return 'text-primary';
      case 'user_management': return 'text-success';
      case 'system_config': return 'text-warning';
      case 'alert_sent': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success';
      case 'error': return 'bg-error/10 text-error';
      case 'warning': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const exportActivityLog = () => {
    console.log('Exporting activity log...');
    // Implement export logic
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Activity Log</h3>
          <Button
            variant="outline"
            onClick={exportActivityLog}
            iconName="Download"
            iconPosition="left"
          >
            Export Log
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Filter by Activity Type"
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
          />
          <Select
            label="Filter by User Role"
            options={userOptions}
            value={filterUser}
            onChange={setFilterUser}
          />
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          {filteredActivities?.map((activity, index) => (
            <div key={activity?.id} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
              <div className={`w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} className={getActivityColor(activity?.type)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground">{activity?.user}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground capitalize">{activity?.userRole}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(activity?.status)}`}>
                      {activity?.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm text-foreground mb-1">{activity?.action}</p>
                <p className="text-xs text-muted-foreground">{activity?.details}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No activities found matching your filters</p>
          </div>
        )}
      </div>
      {/* Pending Tasks */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pending Administrative Tasks</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="UserCheck" size={20} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">15 user accounts pending approval</p>
                <p className="text-xs text-muted-foreground">New mentor and HOD registrations</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <div>
                <p className="text-sm font-medium text-foreground">3 failed data sync operations</p>
                <p className="text-xs text-muted-foreground">Requires manual intervention</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Fix</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={20} className="text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Monthly compliance report due</p>
                <p className="text-xs text-muted-foreground">Due in 2 days</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Generate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPanel;