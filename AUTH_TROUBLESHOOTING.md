# Authentication Troubleshooting Guide

## Overview
This guide helps you troubleshoot authentication issues in the LegalCaseAI application.

## Common Issues

### 1. Login/Sign Up Not Working

**Symptoms:**
- Error messages when trying to log in
- Infinite loading states
- Redirects not working

**Solutions:**

1. **Check Environment Variables**
   - Ensure all Supabase environment variables are set correctly in the Vercel dashboard
   - Required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for development)

2. **Verify Supabase Configuration**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your site URL (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for development)

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for `[v0]` prefixed logs to see detailed authentication flow
   - Common errors:
     - "Invalid login credentials" → Wrong email/password
     - "Email not confirmed" → User needs to verify email
     - "redirect_uri mismatch" → Callback URL not configured in Supabase

### 2. Google OAuth Not Working

**Symptoms:**
- Google sign-in button doesn't work
- Error after redirecting from Google

**Solutions:**

1. **Enable Google Provider in Supabase**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add Google OAuth credentials:
     - Client ID from Google Cloud Console
     - Client Secret from Google Cloud Console

2. **Configure Google Cloud Console**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

3. **Set Correct Redirect URL**
   - In your Vercel environment variables, set:
     - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback` (development)
   - For production, the app automatically uses `window.location.origin/auth/callback`

### 3. Email Confirmation Issues

**Symptoms:**
- Email confirmation link doesn't work
- "Invalid or expired link" errors

**Solutions:**

1. **Check Email Settings in Supabase**
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Ensure "Confirm signup" template is enabled
   - Check that the redirect URL in the template points to `/auth/callback`

2. **Verify Email Delivery**
   - Check spam folder
   - For development, check Supabase Dashboard → Authentication → Logs
   - Consider using a custom SMTP provider for production

### 4. Profile Not Created

**Symptoms:**
- User can log in but profile data is missing
- Errors about missing profile

**Solutions:**

1. **Check RLS Policies**
   - Ensure the `profiles` table has correct RLS policies:
     - Users can insert their own profile
     - Users can select their own profile

2. **Manual Profile Creation**
   - If a profile wasn't created automatically, run this SQL in Supabase:
   ```sql
   INSERT INTO profiles (id, email, credits, role)
   VALUES ('user-uuid-here', 'user@example.com', 10, 'user');
   ```

3. **Check Database Trigger**
   - The callback page creates profiles automatically
   - Check browser console for `[v0]` logs to see if profile creation failed

## Debugging Steps

1. **Enable Detailed Logging**
   - All auth flows include `console.log("[v0] ...")` statements
   - Open browser DevTools → Console to see the flow
   - Look for errors in the authentication sequence

2. **Test Authentication Flow**
   - Try email/password login first (simpler to debug)
   - Then test Google OAuth
   - Check that callback page is reached successfully

3. **Verify Database State**
   - Go to Supabase Dashboard → Table Editor → profiles
   - Check if profile exists for your user ID
   - Verify the `auth.users` table has your user

4. **Check Proxy/Middleware**
   - The `proxy.ts` file handles session refresh
   - Protected routes are defined in `lib/supabase/proxy.ts`
   - Ensure `/chat` is in the protected routes list

## Testing Locally

1. **Set Development Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

2. **Test Email/Password Flow**
   - Go to `/auth/sign-up`
   - Create account with test email
   - Check Supabase Dashboard for confirmation email
   - Click confirmation link
   - Should redirect to `/chat`

3. **Test Google OAuth Flow**
   - Go to `/auth/login`
   - Click "Continue with Google"
   - Complete Google sign-in
   - Should redirect to `/chat` with profile created

## Production Deployment

1. **Set Environment Variables in Vercel**
   - Add all Supabase environment variables
   - DO NOT set `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` in production

2. **Configure Supabase URLs**
   - Add your production URL to Site URL in Supabase
   - Add `https://your-app.vercel.app/auth/callback` to Redirect URLs

3. **Test After Deployment**
   - Try signing up with a real email
   - Verify email confirmation works
   - Test Google OAuth if enabled

## Support

If issues persist:
1. Check the browser console for `[v0]` logs
2. Check Supabase Dashboard → Authentication → Logs
3. Verify all environment variables are correct
4. Ensure RLS policies are properly configured
