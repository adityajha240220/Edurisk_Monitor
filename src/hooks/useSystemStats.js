// src/hooks/useSystemStats.js
import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

export const useSystemStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskStudents: 0,
    mediumRiskStudents: 0,
    lowRiskStudents: 0,
    avgAttendance: 0,
    additionalStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadStats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: loadError } = await supabaseService?.getSystemStats();

    if (loadError) {
      setError(loadError?.message || 'Failed to load statistics');
    } else {
      setStats({
        totalStudents: data?.total_students || 0,
        highRiskStudents: data?.high_risk_students || 0,
        mediumRiskStudents: data?.medium_risk_students || 0,
        lowRiskStudents: data?.low_risk_students || 0,
        avgAttendance: data?.avg_attendance || 0,
        additionalStats: data?.additionalStats || []
      });
    }

    setLoading(false);
  };

  // Transform stats for dashboard display
  const getStatsForDisplay = () => {
    return [
      {
        id: 1,
        title: 'Total Students',
        value: stats?.totalStudents?.toString() || '0',
        change: '+3.2%',
        changeType: 'positive',
        icon: 'Users',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        description: 'Active student enrollments'
      },
      {
        id: 2,
        title: 'High Risk Students',
        value: stats?.highRiskStudents?.toString() || '0',
        change: '-5.1%',
        changeType: 'negative',
        icon: 'AlertTriangle',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
        description: 'Students requiring intervention'
      },
      {
        id: 3,
        title: 'Medium Risk Students',
        value: stats?.mediumRiskStudents?.toString() || '0',
        change: '+8.7%',
        changeType: 'positive',
        icon: 'AlertCircle',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
        description: 'Students needing attention'
      },
      {
        id: 4,
        title: 'Low Risk Students',
        value: stats?.lowRiskStudents?.toString() || '0',
        change: '+12.3%',
        changeType: 'positive',
        icon: 'CheckCircle',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
        description: 'Students performing well'
      },
      {
        id: 5,
        title: 'Average Attendance',
        value: `${parseFloat(stats?.avgAttendance || 0)?.toFixed(1)}%`,
        change: '+2.1%',
        changeType: 'positive',
        icon: 'Calendar',
        iconColor: 'text-accent',
        iconBg: 'bg-accent/10',
        description: 'Overall attendance rate'
      },
      {
        id: 6,
        title: 'Active Institutions',
        value: stats?.additionalStats?.find(s => s?.stat_name === 'total_institutions')?.stat_value?.toString() || '0',
        change: '+1',
        changeType: 'positive',
        icon: 'Building',
        iconColor: 'text-secondary',
        iconBg: 'bg-secondary/10',
        description: 'Connected institutions'
      }
    ];
  };

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  // Auto-refresh stats every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        loadStats();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
    statsForDisplay: getStatsForDisplay()
  };
};