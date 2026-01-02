# Legal Case AI - Complete Documentation

## Overview
Legal Case AI is a ChatGPT-like interface specifically designed for legal case analysis and consultation. Users can chat with an AI assistant powered by Groq (Llama 3.3 70B) and upload legal documents (PDFs, images, Word documents) for analysis.

## Features

### 1. Chat Interface
- **Real-time messaging** with Groq AI assistant
- **Streaming responses** - see AI typing in real-time
- **Session management** - organize conversations by topic
- **Search functionality** - find previous conversations with modal dialog
- **Message actions**:
  - 🔊 **Read Aloud** - Text-to-speech for AI responses
  - 📋 **Copy** - Copy message to clipboard
  - 🔄 **Regenerate** - Get a new AI response
  - 🔗 **Share** - Share via native API or copy link
  - 👍👎 **Feedback** - Rate response quality

### 2. File Upload System
- **Multi-file upload** - attach multiple documents per message
- **Supported formats**:
  - Documents: PDF, DOC, DOCX, TXT
  - Images: JPG, JPEG, PNG, GIF
- **File size limit**: 50MB per file
- **Preview system** - see thumbnails of uploaded files before sending
- **Secure storage** - files stored in Vercel Blob with user-specific paths
- **Drag & drop** support
- **Remove before sending** - delete attachments before submitting

### 3. Authentication
- **Email/password** authentication via Supabase
- **Google OAuth** - One-click sign in with Google
- **Email verification** required for email signups
- **Automatic profile creation** with 10 free credits
- Protected routes with middleware
- Secure session management

### 4. Database Schema

#### Tables:
- **profiles** - user information, credits, role (user/admin)
- **chat_sessions** - conversation sessions with titles
- **chat_messages** - individual messages with role (user/assistant) and file attachments
- **legal_cases** - database of legal precedents
- **search_history** - user search records
- **payment_history** - credit purchase transactions (Razorpay)

#### Row Level Security (RLS):
All tables have RLS policies to ensure users can only access their own data.

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI Provider**: Groq AI (Llama 3.3 70B Versatile)
- **AI SDK**: Vercel AI SDK v5
- **File Storage**: Vercel Blob
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Payments**: Razorpay
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Notifications**: Sonner (toast notifications)

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Environment Variables
Add these to your Vercel project or `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Supabase Redirect (for development)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Groq AI
GROQ_API_KEY=gsk_your_groq_api_key_here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# PostgreSQL (auto-configured by Supabase)
POSTGRES_URL=your-postgres-url
POSTGRES_PRISMA_URL=your-postgres-prisma-url
# ... other Postgres vars
```

### 3. Database Setup
Run the migration scripts in v0 (they're in the `/scripts` folder):

**Chat System:**
1. `001_create_chat_sessions_table.sql` - Creates chat sessions table
2. `002_create_chat_messages_table.sql` - Creates chat messages table
3. `003_add_attachments_to_messages.sql` - Adds file attachment support

**Core System:**
1. `001_create_tables.sql` - Creates profiles, legal_cases, search_history, payment_history
2. `002_seed_sample_cases.sql` - Adds sample legal cases
3. `003_fix_rls_policies.sql` - Fixes Row Level Security policies
4. `004_update_signup_bonus_and_razorpay.sql` - Adds signup bonus and Razorpay fields

### 4. Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - Development: `http://localhost:54321/auth/v1/callback`
   - Production: `https://your-supabase-url.supabase.co/auth/v1/callback`
4. Add Client ID and Secret to Supabase Dashboard → Authentication → Providers → Google
5. Enable Google provider

### 5. Get Groq API Key
1. Sign up at [Groq Console](https://console.groq.com)
2. Create new API key
3. Add to environment variables as `GROQ_API_KEY`

### 6. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Routes

### `/api/chat/send` (POST)
Sends a message to the AI and streams the response.

**Request Body**:
```json
{
  "message": "What is the legal procedure for land disputes?",
  "sessionId": "uuid-of-session",
  "attachments": [
    {
      "url": "https://blob.url/file.pdf",
      "filename": "document.pdf",
      "size": 123456,
      "type": "application/pdf"
    }
  ]
}
```

**Response**: Streaming text response from Groq AI

**Features**:
- Validates user authentication
- Creates new session if needed
- Saves user message to database
- Streams AI response in real-time
- Saves AI response to database
- Returns streaming text response

### `/api/chat/upload` (POST)
Uploads files to Vercel Blob storage.

**Request**: FormData with `file` field

**Response**:
```json
{
  "url": "https://blob.url/...",
  "filename": "document.pdf",
  "size": 1234567,
  "type": "application/pdf"
}
```

**Security**:
- User authentication required
- Files stored in user-specific paths: `chat-files/{userId}/{timestamp}-{filename}`
- File type validation
- Size limit enforcement (50MB)

## Chat System Architecture

### Message Flow
1. **User Input** → User types message and/or attaches files
2. **File Upload** → Files uploaded to `/api/chat/upload` (if any)
3. **Send Message** → Message sent to `/api/chat/send` with attachments
4. **Create Session** → New session created if first message
5. **Save User Message** → User message saved to `chat_messages` table
6. **AI Processing** → Message sent to Groq AI with conversation history
7. **Stream Response** → AI response streamed back to client
8. **Save AI Response** → Complete response saved to database
9. **Update UI** → Chat messages reloaded and displayed

### Session Management
- Sessions created automatically on first message
- Title extracted from first user message (max 50 chars)
- Sessions organized by date (Today, Previous 7 Days)
- Search functionality to find specific conversations
- Delete sessions and all associated messages

### File Handling
- **Upload**: Files uploaded immediately when selected
- **Preview**: Thumbnails shown for images, file cards for documents
- **Storage**: Stored in Vercel Blob with secure URLs
- **Persistence**: File metadata saved in message `attachments` JSON array
- **Display**: Attachments shown in both user and assistant messages

## Message Actions Implementation

### Copy to Clipboard
```typescript
const handleCopyMessage = async (message: ChatMessage) => {
  await navigator.clipboard.writeText(message.content)
  // Show checkmark icon for 2 seconds
  toast.success("Message copied to clipboard")
}
```

### Regenerate Response
```typescript
const handleRegenerateMessage = async (messageId: string) => {
  // Find previous user message
  // Delete old AI response
  // Resend user message to AI
  // Display new response
}
```

### Share Message
```typescript
const handleShareMessage = async (message: ChatMessage) => {
  if (navigator.share) {
    // Use native share API
    await navigator.share({
      title: "Legal AI Assistant Response",
      text: message.content,
    })
  } else {
    // Copy shareable link
    const url = `${window.location.origin}/chat?session=${sessionId}&message=${messageId}`
    await navigator.clipboard.writeText(url)
  }
}
```

### Read Aloud
```typescript
const handleReadAloud = (message: ChatMessage) => {
  const utterance = new SpeechSynthesisUtterance(message.content)
  utterance.rate = 0.9 // Slightly slower for clarity
  window.speechSynthesis.speak(utterance)
}
```

## Authentication Flow

### Email/Password Signup
1. User submits email and password
2. Supabase creates auth user
3. Verification email sent
4. User clicks verification link
5. Redirected to `/auth/callback`
6. Profile created with 10 credits
7. Redirected to `/chat`

### Google OAuth
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Google authenticates and redirects back
4. Supabase creates auth user
5. Redirected to `/auth/callback`
6. Profile created if doesn't exist
7. Redirected to `/chat`

### Login
1. User submits credentials
2. Supabase validates credentials
3. Session created
4. Redirected to `/chat`

### Middleware (proxy.ts)
- Runs on every request
- Refreshes auth tokens
- Updates cookies
- Protects authenticated routes

## Security Features

### Authentication Security
- Passwords hashed by Supabase
- Email verification required
- HTTP-only session cookies
- Automatic token refresh
- Secure session management

### Data Security
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Admins have elevated permissions
- SQL injection prevention
- XSS protection

### File Security
- User-specific storage paths
- Signed URLs from Vercel Blob
- File type validation
- Size limit enforcement
- Secure deletion

## Design System

### Colors
- **Primary**: Orange gradient (`from-orange-400 to-orange-500`)
- **Background**: Light cream/beige
- **Cards**: White with subtle borders
- **Text**: Dark gray/black
- **Muted**: Light gray

### Components
- **Rounded corners**: 12px-24px
- **Shadows**: Subtle, soft shadows
- **Hover states**: Smooth transitions
- **Icons**: Lucide React icons
- **Animations**: Bounce for loading, fade for modals

## Usage Guide

### Starting a Chat
1. Navigate to `/chat`
2. Click "New Chat" or start typing
3. Enter your legal question
4. Press Enter or click send button

### Uploading Files
1. Click paperclip icon 📎
2. Select files (or drag & drop)
3. Preview appears above input
4. Remove unwanted files with X button
5. Add message text (optional)
6. Click Send

### Using Message Actions
- **Copy**: Click copy icon to copy message text
- **Regenerate**: Click refresh icon for new response
- **Share**: Click share icon to share message
- **Read Aloud**: Click speaker icon to hear message
- **Feedback**: Click thumbs up/down to rate

### Searching Chats
1. Click "Search Chat" in sidebar
2. Type your search query
3. Click matching conversation
4. Chat loads in main area

## Troubleshooting

### Authentication Issues
**Problem**: Can't login with email/password
**Solution**:
- Check if email is verified (check spam folder)
- Verify Supabase credentials are correct
- Clear browser cookies and try again

**Problem**: Google OAuth not working
**Solution**:
- Verify Google OAuth credentials in Supabase Dashboard
- Check redirect URLs are configured correctly
- Enable Google provider in Supabase Authentication settings

### Chat Issues
**Problem**: AI not responding
**Solution**:
- Verify `GROQ_API_KEY` is set correctly in environment variables
- Check Groq API status at console.groq.com
- Check browser console for errors

**Problem**: Messages not saving
**Solution**:
- Verify Supabase connection
- Check RLS policies are enabled
- Ensure user is authenticated

### File Upload Issues
**Problem**: Files not uploading
**Solution**:
- Check file size (max 50MB per file)
- Verify file type is supported
- Check `BLOB_READ_WRITE_TOKEN` is configured
- Check network connection

**Problem**: Files not displaying
**Solution**:
- Verify Blob URLs are accessible
- Check browser console for CORS errors
- Try refreshing the page

## Performance Optimization

- **Server Components**: Most components are server-rendered
- **Streaming**: AI responses stream in real-time
- **Lazy Loading**: Chat history loaded on demand
- **Optimistic UI**: Messages show immediately, save in background
- **Caching**: Supabase client uses singleton pattern
- **Code Splitting**: Next.js automatic code splitting

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Verify deployment at assigned URL

### Environment Variables Checklist
- ✅ All Supabase variables
- ✅ GROQ_API_KEY
- ✅ BLOB_READ_WRITE_TOKEN
- ✅ Razorpay credentials (if using payments)
- ✅ NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL (set to production URL)

## Future Enhancements

- **Document Analysis**: OCR and AI analysis of uploaded documents
- **Voice Input**: Speech-to-text for questions
- **Multi-language**: Support for multiple languages
- **Case Recommendations**: AI-suggested similar cases
- **Advanced Search**: Semantic search through chat history
- **Export**: Download chat conversations as PDF
- **Collaboration**: Share chats with other users
- **Mobile App**: Native iOS and Android apps

## Support

For issues or questions:
- Check this documentation first
- Review the [Supabase documentation](https://supabase.com/docs)
- Review the [Groq documentation](https://console.groq.com/docs)
- Contact support through the app

---

Built with ❤️ for the legal community using cutting-edge AI technology.
