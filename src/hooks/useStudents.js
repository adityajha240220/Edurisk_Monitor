// src/hooks/useStudents.js
import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

export const useStudents = (options = {}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, userProfile } = useAuth();

  const loadStudents = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // Build query options based on user role
    const queryOptions = {
      ...options,
      orderBy: { column: 'name', ascending: true }
    };

    // If user is a mentor, filter by their assigned students
    if (userProfile?.role === 'mentor') {
      queryOptions.mentorId = user?.id;
    }

    // If user has institution access, filter by institution
    if (userProfile?.institution_id && userProfile?.role !== 'admin') {
      queryOptions.institutionId = userProfile?.institution_id;
    }

    const { data, error: loadError } = await supabaseService?.getStudents(queryOptions);

    if (loadError) {
      setError(loadError?.message || 'Failed to load students');
    } else {
      setStudents(data || []);
    }

    setLoading(false);
  };

  const updateStudentRisk = async (studentId, riskLevel, notes = '') => {
    if (!user?.id) return { error: { message: 'Authentication required' } };

    // Update student risk level
    const { error: updateError } = await supabaseService?.updateStudent(studentId, {
      risk_level: riskLevel,
      updated_at: new Date()?.toISOString()
    });

    if (updateError) {
      return { error: updateError };
    }

    // Create risk assessment record
    const { error: assessmentError } = await supabaseService?.createRiskAssessment({
      student_id: studentId,
      assessor_id: user?.id,
      risk_level: riskLevel,
      assessment_notes: notes,
      created_at: new Date()?.toISOString()
    });

    if (assessmentError) {
      return { error: assessmentError };
    }

    // Create activity log
    await supabaseService?.createActivityLog({
      user_id: user?.id,
      activity_type: 'risk_assessment',
      description: `Updated student risk level to ${riskLevel}`,
      metadata: { student_id: studentId, new_risk_level: riskLevel }
    });

    // Reload students to reflect changes
    loadStudents();

    return { error: null };
  };

  const addCounselingNote = async (studentId, content, noteType = 'general') => {
    if (!user?.id) return { error: { message: 'Authentication required' } };

    const { error } = await supabaseService?.createCounselingNote({
      student_id: studentId,
      mentor_id: user?.id,
      content,
      note_type: noteType,
      created_at: new Date()?.toISOString()
    });

    if (error) {
      return { error };
    }

    // Create activity log
    await supabaseService?.createActivityLog({
      user_id: user?.id,
      activity_type: 'student_update',
      description: 'Added counseling note for student',
      metadata: { student_id: studentId, note_type: noteType }
    });

    return { error: null };
  };

  useEffect(() => {
    loadStudents();
  }, [user?.id, userProfile?.role, userProfile?.institution_id]);

  return {
    students,
    loading,
    error,
    refetch: loadStudents,
    updateStudentRisk,
    addCounselingNote
  };
};