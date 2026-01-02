CREATE TABLE IF NOT EXISTS public.chat_file_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES public.chat_files(id) ON DELETE CASCADE,
  content TEXT,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_file_chunks_vector_idx
  ON public.chat_file_chunks USING ivfflat (embedding vector_cosine_ops);

ALTER TABLE public.chat_file_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chunks through their files"
  ON public.chat_file_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_files f
      WHERE f.id = chat_file_chunks.file_id
      AND f.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION match_file_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  file_ids uuid[]
)
RETURNS TABLE (
  id uuid,
  file_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    id,
    file_id,
    content,
    1 - (chat_file_chunks.embedding <=> query_embedding) AS similarity
  FROM chat_file_chunks
  WHERE file_id = ANY(file_ids)
  AND 1 - (chat_file_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
