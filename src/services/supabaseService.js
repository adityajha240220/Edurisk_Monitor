// src/services/supabaseService.js
import { supabase } from '../lib/supabase';

export const supabaseService = {
  // Student services
  async getStudents(options = {}) {
    try {
      let query = supabase
        ?.from('students')
        ?.select(`
          *,
          institution:institutions(name, district),
          mentor:user_profiles!students_mentor_id_fkey(full_name, email)
        `);

      // Apply filters with optional chaining
      if (options?.institutionId) {
        query = query?.eq('institution_id', options?.institutionId);
      }

      if (options?.mentorId) {
        query = query?.eq('mentor_id', options?.mentorId);
      }

      if (options?.riskLevel) {
        query = query?.eq('risk_level', options?.riskLevel);
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query?.order(options?.orderBy?.column || 'name', { 
          ascending: options?.orderBy?.ascending ?? true 
        });
      } else {
        query = query?.order('name', { ascending: true });
      }

      // Apply pagination
      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  async getStudentById(id) {
    try {
      const { data, error } = await supabase
        ?.from('students')
        ?.select(`
          *,
          institution:institutions(*),
          mentor:user_profiles!students_mentor_id_fkey(full_name, email, phone),
          risk_assessments(*),
          counseling_notes(*)
        `)
        ?.eq('id', id)
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  async updateStudent(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('students')
        ?.update(updates)
        ?.eq('id', id)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Risk assessment services
  async createRiskAssessment(assessmentData) {
    try {
      const { data, error } = await supabase
        ?.from('risk_assessments')
        ?.insert(assessmentData)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  async getRiskAssessments(studentId) {
    try {
      const { data, error } = await supabase
        ?.from('risk_assessments')
        ?.select(`
          *,
          assessor:user_profiles!risk_assessments_assessor_id_fkey(full_name)
        `)
        ?.eq('student_id', studentId)
        ?.order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  // Counseling notes services
  async createCounselingNote(noteData) {
    try {
      const { data, error } = await supabase
        ?.from('counseling_notes')
        ?.insert(noteData)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  async getCounselingNotes(studentId) {
    try {
      const { data, error } = await supabase
        ?.from('counseling_notes')
        ?.select(`
          *,
          mentor:user_profiles!counseling_notes_mentor_id_fkey(full_name)
        `)
        ?.eq('student_id', studentId)
        ?.order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  // Institution services
  async getInstitutions() {
    try {
      const { data, error } = await supabase
        ?.from('institutions')
        ?.select('*')
        ?.order('name', { ascending: true });

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  async getInstitutionById(id) {
    try {
      const { data, error } = await supabase
        ?.from('institutions')
        ?.select(`
          *,
          students(count),
          user_profiles(count)
        `)
        ?.eq('id', id)
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // System statistics services
  async getSystemStats() {
    try {
      const { data, error } = await supabase?.rpc('calculate_risk_statistics');
      
      if (error) {
        return { error };
      }

      // Get additional stats from system_stats table
      const { data: additionalStats, error: statsError } = await supabase
        ?.from('system_stats')
        ?.select('*');

      if (statsError) {
        return { error: statsError };
      }

      // Combine stats
      const combinedStats = {
        ...data?.[0],
        additionalStats: additionalStats || []
      };

      return { data: combinedStats, error: null };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // System alerts services
  async getSystemAlerts(options = {}) {
    try {
      let query = supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.eq('is_active', true);

      if (options?.targetRole) {
        query = query?.or(`target_role.is.null,target_role.eq.${options?.targetRole}`);
      }

      if (options?.unreadOnly) {
        query = query?.eq('is_read', false);
      }

      query = query?.order('created_at', { ascending: false });

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  async markAlertAsRead(alertId) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({ is_read: true, updated_at: new Date()?.toISOString() })
        ?.eq('id', alertId)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Activity logs services
  async createActivityLog(logData) {
    try {
      const { data, error } = await supabase
        ?.from('activity_logs')
        ?.insert({
          ...logData,
          ip_address: 'client-ip',
          user_agent: navigator?.userAgent || 'Unknown'
        })
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  async getActivityLogs(options = {}) {
    try {
      let query = supabase
        ?.from('activity_logs')
        ?.select(`
          *,
          user:user_profiles!activity_logs_user_id_fkey(full_name, email)
        `);

      if (options?.userId) {
        query = query?.eq('user_id', options?.userId);
      }

      if (options?.activityType) {
        query = query?.eq('activity_type', options?.activityType);
      }

      query = query?.order('created_at', { ascending: false });

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  // User management services
  async getUsers(options = {}) {
    try {
      let query = supabase
        ?.from('user_profiles')
        ?.select(`
          *,
          institution:institutions(name, district)
        `);

      if (options?.role) {
        query = query?.eq('role', options?.role);
      }

      if (options?.institutionId) {
        query = query?.eq('institution_id', options?.institutionId);
      }

      query = query?.order('full_name', { ascending: true });

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  },

  async updateUserProfile(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(updates)
        ?.eq('id', id)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  // Data upload services
  async createDataUpload(uploadData) {
    try {
      const { data, error } = await supabase
        ?.from('data_uploads')
        ?.insert(uploadData)
        ?.select()
        ?.single();
      
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  },

  async getDataUploads(options = {}) {
    try {
      let query = supabase
        ?.from('data_uploads')
        ?.select(`
          *,
          uploader:user_profiles!data_uploads_uploaded_by_fkey(full_name),
          institution:institutions(name)
        `);

      if (options?.institutionId) {
        query = query?.eq('institution_id', options?.institutionId);
      }

      query = query?.order('created_at', { ascending: false });

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } };
    }
  }
};