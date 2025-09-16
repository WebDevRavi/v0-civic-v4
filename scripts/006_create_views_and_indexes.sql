-- Create view for issue statistics
CREATE OR REPLACE VIEW public.issue_stats AS
SELECT 
  i.id,
  i.title,
  i.category,
  i.status,
  i.priority,
  i.created_at,
  COUNT(v.id) as vote_count,
  COUNT(CASE WHEN v.vote_type = 'upvote' THEN 1 END) as upvotes,
  COUNT(CASE WHEN v.vote_type = 'downvote' THEN 1 END) as downvotes,
  COUNT(c.id) as comment_count,
  p.full_name as reporter_name
FROM public.issues i
LEFT JOIN public.votes v ON i.id = v.issue_id
LEFT JOIN public.comments c ON i.id = c.issue_id
LEFT JOIN public.profiles p ON i.reporter_id = p.id
GROUP BY i.id, i.title, i.category, i.status, i.priority, i.created_at, p.full_name;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON public.issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_reporter_id ON public.issues(reporter_id);
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON public.votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON public.comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
