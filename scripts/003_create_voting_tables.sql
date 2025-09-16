-- Create votes table for issue voting
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(issue_id, user_id) -- One vote per user per issue
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes
CREATE POLICY "votes_select_all" ON public.votes 
  FOR SELECT USING (true);

CREATE POLICY "votes_insert_own" ON public.votes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_update_own" ON public.votes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "votes_delete_own" ON public.votes 
  FOR DELETE USING (auth.uid() = user_id);
