# Authentication Setup Guide

## Overview

LegalCaseAI uses Supabase for authentication with support for:
- Email/Password authentication
- Google OAuth (requires configuration)
- Email confirmation (optional)

## Current Status

Based on your Supabase setup, here's what's working:

### ✅ Working Features
- Email/Password signup
- Email/Password login
- Automatic profile creation
- Session management
- Protected routes

### ⚠️ Requires Configuration
- **Google OAuth**: Needs to be enabled in Supabase dashboard
- **Email Confirmation**: Can be configured in Supabase settings

## How to Enable Google OAuth

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → Providers
   - Find "Google" in the list

2. **Enable Google Provider**
   - Toggle "Enable Sign in with Google"
   - You'll need:
     - Google Client ID
     - Google Client Secret

3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (for development)
     ```

4. **Configure in Supabase**
   - Paste Client ID and Client Secret
   - Save changes

5. **Update Site URL**
   - In Supabase: Authentication → URL Configuration
   - Set Site URL to your production URL
   - Add Redirect URLs:
     ```
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```

## Email Confirmation Setup

### Option 1: Disable Email Confirmation (Development)
1. Go to Supabase Dashboard
2. Authentication → Settings
3. Uncheck "Enable email confirmations"
4. Users can login immediately after signup

### Option 2: Enable Email Confirmation (Production)
1. Keep "Enable email confirmations" checked
2. Configure SMTP settings for custom emails (optional)
3. Users must click confirmation link before logging in

## Error Messages

The app now shows specific error messages for:

| Scenario | Error Message |
|----------|---------------|
| User already exists | "An account with this email already exists. Please login instead or use a different email." |
| Email not verified | "Your email hasn't been verified yet. Please check your inbox and click the verification link." |
| Wrong password | "Invalid email or password. Please check your credentials and try again." |
| Google not configured | "Google sign-in is not configured yet. Please contact support or use email/password login." |
| Password too short | "Password must be at least 6 characters long" |

## Testing Authentication

### Test Signup
```bash
# 1. Visit /auth/sign-up
# 2. Enter email and password (min 6 characters)
# 3. Confirm password
# 4. Click "Sign up"
# 5. If email confirmation is disabled, you'll be logged in
# 6. If enabled, check email for confirmation link
```

### Test Login
```bash
# 1. Visit /auth/login
# 2. Enter registered email and password
# 3. Click "Login"
# 4. You'll be redirected to /chat
```

### Test Google OAuth
```bash
# 1. Ensure Google is configured in Supabase
# 2. Visit /auth/login or /auth/sign-up
# 3. Click "Continue with Google"
# 4. Complete Google OAuth flow
# 5. You'll be redirected to /chat with profile created
```

## Troubleshooting

### "User already exists" error on signup
- The app now checks for existing users before signup
- User should use login page instead
- Or use "forgot password" to reset password

### Google OAuth not working
- Check if Google provider is enabled in Supabase dashboard
- Verify redirect URLs are correctly configured
- Check browser console for detailed error messages

### Email confirmation not received
- Check spam folder
- Verify SMTP settings in Supabase
- For development, consider disabling email confirmation

### Session expires immediately
- Check if cookies are enabled in browser
- Verify `proxy.ts` middleware is running
- Check browser console for errors

## Security Best Practices

1. **Always use HTTPS in production**
2. **Enable email confirmation for production**
3. **Use strong password requirements**
4. **Enable RLS (Row Level Security) on all tables**
5. **Regularly rotate Supabase service role key**
6. **Monitor authentication logs in Supabase dashboard**

## Support

If you encounter issues:
1. Check browser console for `[v0]` prefixed logs
2. Check Supabase dashboard logs (Authentication → Logs)
3. Verify environment variables in `.env.local`
4. Ensure all Supabase keys are correctly set

## Next Steps

- [ ] Enable Google OAuth
- [ ] Configure email confirmation
- [ ] Set up custom email templates
- [ ] Add password reset functionality
- [ ] Add "remember me" option
- [ ] Implement 2FA (two-factor authentication)
