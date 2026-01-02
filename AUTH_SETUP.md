# Authentication Setup Guide

This application uses Supabase Authentication with support for both email/password and Google OAuth.

## Features

- Email/Password authentication
- Google OAuth login
- Automatic profile creation
- Protected routes with middleware
- Email confirmation support

## Setup Instructions

### 1. Configure Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Enable **Google** provider:
   - Add your Google Client ID
   - Add your Google Client Secret
   - Set authorized redirect URIs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

### 2. Environment Variables

Make sure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)
     - Add your Supabase callback URL from the Supabase dashboard

### 4. Database Schema

The `profiles` table is created automatically with RLS policies. Users get:
- 10 free credits on signup
- Default role: "user"
- Profile linked to auth.users via foreign key

### 5. Email Configuration (Optional)

For production, configure email templates in Supabase:
- Go to **Authentication > Email Templates**
- Customize confirmation, reset password, and magic link emails

## Authentication Flow

### Email/Password Flow

1. User signs up → email confirmation sent
2. User clicks confirmation link → redirected to `/auth/callback`
3. Callback creates profile and redirects to dashboard

### Google OAuth Flow

1. User clicks "Continue with Google"
2. Google OAuth consent screen
3. Google redirects to `/auth/callback`
4. Callback creates profile (if new user) and redirects to dashboard

## Protected Routes

The following routes require authentication:
- `/dashboard`
- `/chat`
- `/buy-credits`
- `/results`
- `/admin/*` (requires admin role)

Unauthenticated users are redirected to `/auth/login`.

## Troubleshooting

### Google OAuth not working

1. Check Google Client ID and Secret in Supabase
2. Verify redirect URIs match exactly
3. Ensure Google+ API is enabled
4. Check browser console for errors

### Email confirmation not working

1. Verify email provider is enabled in Supabase
2. Check email template configuration
3. Check spam folder
4. For development, check Supabase logs

### Profile not created

1. Check RLS policies allow INSERT for authenticated users
2. Verify auth callback is handling profile creation
3. Check browser console for errors
4. Review Supabase logs

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Passwords are hashed by Supabase Auth
- OAuth tokens are managed by Supabase
- Sessions are refreshed automatically via proxy middleware
