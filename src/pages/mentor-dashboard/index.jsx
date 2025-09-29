import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import StudentListTable from './components/StudentListTable';
import SummaryStatsCards from './components/SummaryStatsCards';
import FilterControls from './components/FilterControls';
import CounselingNotesTimeline from './components/CounselingNotesTimeline';
import NotificationCenter from './components/NotificationCenter';

const MentorDashboard = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    attendance: 'all',
    feeStatus: 'all'
  });

  // Mock data for students
  const [students] = useState([
    {
      id: 1,
      name: "Aditya Aman",
      rollNumber: "CS2021001",
      riskLevel: "Orange",
      attendance: 45,
      testScore: 32,
      feeStatus: "Overdue"
    },
    {
      id: 2,
      name: "Maahi Ujjain",
      rollNumber: "CS2021002",
      riskLevel: "Yellow",
      attendance: 72,
      testScore: 68,
      feeStatus: "Pending"
    },
    {
      id: 3,
      name: "Ayush Srivastava",
      rollNumber: "CS2021003",
      riskLevel: "Green",
      attendance: 92,
      testScore: 85,
      feeStatus: "Paid"
    },
    {
      id: 4,
      name: "Sahil Verma",
      rollNumber: "CS2021004",
      riskLevel: "Orange",
      attendance: 38,
      testScore: 28,
      feeStatus: "Overdue"
    },
    {
      id: 5,
      name: "Aanchal Kumari",
      rollNumber: "CS2021005",
      riskLevel: "Yellow",
      attendance: 78,
      testScore: 72,
      feeStatus: "Paid"
    },
    {
      id: 6,
      name: "Karambir Gulia",
      rollNumber: "CS2021006",
      riskLevel: "Green",
      attendance: 88,
      testScore: 91,
      feeStatus: "Paid"
    },
    {
      id: 7,
      name: "Nitin Vishwakarma",
      rollNumber: "CS2021007",
      riskLevel: "Yellow",
      attendance: 65,
      testScore: 58,
      feeStatus: "Pending"
    },
    {
      id: 8,
      name: "Sneha Yadav",
      rollNumber: "CS2021008",
      riskLevel: "Green",
      attendance: 95,
      testScore: 89,
      feeStatus: "Paid"
    }
  ]);

  // Mock data for summary statistics
  const [summaryStats] = useState({
    totalStudents: 8,
    highRisk: 2,
    highRiskTrend: 1,
    mediumRisk: 2,
    mediumRiskTrend: -1,
    lowRisk: 4,
    lowRiskTrend: 0,
    pendingSessions: 5,
    completedSessions: 12
  });

  // Mock data for counseling notes
  const [counselingNotes, setCounselingNotes] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: "Aditya Aman",
      mentorName: "Prof.(Dr.) Kanika Kaur",
      interventionType: "Academic Support",
      content: `Met with Aditya to discuss his declining attendance and academic performance. He mentioned facing financial difficulties at home which is affecting his focus on studies.\n\nAction taken:\n- Provided information about scholarship opportunities\n- Arranged for peer tutoring support\n- Scheduled follow-up meeting next week`,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Maahi Ujjain",
      mentorName: "Dr. Atul Kumar",
      interventionType: "Personal Counseling",
      content: `Maahi approached me regarding stress management issues. She's been overwhelmed with coursework and part-time job responsibilities.\n\nDiscussion points:\n- Time management strategies\n- Stress reduction techniques\n- Academic workload prioritization`,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      followUpRequired: false
    },
    {
      id: 3,
      studentId: 4,
      studentName: "Ayush Srivastava",
      mentorName: "Dr. Seema Sharma",
      interventionType: "Family Meeting",
      content: `Conducted meeting with Ayush's parents to discuss his academic performance and attendance issues. Parents were cooperative and committed to providing better support at home.\n\nOutcomes:\n- Parents agreed to monitor study schedule\n- Arranged for home internet connectivity\n- Set up regular parent-teacher communication`,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      message: 'High risk alert: Aditya Aman attendance dropped below 50%',
      studentName: 'Aditya Aman',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      action: {
        label: 'View Profile',
        icon: 'User',
        handler: () => handleViewProfile(1)
      }
    },
    {
      id: 2,
      type: 'warning',
      message: 'Medium risk: Maahi Ujjain test scores declining',
      studentName: 'Maahi Ujjain',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      action: {
        label: 'Add Note',
        icon: 'MessageSquare',
        handler: () => handleAddNote(7)
      }
    },
    {
      id: 3,
      type: 'info',
      message: 'Data sync completed successfully',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'success',
      message: 'Counseling session completed for Sahil Verma',
      studentName: 'Sahil Verma',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 5,
      type: 'warning',
      message: 'Fee payment overdue: Aanchal Kumari',
      studentName: 'Aanchal Kumari',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false
    }
  ]);

  // Filter students based on current filters
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
                         student?.rollNumber?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    
    const matchesRiskLevel = filters?.riskLevel === 'all' || student?.riskLevel === filters?.riskLevel;
    
    const matchesAttendance = filters?.attendance === 'all' || 
      (filters?.attendance === '85+' && student?.attendance >= 85) ||
      (filters?.attendance === '70-84' && student?.attendance >= 70 && student?.attendance < 85) ||
      (filters?.attendance === '50-69' && student?.attendance >= 50 && student?.attendance < 70) ||
      (filters?.attendance === '<50' && student?.attendance < 50);
    
    const matchesFeeStatus = filters?.feeStatus === 'all' || student?.feeStatus === filters?.feeStatus;
    
    return matchesSearch && matchesRiskLevel && matchesAttendance && matchesFeeStatus;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      riskLevel: 'all',
      attendance: 'all',
      feeStatus: 'all'
    });
  };

  const handleRefresh = () => {
    // Simulate data refresh
    console.log('Refreshing data...');
  };

  const handleViewProfile = (studentId) => {
    console.log('Viewing profile for student:', studentId);
    // Navigate to student profile page
  };

  const handleAddNote = (studentId) => {
    setSelectedStudentId(studentId);
    setIsTimelineExpanded(true);
  };

  const handleAddCounselingNote = (studentId, noteContent) => {
    const student = students?.find(s => s?.id === studentId);
    if (!student) return;

    const newNote = {
      id: counselingNotes?.length + 1,
      studentId,
      studentName: student?.name,
      mentorName: "Prof.(Dr.) Kanika Kaur",
      interventionType: "Follow-up",
      content: noteContent,
      timestamp: new Date(),
      followUpRequired: false
    };

    setCounselingNotes(prev => [newNote, ...prev]);
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="mentor" userName="Prof.(Dr.) Kanika Kaur" isAuthenticated={true} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor student risk levels and manage counseling interventions
            </p>
          </div>

          {/* Summary Statistics */}
          <SummaryStatsCards stats={summaryStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Student Management */}
            <div className="xl:col-span-3 space-y-6">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onRefresh={handleRefresh}
                studentCount={filteredStudents?.length}
              />

              {/* Student List Table */}
              <StudentListTable
                students={filteredStudents}
                onViewProfile={handleViewProfile}
                onAddNote={handleAddNote}
                onUpdateRisk={() => {}}
              />

              {/* Counseling Notes Timeline */}
              <CounselingNotesTimeline
                isExpanded={isTimelineExpanded}
                onToggle={() => setIsTimelineExpanded(!isTimelineExpanded)}
                notes={counselingNotes}
                onAddNote={handleAddCounselingNote}
                selectedStudentId={selectedStudentId}
              />
            </div>

            {/* Right Column - Notifications */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <NotificationCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onClearAll={handleClearAllNotifications}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;