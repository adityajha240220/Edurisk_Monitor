import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HighRiskInstitutes = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const institutes = [
    {
      id: 1,
      name: "Government Engineering College, Jaipur",
      district: "Jaipur",
      type: "Engineering",
      totalStudents: 2400,
      highRiskCount: 180,
      riskPercentage: 7.5,
      lastUpdated: "2025-09-14",
      alerts: 12,
      status: "critical"
    },
    {
      id: 2,
      name: "Rajasthan Institute of Technology, Kota",
      district: "Kota",
      type: "Engineering",
      totalStudents: 3200,
      highRiskCount: 192,
      riskPercentage: 6.0,
      lastUpdated: "2025-09-14",
      alerts: 8,
      status: "high"
    },
    {
      id: 3,
      name: "Government Medical College, Bikaner",
      district: "Bikaner",
      type: "Medical",
      totalStudents: 1800,
      highRiskCount: 108,
      riskPercentage: 6.0,
      lastUpdated: "2025-09-13",
      alerts: 15,
      status: "critical"
    },
    {
      id: 4,
      name: "Arts & Science College, Jodhpur",
      district: "Jodhpur",
      type: "Arts & Science",
      totalStudents: 2800,
      highRiskCount: 140,
      riskPercentage: 5.0,
      lastUpdated: "2025-09-14",
      alerts: 6,
      status: "high"
    },
    {
      id: 5,
      name: "Commerce College, Udaipur",
      district: "Udaipur",
      type: "Commerce",
      totalStudents: 2200,
      highRiskCount: 110,
      riskPercentage: 5.0,
      lastUpdated: "2025-09-13",
      alerts: 9,
      status: "high"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Institutes' },
    { value: 'critical', label: 'Critical Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'medical', label: 'Medical' }
  ];

  const filteredInstitutes = institutes?.filter(institute => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return institute?.status === 'critical';
    if (selectedFilter === 'high') return institute?.status === 'high';
    if (selectedFilter === 'engineering') return institute?.type === 'Engineering';
    if (selectedFilter === 'medical') return institute?.type === 'Medical';
    return true;
  });

  const getRiskBadgeColor = (status) => {
    return status === 'critical' ?'bg-red-100 text-red-800 border-red-200' :'bg-orange-100 text-orange-800 border-orange-200';
  };

  const getStatusIcon = (status) => {
    return status === 'critical' ? 'AlertTriangle' : 'AlertCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">High-Risk Institutes</h3>
          <p className="text-sm text-muted-foreground">Institutions requiring immediate attention</p>
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
        {filteredInstitutes?.map((institute) => (
          <div key={institute?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRiskBadgeColor(institute?.status)}`}>
                    <Icon name={getStatusIcon(institute?.status)} size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{institute?.name}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span>{institute?.district}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Building" size={14} />
                        <span>{institute?.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>{institute?.totalStudents?.toLocaleString()} students</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-error">{institute?.highRiskCount}</div>
                    <div className="text-xs text-muted-foreground">High Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning">{institute?.riskPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Risk Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{institute?.alerts}</div>
                    <div className="text-xs text-muted-foreground">Active Alerts</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                    View Details
                  </Button>
                  <Button variant="default" size="sm" iconName="FileText" iconPosition="left">
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Last updated: {new Date(institute.lastUpdated)?.toLocaleDateString('en-GB')}</span>
              <span className={`px-2 py-1 rounded-full border ${getRiskBadgeColor(institute?.status)}`}>
                {institute?.status === 'critical' ? 'Critical Risk' : 'High Risk'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInstitutes?.length} of {institutes?.length} institutes
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export PDF
          </Button>
          <Button variant="outline" size="sm" iconName="FileSpreadsheet" iconPosition="left">
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HighRiskInstitutes;