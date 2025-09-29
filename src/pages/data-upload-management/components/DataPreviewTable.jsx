import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DataPreviewTable = ({ data, onColumnMapping, onValidationFix }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnMappings, setColumnMappings] = useState({});
  const itemsPerPage = 10;

  const systemColumns = [
    { value: 'student_id', label: 'Student ID' },
    { value: 'name', label: 'Full Name' },
    { value: 'email', label: 'Email Address' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'attendance', label: 'Attendance %' },
    { value: 'test_scores', label: 'Test Scores' },
    { value: 'fee_status', label: 'Fee Status' },
    { value: 'ignore', label: 'Ignore Column' }
  ];

  const mockData = [
    {
      id: 1,
      raw_data: {
        'Student_ID': 'STU001',
        'Full_Name': 'Rahul Sharma',
        'Email_ID': 'rahul.sharma@email.com',
        'Contact': '9876543210',
        'Attendance_Percent': '85',
        'Average_Score': '78',
        'Fee_Paid': 'Yes'
      },
      validation_errors: [],
      status: 'valid'
    },
    {
      id: 2,
      raw_data: {
        'Student_ID': 'STU002',
        'Full_Name': 'Priya Patel',
        'Email_ID': 'invalid-email',
        'Contact': '98765',
        'Attendance_Percent': '92',
        'Average_Score': '85',
        'Fee_Paid': 'No'
      },
      validation_errors: ['Invalid email format', 'Phone number too short'],
      status: 'error'
    },
    {
      id: 3,
      raw_data: {
        'Student_ID': 'STU003',
        'Full_Name': 'Amit Kumar',
        'Email_ID': 'amit.kumar@email.com',
        'Contact': '9876543211',
        'Attendance_Percent': '67',
        'Average_Score': '72',
        'Fee_Paid': 'Partial'
      },
      validation_errors: ['Low attendance warning'],
      status: 'warning'
    },
    {
      id: 4,
      raw_data: {
        'Student_ID': 'STU004',
        'Full_Name': 'Sneha Reddy',
        'Email_ID': 'sneha.reddy@email.com',
        'Contact': '9876543212',
        'Attendance_Percent': '88',
        'Average_Score': '91',
        'Fee_Paid': 'Yes'
      },
      validation_errors: [],
      status: 'valid'
    },
    {
      id: 5,
      raw_data: {
        'Student_ID': '',
        'Full_Name': 'Vikram Singh',
        'Email_ID': 'vikram.singh@email.com',
        'Contact': '9876543213',
        'Attendance_Percent': '75',
        'Average_Score': '68',
        'Fee_Paid': 'No'
      },
      validation_errors: ['Student ID is required'],
      status: 'error'
    }
  ];

  const displayData = data || mockData;
  const columns = displayData?.length > 0 ? Object.keys(displayData?.[0]?.raw_data) : [];
  
  const totalPages = Math.ceil(displayData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayData?.slice(startIndex, startIndex + itemsPerPage);

  const handleColumnMappingChange = (originalColumn, systemColumn) => {
    const newMappings = { ...columnMappings, [originalColumn]: systemColumn };
    setColumnMappings(newMappings);
    onColumnMapping?.(newMappings);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Circle" size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'valid':
        return `${baseClasses} bg-success/10 text-success`;
      case 'warning':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'error':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  if (!displayData?.length) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Data to Preview</h3>
        <p className="text-sm text-muted-foreground">
          Upload a file to see data preview and validation results
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
            <p className="text-sm text-muted-foreground">
              {displayData?.length} records found • Map columns and review validation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-xs text-success">
                  {displayData?.filter(item => item?.status === 'valid')?.length} Valid
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span className="text-xs text-warning">
                  {displayData?.filter(item => item?.status === 'warning')?.length} Warning
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="XCircle" size={14} className="text-error" />
                <span className="text-xs text-error">
                  {displayData?.filter(item => item?.status === 'error')?.length} Error
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {columns?.map((column) => (
            <div key={column} className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                {column}
              </label>
              <Select
                options={systemColumns}
                value={columnMappings?.[column] || ''}
                onChange={(value) => handleColumnMappingChange(column, value)}
                placeholder="Map to system field"
                className="text-xs"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              {columns?.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {column}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Issues
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row) => (
              <tr key={row?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(row?.status)}
                    <span className={getStatusBadge(row?.status)}>
                      {row?.status}
                    </span>
                  </div>
                </td>
                {columns?.map((column) => (
                  <td key={column} className="px-4 py-3 text-sm text-foreground">
                    <div className="max-w-32 truncate" title={row?.raw_data?.[column]}>
                      {row?.raw_data?.[column] || '-'}
                    </div>
                  </td>
                ))}
                <td className="px-4 py-3">
                  {row?.validation_errors?.length > 0 ? (
                    <div className="space-y-1">
                      {row?.validation_errors?.slice(0, 2)?.map((error, index) => (
                        <div key={index} className="text-xs text-error bg-error/10 px-2 py-1 rounded">
                          {error}
                        </div>
                      ))}
                      {row?.validation_errors?.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{row?.validation_errors?.length - 2} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-success">No issues</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayData?.length)} of {displayData?.length} records
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            <span className="text-sm text-foreground px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;