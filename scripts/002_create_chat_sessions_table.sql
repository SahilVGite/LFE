CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_sessions_user_idx
  ON public.chat_sessions(user_id, updated_at DESC);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Track if a specific session has already been billed 5 credits
ALTER TABLE public.chat_sessions
ADD COLUMN IF NOT EXISTS credits_charged BOOLEAN DEFAULT FALSE;

-- Ensure RLS allows the server-side logic to update this status
CREATE POLICY "Allow system updates to session charges"
ON public.chat_sessions FOR UPDATE
USING (auth.uid() = user_id);
