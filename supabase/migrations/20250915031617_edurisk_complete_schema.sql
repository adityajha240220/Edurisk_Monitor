-- Location: supabase/migrations/20250915031617_edurisk_complete_schema.sql
-- Schema Analysis: Fresh project - no existing schema detected
-- Integration Type: Complete new schema for educational risk monitoring
-- Dependencies: None - creating complete system

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'ministry');
CREATE TYPE public.risk_level AS ENUM ('Green', 'Yellow', 'Orange', 'Red');
CREATE TYPE public.fee_status AS ENUM ('Paid', 'Pending', 'Overdue');
CREATE TYPE public.activity_type AS ENUM ('login', 'data_upload', 'student_update', 'risk_assessment', 'system_config');
CREATE TYPE public.alert_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.institution_type AS ENUM ('school', 'college', 'university', 'training_center');

-- 2. Core Tables (no foreign keys)

-- User profiles table (critical intermediary)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'mentor'::public.user_role,
    phone TEXT,
    department TEXT,
    institution_id UUID,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Institutions table
CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    institution_type public.institution_type NOT NULL,
    address TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    total_students INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    established_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent Tables (with foreign keys)

-- Update user_profiles with institution reference
ALTER TABLE public.user_profiles 
ADD CONSTRAINT fk_user_profiles_institution 
FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;

-- Students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number TEXT NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    father_name TEXT,
    mother_name TEXT,
    guardian_phone TEXT,
    address TEXT,
    class_grade TEXT,
    section TEXT,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    risk_level public.risk_level DEFAULT 'Green'::public.risk_level,
    attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_test_score INTEGER DEFAULT 0,
    fee_status public.fee_status DEFAULT 'Pending'::public.fee_status,
    fee_due_date DATE,
    emergency_contact TEXT,
    medical_info TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Risk assessments table
CREATE TABLE public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assessor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    risk_level public.risk_level NOT NULL,
    risk_factors JSONB DEFAULT '[]'::jsonb,
    assessment_notes TEXT,
    recommendation TEXT,
    follow_up_date DATE,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Counseling notes table
CREATE TABLE public.counseling_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    note_type TEXT DEFAULT 'general',
    content TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT false,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System alerts table
CREATE TABLE public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    priority public.alert_priority DEFAULT 'medium'::public.alert_priority,
    target_role public.user_role,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System statistics table
CREATE TABLE public.system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_name TEXT NOT NULL UNIQUE,
    stat_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    stat_unit TEXT,
    category TEXT DEFAULT 'general',
    last_calculated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Data uploads table for tracking file uploads
CREATE TABLE public.data_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    upload_status TEXT DEFAULT 'processing',
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    error_records INTEGER DEFAULT 0,
    error_details TEXT,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes (performance optimization)
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_institution ON public.user_profiles(institution_id);
CREATE INDEX idx_students_institution ON public.students(institution_id);
CREATE INDEX idx_students_mentor ON public.students(mentor_id);
CREATE INDEX idx_students_risk_level ON public.students(risk_level);
CREATE INDEX idx_students_roll_number ON public.students(institution_id, roll_number);
CREATE INDEX idx_risk_assessments_student ON public.risk_assessments(student_id);
CREATE INDEX idx_risk_assessments_date ON public.risk_assessments(created_at);
CREATE INDEX idx_counseling_notes_student ON public.counseling_notes(student_id);
CREATE INDEX idx_counseling_notes_mentor ON public.counseling_notes(mentor_id);
CREATE INDEX idx_system_alerts_role ON public.system_alerts(target_role);
CREATE INDEX idx_system_alerts_institution ON public.system_alerts(institution_id);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_date ON public.activity_logs(created_at);
CREATE INDEX idx_data_uploads_institution ON public.data_uploads(institution_id);

-- 5. Functions (before RLS policies)

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'mentor')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to update system statistics
CREATE OR REPLACE FUNCTION public.update_system_stat(stat_name TEXT, new_value DECIMAL)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
INSERT INTO public.system_stats (stat_name, stat_value, last_calculated)
VALUES (stat_name, new_value, CURRENT_TIMESTAMP)
ON CONFLICT (stat_name) 
DO UPDATE SET 
    stat_value = new_value,
    last_calculated = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP;
$$;

-- Function to calculate risk statistics
CREATE OR REPLACE FUNCTION public.calculate_risk_statistics()
RETURNS TABLE(
    total_students BIGINT,
    high_risk_students BIGINT,
    medium_risk_students BIGINT,
    low_risk_students BIGINT,
    avg_attendance DECIMAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
    COUNT(*) as total_students,
    COUNT(*) FILTER (WHERE s.risk_level = 'Orange' OR s.risk_level = 'Red') as high_risk_students,
    COUNT(*) FILTER (WHERE s.risk_level = 'Yellow') as medium_risk_students,
    COUNT(*) FILTER (WHERE s.risk_level = 'Green') as low_risk_students,
    COALESCE(AVG(s.attendance_percentage), 0) as avg_attendance
FROM public.students s
WHERE s.is_active = true;
$$;

-- Function for admin role check using auth metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Function to check institution access
CREATE OR REPLACE FUNCTION public.has_institution_access(institution_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND (up.role = 'admin' OR up.institution_id = institution_uuid)
)
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_uploads ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read for institutions with admin write access
CREATE POLICY "public_can_read_institutions"
ON public.institutions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_can_manage_institutions"
ON public.institutions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 7: Complex access for students - institution-based access
CREATE POLICY "institution_users_access_students"
ON public.students
FOR SELECT
TO authenticated
USING (public.has_institution_access(institution_id));

CREATE POLICY "mentors_can_manage_assigned_students"
ON public.students
FOR ALL
TO authenticated
USING (mentor_id = auth.uid())
WITH CHECK (mentor_id = auth.uid());

CREATE POLICY "admin_can_manage_all_students"
ON public.students
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for risk assessments
CREATE POLICY "users_manage_own_risk_assessments"
ON public.risk_assessments
FOR ALL
TO authenticated
USING (assessor_id = auth.uid())
WITH CHECK (assessor_id = auth.uid());

CREATE POLICY "users_can_view_student_risk_assessments"
ON public.risk_assessments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.students s
        WHERE s.id = student_id 
        AND public.has_institution_access(s.institution_id)
    )
);

-- Pattern 2: Simple user ownership for counseling notes
CREATE POLICY "mentors_manage_own_counseling_notes"
ON public.counseling_notes
FOR ALL
TO authenticated
USING (mentor_id = auth.uid())
WITH CHECK (mentor_id = auth.uid());

-- Pattern 6: Role-based access for system alerts
CREATE POLICY "users_view_relevant_alerts"
ON public.system_alerts
FOR SELECT
TO authenticated
USING (
    target_role IS NULL OR 
    target_role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()) OR
    public.is_admin_from_auth()
);

CREATE POLICY "admin_manage_system_alerts"
ON public.system_alerts
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for activity logs
CREATE POLICY "users_view_own_activity_logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "system_creates_activity_logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Pattern 6: Role-based access for system stats
CREATE POLICY "authenticated_users_read_system_stats"
ON public.system_stats
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_system_stats"
ON public.system_stats
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 7: Institution-based access for data uploads
CREATE POLICY "users_view_institution_data_uploads"
ON public.data_uploads
FOR SELECT
TO authenticated
USING (public.has_institution_access(institution_id));

CREATE POLICY "users_manage_own_data_uploads"
ON public.data_uploads
FOR ALL
TO authenticated
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

-- 8. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at
    BEFORE UPDATE ON public.institutions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    mentor_uuid UUID := gen_random_uuid();
    ministry_uuid UUID := gen_random_uuid();
    institution1_uuid UUID := gen_random_uuid();
    institution2_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    student3_uuid UUID := gen_random_uuid();
    student4_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@edurisk.edu', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (mentor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mentor@edurisk.edu', crypt('mentor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mentor User", "role": "mentor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (ministry_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'ministry@edurisk.edu', crypt('ministry123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ministry User", "role": "ministry"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create institutions
    INSERT INTO public.institutions (id, name, institution_type, district, state, total_students) VALUES
        (institution1_uuid, 'Government Higher Secondary School', 'school', 'Chennai', 'Tamil Nadu', 450),
        (institution2_uuid, 'Regional Engineering College', 'college', 'Bangalore', 'Karnataka', 1200);

    -- Update user profiles with institution assignments
    UPDATE public.user_profiles 
    SET institution_id = institution1_uuid, department = 'Student Affairs'
    WHERE id = mentor_uuid;

    -- Create students
    INSERT INTO public.students (id, roll_number, name, institution_id, mentor_id, risk_level, attendance_percentage, last_test_score, fee_status, class_grade) VALUES
        (student1_uuid, 'STU001', 'Arjun Kumar', institution1_uuid, mentor_uuid, 'Green'::public.risk_level, 92.5, 85, 'Paid'::public.fee_status, '12-A'),
        (student2_uuid, 'STU002', 'Priya Sharma', institution1_uuid, mentor_uuid, 'Yellow'::public.risk_level, 78.3, 72, 'Pending'::public.fee_status, '12-A'),
        (student3_uuid, 'STU003', 'Rahul Singh', institution1_uuid, mentor_uuid, 'Orange'::public.risk_level, 65.0, 58, 'Overdue'::public.fee_status, '12-B'),
        (student4_uuid, 'STU004', 'Anita Patel', institution2_uuid, NULL, 'Green'::public.risk_level, 88.7, 90, 'Paid'::public.fee_status, 'B.Tech-CSE');

    -- Create risk assessments
    INSERT INTO public.risk_assessments (student_id, assessor_id, risk_level, assessment_notes, recommendation) VALUES
        (student2_uuid, mentor_uuid, 'Yellow'::public.risk_level, 'Declining attendance and grades', 'Increase mentoring sessions'),
        (student3_uuid, mentor_uuid, 'Orange'::public.risk_level, 'Very poor attendance and financial stress', 'Immediate intervention required');

    -- Create counseling notes
    INSERT INTO public.counseling_notes (student_id, mentor_id, content, note_type) VALUES
        (student2_uuid, mentor_uuid, 'Discussed attendance issues and provided study plan', 'academic'),
        (student3_uuid, mentor_uuid, 'Family facing financial difficulties, exploring scholarship options', 'financial');

    -- Create system alerts
    INSERT INTO public.system_alerts (title, message, alert_type, priority, target_role, institution_id, created_by) VALUES
        ('High Risk Students Alert', '3 students require immediate attention', 'risk_alert', 'high'::public.alert_priority, 'mentor'::public.user_role, institution1_uuid, admin_uuid),
        ('System Maintenance', 'Scheduled maintenance this weekend', 'system', 'medium'::public.alert_priority, 'admin'::public.user_role, NULL, admin_uuid);

    -- Initialize system statistics
    INSERT INTO public.system_stats (stat_name, stat_value, stat_unit, category) VALUES
        ('total_students', 4, 'count', 'students'),
        ('high_risk_students', 1, 'count', 'risk'),
        ('medium_risk_students', 1, 'count', 'risk'),
        ('low_risk_students', 2, 'count', 'risk'),
        ('average_attendance', 81.125, 'percentage', 'academic'),
        ('total_institutions', 2, 'count', 'institutions'),
        ('active_mentors', 1, 'count', 'users'),
        ('total_alerts', 2, 'count', 'alerts');

    -- Create activity logs
    INSERT INTO public.activity_logs (user_id, activity_type, description) VALUES
        (admin_uuid, 'login'::public.activity_type, 'Admin user logged into the system'),
        (mentor_uuid, 'student_update'::public.activity_type, 'Updated student risk assessment'),
        (admin_uuid, 'system_config'::public.activity_type, 'Modified system alert settings');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;