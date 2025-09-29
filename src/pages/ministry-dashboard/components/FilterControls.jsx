import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    timeRange: '30days',
    district: 'all',
    institutionType: 'all',
    riskLevel: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const timeRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Kota', label: 'Kota' },
    { value: 'Bikaner', label: 'Bikaner' },
    { value: 'Jodhpur', label: 'Jodhpur' },
    { value: 'Amer', label: 'Amer' },
    { value: 'Ajmer', label: 'Ajmer' },
    { value: 'Udaipur', label: 'Udaipur' },
    { value: 'Alwar', label: 'Alwar' }
  ];

  const institutionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'medical', label: 'Medical' },
    { value: 'arts-science', label: 'Arts & Science' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'law', label: 'Law' },
    { value: 'pharmacy', label: 'Pharmacy' }
  ];

  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'high', label: 'High Risk Only' },
    { value: 'medium', label: 'Medium Risk Only' },
    { value: 'low', label: 'Low Risk Only' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      timeRange: '30days',
      district: 'all',
      institutionType: 'all',
      riskLevel: 'all'
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.filter(value => value !== 'all' && value !== '30days')?.length;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Advanced Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFiltersCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          />
        </div>
      </div>
      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Time Range</label>
          <div className="flex flex-wrap gap-1">
            {timeRangeOptions?.slice(0, 3)?.map((option) => (
              <Button
                key={option?.value}
                variant={filters?.timeRange === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('timeRange', option?.value)}
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Risk Level</label>
          <div className="flex flex-wrap gap-1">
            {riskLevelOptions?.slice(0, 4)?.map((option) => (
              <Button
                key={option?.value}
                variant={filters?.riskLevel === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('riskLevel', option?.value)}
              >
                {option?.label?.replace(' Only', '')?.replace(' Risk', '')}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">District</label>
          <div className="flex flex-wrap gap-1">
            <Button
              variant={filters?.district === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('district', 'all')}
            >
              All
            </Button>
            <Button
              variant={filters?.district === 'jaipur' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('district', 'jaipur')}
            >
              Jaipur
            </Button>
            <Button
              variant={filters?.district === 'kota' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('district', 'kota')}
            >
              Kota
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Institution</label>
          <div className="flex flex-wrap gap-1">
            <Button
              variant={filters?.institutionType === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('institutionType', 'all')}
            >
              All
            </Button>
            <Button
              variant={filters?.institutionType === 'engineering' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('institutionType', 'engineering')}
            >
              Engineering
            </Button>
          </div>
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">All Time Ranges</label>
              <div className="space-y-2">
                {timeRangeOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant={filters?.timeRange === option?.value ? "default" : "ghost"}
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => handleFilterChange('timeRange', option?.value)}
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">All Districts</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {districtOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant={filters?.district === option?.value ? "default" : "ghost"}
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => handleFilterChange('district', option?.value)}
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Institution Types</label>
              <div className="space-y-2">
                {institutionTypeOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant={filters?.institutionType === option?.value ? "default" : "ghost"}
                    size="sm"
                    fullWidth
                    className="justify-start"
                    onClick={() => handleFilterChange('institutionType', option?.value)}
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Export Options</label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Download"
                  iconPosition="left"
                  className="justify-start"
                >
                  Export Filtered Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="FileText"
                  iconPosition="left"
                  className="justify-start"
                >
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                  className="justify-start"
                >
                  Schedule Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;