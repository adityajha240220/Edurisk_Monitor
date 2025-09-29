import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertMonitoring = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const alerts = [
    {
      id: 1,
      type: 'orange',
      title: 'Critical Student Risk Alert',
      institution: 'Government Engineering College, Jaipur',
      student: 'Rahul Sharma (Roll: 2021CS045)',
      description: 'Student showing multiple risk indicators: 45% attendance, failing grades in 3 subjects, fee payment overdue by 60 days',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'active',
      priority: 'high',
      district: 'Jaipur'
    },
    {
      id: 2,
      type: 'orange',
      title: 'Institutional Risk Threshold Exceeded',
      institution: 'Rajasthan Institute of Technology, Kota',
      student: null,
      description: 'Institution has exceeded 5% high-risk student threshold. Current rate: 6.2% (192 out of 3200 students)',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'active',
      priority: 'high',
      district: 'Kota'
    },
    {
      id: 3,
      type: 'orange',
      title: 'Multiple Student Risk Escalation',
      institution: 'Government Medical College, Jodhpur',
      student: 'Priya Patel, Amit Kumar, Sneha Singh (+2 more)',
      description: 'Five students have escalated from medium to high risk in the past 48 hours due to poor academic performance',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'acknowledged',
      priority: 'medium',
      district: 'Jodhpur'
    },
    {
      id: 4,
      type: 'orange',
      title: 'Fee Payment Crisis Alert',
      institution: 'Arts & Science College, Udaipur',
      student: 'Vikram Desai (Roll: 2022AS078)',
      description: 'Student fee payment overdue by 90 days, combined with declining attendance (38%) and academic performance',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'resolved',
      priority: 'medium',
      district: 'Udaipur'
    },
    {
      id: 5,
      type: 'orange',
      title: 'District Risk Level Increase',
      institution: 'Multiple Institutions - Jaipur District',
      student: null,
      description: 'District-wide risk level has increased by 15% over the past month. Requires policy intervention review',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'active',
      priority: 'high',
      district: 'Jaipur'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Alerts' },
    { value: 'active', label: 'Active' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'high', label: 'High Priority' }
  ];

  const filteredAlerts = alerts?.filter(alert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return alert?.priority === 'high';
    return alert?.status === selectedFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800 border-red-200',
      acknowledged: 'bg-orange-100 text-orange-800 border-orange-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors?.[status] || colors?.active;
  };

  const getPriorityIcon = (priority) => {
    return priority === 'high' ? 'AlertTriangle' : 'AlertCircle';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Alert Monitoring</h3>
          <p className="text-sm text-muted-foreground">Orange-level alerts requiring ministry intervention</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {filterOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={selectedFilter === option?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {filteredAlerts?.map((alert) => (
          <div key={alert?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getPriorityIcon(alert?.priority)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                  <h4 className="font-medium text-foreground mb-1">{alert?.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(alert?.status)}`}>
                      {alert?.status?.charAt(0)?.toUpperCase() + alert?.status?.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert?.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Building" size={14} />
                    <span>{alert?.institution}</span>
                  </div>
                  
                  {alert?.student && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="User" size={14} />
                      <span>{alert?.student}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={14} />
                    <span>{alert?.district} District</span>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-4">{alert?.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert?.priority === 'high' ?'bg-red-100 text-red-800' :'bg-orange-100 text-orange-800'
                    }`}>
                      {alert?.priority?.charAt(0)?.toUpperCase() + alert?.priority?.slice(1)} Priority
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {alert?.status === 'active' && (
                      <>
                        <Button variant="outline" size="sm" iconName="Check" iconPosition="left">
                          Acknowledge
                        </Button>
                        <Button variant="default" size="sm" iconName="Eye" iconPosition="left">
                          Investigate
                        </Button>
                      </>
                    )}
                    {alert?.status === 'acknowledged' && (
                      <Button variant="default" size="sm" iconName="CheckCircle" iconPosition="left">
                        Mark Resolved
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" iconName="ExternalLink" iconPosition="left">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAlerts?.length} of {alerts?.length} alerts
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertMonitoring;