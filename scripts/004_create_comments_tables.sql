-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "comments_select_all" ON public.comments 
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_own" ON public.comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own" ON public.comments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON public.comments 
  FOR DELETE USING (auth.uid() = user_id);

-- Allow admins to delete any comment
CREATE POLICY "comments_admin_delete_all" ON public.comments 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
