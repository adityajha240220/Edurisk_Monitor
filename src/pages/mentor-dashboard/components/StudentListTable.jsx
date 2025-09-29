import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useStudents } from '../../../hooks/useStudents';

const StudentListTable = ({ onViewProfile, onAddNote, onUpdateRisk }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const { students, loading, error, updateStudentRisk, addCounselingNote } = useStudents();

  // Handle view profile
  const handleViewProfile = (studentId) => {
    if (onViewProfile) {
      onViewProfile(studentId);
    }
  };

  // Handle add note with Supabase integration
  const handleAddNote = async (studentId) => {
    const note = prompt('Enter counseling note:');
    if (!note?.trim()) return;

    const { error: noteError } = await addCounselingNote(studentId, note?.trim());
    
    if (noteError) {
      alert(`Failed to add note: ${noteError?.message}`);
    } else {
      alert('Note added successfully!');
      if (onAddNote) {
        onAddNote(studentId);
      }
    }
  };

  // Handle risk update with Supabase integration
  const handleUpdateRisk = async (studentId) => {
    const riskLevels = ['Green', 'Yellow', 'Orange', 'Red'];
    const currentStudent = students?.find(s => s?.id === studentId);
    const currentRisk = currentStudent?.risk_level || 'Green';
    
    const newRisk = prompt(
      `Current risk level: ${currentRisk}\nEnter new risk level (${riskLevels?.join(', ')}):`,
      currentRisk
    );
    
    if (!newRisk || !riskLevels?.includes(newRisk)) return;
    
    const notes = prompt('Assessment notes (optional):') || '';
    
    const { error: riskError } = await updateStudentRisk(studentId, newRisk, notes);
    
    if (riskError) {
      alert(`Failed to update risk: ${riskError?.message}`);
    } else {
      alert('Risk level updated successfully!');
      if (onUpdateRisk) {
        onUpdateRisk(studentId, newRisk);
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Transform students data for display
  const transformedStudents = students?.map(student => ({
    id: student?.id,
    name: student?.name,
    rollNumber: student?.roll_number,
    riskLevel: student?.risk_level,
    attendance: parseFloat(student?.attendance_percentage || 0)?.toFixed(1),
    testScore: student?.last_test_score || 0,
    feeStatus: student?.fee_status,
    institution: student?.institution?.name,
    mentor: student?.mentor?.full_name
  })) || [];

  const sortedStudents = [...transformedStudents]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'riskLevel') {
      const riskOrder = { 'Green': 1, 'Yellow': 2, 'Orange': 3, 'Red': 4 };
      aValue = riskOrder?.[a?.riskLevel];
      bValue = riskOrder?.[b?.riskLevel];
    }

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <Icon name="Loader" size={24} className="animate-spin text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={24} className="text-error mx-auto mb-2" />
        <p className="text-error font-medium">Failed to load students</p>
        <p className="text-muted-foreground text-sm mt-1">{error}</p>
      </div>
    );
  }

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Green':
        return 'bg-success text-success-foreground';
      case 'Yellow':
        return 'bg-warning text-warning-foreground';
      case 'Orange':
        return 'bg-error text-error-foreground';
      case 'Red':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAttendanceColor = (percentage) => {
    const pct = parseFloat(percentage);
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-error';
  };

  const getFeeStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Overdue':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? 
      <Icon name="ArrowUp" size={16} className="text-primary" /> : 
      <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Student Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('riskLevel')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Risk Level</span>
                  <SortIcon field="riskLevel" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('attendance')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Attendance</span>
                  <SortIcon field="attendance" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('testScore')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Test Score</span>
                  <SortIcon field="testScore" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('feeStatus')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Fee Status</span>
                  <SortIcon field="feeStatus" />
                </button>
              </th>
              <th className="text-center p-4">
                <span className="font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents?.map((student) => (
              <tr key={student?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student?.name}</p>
                      <p className="text-sm text-muted-foreground">{student?.rollNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleUpdateRisk(student?.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getRiskBadgeColor(student?.riskLevel)}`}
                  >
                    {student?.riskLevel}
                  </button>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getAttendanceColor(student?.attendance)}`}>
                    {student?.attendance}%
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">{student?.testScore}/100</span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getFeeStatusColor(student?.feeStatus)}`}>
                    {student?.feeStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProfile(student?.id)}
                      iconName="Eye"
                      iconSize={16}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddNote(student?.id)}
                      iconName="MessageSquare"
                      iconSize={16}
                    >
                      Note
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedStudents?.map((student) => (
          <div key={student?.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{student?.name}</p>
                  <p className="text-sm text-muted-foreground">{student?.rollNumber}</p>
                </div>
              </div>
              <button
                onClick={() => handleUpdateRisk(student?.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getRiskBadgeColor(student?.riskLevel)}`}
              >
                {student?.riskLevel}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Attendance</p>
                <p className={`font-medium ${getAttendanceColor(student?.attendance)}`}>
                  {student?.attendance}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Test Score</p>
                <p className="font-medium text-foreground">{student?.testScore}/100</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fee Status</p>
                <p className={`font-medium ${getFeeStatusColor(student?.feeStatus)}`}>
                  {student?.feeStatus}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewProfile(student?.id)}
                iconName="Eye"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddNote(student?.id)}
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Add Note
              </Button>
            </div>
          </div>
        ))}
      </div>

      {sortedStudents?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No students found</p>
          <p className="text-sm">Students will appear here when they are assigned to you</p>
        </div>
      )}
    </div>
  );
};

export default StudentListTable;