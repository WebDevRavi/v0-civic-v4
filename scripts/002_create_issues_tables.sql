-- Create issues table
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('infrastructure', 'sanitation', 'utilities', 'safety', 'environment', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issues
CREATE POLICY "issues_select_all" ON public.issues 
  FOR SELECT USING (true); -- All users can view issues

CREATE POLICY "issues_insert_own" ON public.issues 
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "issues_update_own" ON public.issues 
  FOR UPDATE USING (auth.uid() = reporter_id);

-- Allow admins to update any issue
CREATE POLICY "issues_admin_update_all" ON public.issues 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
