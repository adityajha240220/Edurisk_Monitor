import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onRefresh,
  studentCount 
}) => {
  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'Green', label: 'Low Risk (Green)' },
    { value: 'Yellow', label: 'Medium Risk (Yellow)' },
    { value: 'Orange', label: 'High Risk (Orange)' }
  ];

  const attendanceOptions = [
    { value: 'all', label: 'All Attendance' },
    { value: '85+', label: '85% and above' },
    { value: '70-84', label: '70% - 84%' },
    { value: '50-69', label: '50% - 69%' },
    { value: '<50', label: 'Below 50%' }
  ];

  const feeStatusOptions = [
    { value: 'all', label: 'All Fee Status' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Overdue', label: 'Overdue' }
  ];

  const hasActiveFilters = filters?.riskLevel !== 'all' || 
                          filters?.attendance !== 'all' || 
                          filters?.feeStatus !== 'all' || 
                          filters?.search !== '';

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-xs">
            <Input
              type="search"
              placeholder="Search students..."
              value={filters?.search}
              onChange={(e) => onFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={riskLevelOptions}
              value={filters?.riskLevel}
              onChange={(value) => onFilterChange('riskLevel', value)}
              placeholder="Risk Level"
              className="min-w-[160px]"
            />
            
            <Select
              options={attendanceOptions}
              value={filters?.attendance}
              onChange={(value) => onFilterChange('attendance', value)}
              placeholder="Attendance"
              className="min-w-[160px]"
            />
            
            <Select
              options={feeStatusOptions}
              value={filters?.feeStatus}
              onChange={(value) => onFilterChange('feeStatus', value)}
              placeholder="Fee Status"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-muted-foreground mr-4">
            {studentCount} student{studentCount !== 1 ? 's' : ''} found
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Mobile Student Count */}
      <div className="sm:hidden mt-3 pt-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {studentCount} student{studentCount !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
};

export default FilterControls;