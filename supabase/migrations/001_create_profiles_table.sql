-- Create profiles table for user management and waitlist status
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  waitlist_status TEXT DEFAULT 'pending' CHECK (waitlist_status IN ('pending', 'approved', 'active', 'rejected')),
  airtable_record_id TEXT,
  customer_id TEXT UNIQUE, -- Maps to Airtable customer ID (e.g., CUST_001)
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_waitlist_status ON public.profiles(waitlist_status);
CREATE INDEX idx_profiles_customer_id ON public.profiles(customer_id);
CREATE INDEX idx_profiles_airtable_record_id ON public.profiles(airtable_record_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Service role can manage all profiles (for admin operations)
CREATE POLICY "Service role can manage all profiles" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, metadata)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for public profile data (safe to expose)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  company,
  waitlist_status,
  subscription_tier,
  created_at
FROM public.profiles
WHERE waitlist_status = 'active';

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;

-- Insert sample data for testing (optional - remove in production)
-- This will only work if you have existing users
/*
INSERT INTO public.profiles (id, email, full_name, company, waitlist_status, customer_id)
VALUES 
  ('YOUR_USER_ID_HERE', 'test@example.com', 'Test User', 'Test Company', 'approved', 'CUST_TEST')
ON CONFLICT (id) DO NOTHING;
*/

-- Function to check waitlist status by email (useful for checking before login)
CREATE OR REPLACE FUNCTION public.check_waitlist_status(user_email TEXT)
RETURNS TABLE(status TEXT, is_approved BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.waitlist_status, 'not_found') as status,
    CASE 
      WHEN p.waitlist_status IN ('approved', 'active') THEN true
      ELSE false
    END as is_approved
  FROM public.profiles p
  WHERE p.email = user_email
  LIMIT 1;
  
  -- If no record found, return default
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'not_found'::TEXT, false::BOOLEAN;
  END IF;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_waitlist_status(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_waitlist_status(TEXT) TO authenticated;