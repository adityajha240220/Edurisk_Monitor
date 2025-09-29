import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'hod', label: 'HOD' },
    { value: 'admin', label: 'Admin' },
    { value: 'ministry', label: 'Ministry Official' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'Prof.(Dr.) Kanika Kaur',
      email: 'kanika.kaur@college.edu',
      role: 'hod',
      institution: 'Government Engineering College',
      status: 'active',
      lastLogin: '2025-01-14 10:30 AM',
      studentsAssigned: 45
    },
    {
      id: 2,
      name: 'Dr.Atul Kumar',
      email: 'atul.kumar@college.edu',
      role: 'mentor',
      institution: 'Government Engineering College',
      status: 'active',
      lastLogin: '2025-01-14 09:15 AM',
      studentsAssigned: 28
    },
    {
      id: 3,
      name: 'Dr.Seema Sharma',
      email: 'seema.sharma@ministry.gov',
      role: 'ministry',
      institution: 'State Education Ministry',
      status: 'active',
      lastLogin: '2025-01-13 04:45 PM',
      studentsAssigned: 0
    },
    {
      id: 4,
      name: 'Dr.Uma Giri',
      email: 'uma.giri@admin.edu',
      role: 'admin',
      institution: 'System Administrator',
      status: 'active',
      lastLogin: '2025-01-14 11:20 AM',
      studentsAssigned: 0
    },
    {
      id: 5,
      name: 'Dr.S.S. Aggarwal',
      email: 'shyamsundar.aggarwal@medical.edu',
      role: 'mentor',
      institution: 'State Medical College',
      status: 'pending',
      lastLogin: 'Never',
      studentsAssigned: 0
    }
  ];

  const filteredUsers = mockUsers?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.institution?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user?.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'hod': return 'Crown';
      case 'mentor': return 'Users';
      case 'admin': return 'Settings';
      case 'ministry': return 'Building';
      default: return 'User';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'inactive': return 'bg-error/10 text-error';
      case 'pending': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleUserAction = (userId, action) => {
    console.log(`${action} user with ID: ${userId}`);
    // Implement user action logic
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="md:col-span-1"
          />
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="Filter by role"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">127</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="UserCheck" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">98</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="UserX" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">New This Week</p>
            </div>
          </div>
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">User Management</h3>
            <Button
              variant="default"
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => handleUserAction(null, 'add')}
            >
              Add New User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Institution</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Last Login</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Students</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="border-b border-border hover:bg-muted/25">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getRoleIcon(user?.role)} size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">{user?.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{user?.institution}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(user?.status)}`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{user?.lastLogin}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{user?.studentsAssigned}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUserAction(user?.id, 'edit')}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUserAction(user?.id, 'delete')}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPanel;