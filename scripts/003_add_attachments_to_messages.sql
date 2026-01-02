-- Add attachments column to chat_messages table
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN chat_messages.attachments IS 'Array of file attachments with url, filename, size, and type';
