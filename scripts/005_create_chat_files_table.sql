CREATE TABLE IF NOT EXISTS public.chat_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  file_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files"
  ON public.chat_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own files"
  ON public.chat_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON public.chat_files FOR DELETE
  USING (auth.uid() = user_id);
