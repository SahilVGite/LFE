# LegalCaseAI - AI-Powered Legal Research Platform

## Overview

LegalCaseAI is a comprehensive legal research platform that combines database search with AI-powered case generation. The platform features an intelligent chat interface for legal consultations powered by Groq AI, case search functionality, and a credit-based system.

## Key Features

### 1. **AI Chat Interface** (ChatGPT-like)
- Real-time legal consultation with Groq AI (Llama 3.3 70B)
- **File uploads** - Attach PDFs, documents, and images to your questions
- Session-based chat history
- Search through past conversations
- **Message actions**: Copy, regenerate, share, read aloud, thumbs up/down
- Organized by time (Today, Previous 7 Days)
- Streaming AI responses for real-time feedback

### 2. **File Upload System**
- Upload legal documents (PDF, DOC, DOCX, TXT)
- Upload images (JPG, PNG, GIF) of legal documents
- Multiple file attachments per message
- 50MB file size limit
- Secure storage with Vercel Blob
- File previews in chat messages

### 3. **Legal Case Search**
- Search through extensive legal case database
- AI-powered case generation when no matches found
- Credit-based system for AI generation
- Save and export search history

### 4. **User Management**
- Secure authentication with Supabase (Email/Password + Google OAuth)
- Role-based access (User/Admin)
- Credit management system
- Payment integration with Razorpay

### 5. **Admin Dashboard**
- User management
- Case database management
- Payment tracking
- Analytics and reporting

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI Provider**: Groq (Llama 3.3 70B Versatile)
- **AI SDK**: Vercel AI SDK v5
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **File Storage**: Vercel Blob
- **Payments**: Razorpay
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Notifications**: Sonner
- **Date Utilities**: date-fns

## Database Schema

### Tables

#### `profiles`
- User profile information
- Credits balance
- Role (user/admin)

#### `legal_cases`
- Case title, summary, content
- Court, year, tags
- Full-text search enabled

#### `search_history`
- User search queries
- Result type (database/AI)
- Credits used
- Result data (JSONB)

#### `payment_history`
- Razorpay transaction details
- Credits purchased
- Payment status

#### `chat_sessions`
- Chat conversation sessions
- Session title
- Timestamps

#### `chat_messages`
- Individual chat messages
- Role (user/assistant/system)
- Session association
- Message content
- Attachments (JSONB)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Groq API key (for AI chat)
- Vercel Blob storage (for file uploads)
- Razorpay account (for payments)

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=gsk_your_groq_api_key_here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables (see above)
4. Run database migrations in v0 (scripts folder):
   - `001_create_tables.sql`
   - `002_seed_sample_cases.sql`
   - `003_fix_rls_policies.sql`
   - `004_update_signup_bonus_and_razorpay.sql`
   - `001_create_chat_messages_table.sql`
   - `002_create_chat_sessions_table.sql`
   - `003_add_attachments_to_messages.sql`

5. Start development server:
   ```bash
   npm run dev
   ```

## Features Breakdown

### Chat Interface (`/chat`)

The chat interface provides a ChatGPT-like legal consultation experience:

**Sidebar Features:**
- New chat creation
- Search through chat history
- Session organization (Today, Previous 7 Days)
- Quick access to dashboard
- Upgrade plan CTA
- User profile display

**Main Chat Features:**
- Real-time messaging with Groq AI
- **File attachment support** - Upload documents and images
- AI-powered legal responses using Llama 3.3 70B
- **Message actions**:
  - 🔊 Read aloud (Text-to-speech)
  - 📋 Copy to clipboard
  - 🔄 Regenerate response
  - 🔗 Share message
  - 👍 👎 Thumbs up/down feedback
- Session persistence
- Mobile-responsive design
- Streaming responses with typing indicators

**File Upload:**
- Click paperclip icon to attach files
- Drag and drop support
- Preview attached files before sending
- Remove files individually
- Files stored securely in Vercel Blob

**Quick Actions:**
- New Chat
- Old Chat History
- Need Help

### Home Page (`/`)

**Hero Section:**
- Prominent search/chat input
- Quick prompt suggestions
- Clear value proposition
- Call-to-action buttons

**How It Works:**
1. Upload case summary
2. System analyzes landmark cases
3. Get clear prediction report

**Features Section:**
- Clear timeline visualization
- Success chance prediction
- Risk and roadblock identification
- Interim relief prediction

**Trust Indicators:**
- Built by litigation experts
- Backed by real case data
- Designed with lawyers and clients

**FAQ Section:**
- Common questions answered
- Platform capabilities explained

### Dashboard (`/dashboard`)

- Recent search history
- Credit balance display
- Payment history
- Quick actions

### Admin Panel (`/admin`)

- User management
- Case database CRUD
- Payment tracking
- System analytics

## Row Level Security (RLS)

All tables implement RLS policies:

- Users can only access their own data
- Admins have elevated permissions
- Secure by default

## API Routes

### `/api/cases/search`
- Search legal cases
- Returns database matches or triggers AI generation

### `/api/chat/send`
- Sends message to Groq AI
- Streams AI response in real-time
- Saves messages to database
- Handles file attachments

### `/api/chat/upload`
- Uploads files to Vercel Blob
- Validates file type and size
- Returns secure file URLs
- User-specific storage paths

## Authentication

### Supported Methods
1. **Email/Password** - Traditional signup with email verification
2. **Google OAuth** - One-click Google sign-in

### Features
- Email verification required for email/password signup
- Automatic profile creation on successful auth
- Secure session management with HTTP-only cookies
- Token refresh via middleware
- Protected routes with auth checks

### Setup Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Set redirect URL to: `https://your-domain.com/auth/callback`

## Message Actions

### Copy
- Copies message content to clipboard
- Visual feedback with checkmark icon
- Toast notification

### Regenerate
- Deletes previous AI response
- Resends user message to AI
- Generates new response
- Useful for getting alternative answers

### Share
- Uses native browser share API when available
- Falls back to copying shareable link
- Creates link with session and message ID

### Read Aloud
- Text-to-speech using browser API
- Configurable voice settings
- Play/pause functionality
- Browser support detection

### Feedback
- Thumbs up/down for response quality
- Helps improve AI responses
- Saved for analytics

## Middleware & Authentication Flow

The app uses a single `proxy.ts` file (Next.js 16) that handles:
- Session token refresh
- Cookie management
- Authentication state sync
- Protected route access

**Authentication Flow:**
1. User signs up/logs in
2. Supabase creates auth session
3. Middleware refreshes tokens on each request
4. Protected pages check auth status
5. Unauthorized users redirected to login

## Security Features

1. **Authentication**
   - Email verification required
   - Secure password hashing (Supabase)
   - Session management via Supabase
   - Google OAuth support

2. **Authorization**
   - Role-based access control
   - RLS policies on all tables
   - Protected API routes
   - User data isolation

3. **File Security**
   - User-specific storage paths
   - Secure file URLs with Blob
   - File type validation
   - Size limit enforcement (50MB)

4. **Data Protection**
   - User data isolation via RLS
   - Secure payment handling
   - HTTPS enforced in production

## AI Integration

### Groq AI
- **Model**: Llama 3.3 70B Versatile
- **Provider**: Groq (ultra-fast inference)
- **Features**:
  - Streaming responses
  - Context-aware conversations
  - Legal domain expertise
  - Low latency (<1s response time)

### Vercel AI SDK v5
- Modern streaming API
- Type-safe message handling
- Built-in error handling
- Tool calling support (future)

### Chat System Architecture
1. User sends message via form
2. Client calls `/api/chat/send`
3. Server validates auth and session
4. Server streams response from Groq
5. Response saved to database
6. Client displays streaming text

## Troubleshooting

### Authentication Issues
- **Can't login**: Check if email is verified (check spam folder)
- **Google OAuth not working**: Verify OAuth credentials in Supabase
- **Session expired**: Clear cookies and login again
- **Redirect loop**: Check `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly

### Chat Issues
- **AI not responding**: Verify `GROQ_API_KEY` is set correctly
- **Slow responses**: Check Groq API status
- **Messages not saving**: Verify Supabase connection and RLS policies

### File Upload Issues
- **Upload fails**: Check `BLOB_READ_WRITE_TOKEN` is configured
- **File too large**: Max size is 50MB per file
- **Invalid file type**: Only PDF, DOC, DOCX, TXT, JPG, PNG, GIF supported

## Future Enhancements

- Voice input for chat
- Document upload and analysis
- Multi-language support
- Case law recommendations
- Advanced analytics dashboard
- Mobile applications

## Support

For issues or questions:
- Email: info@legalcaseai.com
- In-app support chat

## License

Proprietary - All rights reserved

---

Built with ❤️ for the legal community
