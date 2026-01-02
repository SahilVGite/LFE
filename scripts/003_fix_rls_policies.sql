-- Fix infinite recursion in profiles RLS policies
-- Run this script to fix the issue

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a security definer function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Recreate profiles policies without recursion
-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles (uses security definer function)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also fix admin policies on other tables to use the function
DROP POLICY IF EXISTS "Admins can insert legal cases" ON public.legal_cases;
DROP POLICY IF EXISTS "Admins can update legal cases" ON public.legal_cases;
DROP POLICY IF EXISTS "Admins can delete legal cases" ON public.legal_cases;
DROP POLICY IF EXISTS "Admins can view all payment history" ON public.payment_history;

CREATE POLICY "Admins can insert legal cases" ON public.legal_cases
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update legal cases" ON public.legal_cases
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete legal cases" ON public.legal_cases
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can view all payment history" ON public.payment_history
  FOR SELECT USING (public.is_admin());

-- Admins can view all search history
CREATE POLICY "Admins can view all search history" ON public.search_history
  FOR SELECT USING (public.is_admin());


CREATE POLICY "Users can view their own search history" ON public.search_history
  FOR SELECT USING (auth.uid() = user_id);
