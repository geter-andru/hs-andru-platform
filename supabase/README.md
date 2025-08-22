# Supabase Setup Instructions

## Setting Up the Profiles Table

### Step 1: Run the Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `migrations/001_create_profiles_table.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify Table Creation

1. Navigate to **Table Editor** (left sidebar)
2. You should see a new `profiles` table
3. Check that the following columns exist:
   - `id` (UUID, Primary Key)
   - `email` (Text, Unique)
   - `full_name` (Text)
   - `company` (Text)
   - `waitlist_status` (Text)
   - `airtable_record_id` (Text)
   - `customer_id` (Text)
   - And others...

### Step 3: Test the Setup

Run this test query in SQL Editor:
```sql
-- Check if the profiles table exists
SELECT * FROM public.profiles LIMIT 5;

-- Test the waitlist check function
SELECT * FROM public.check_waitlist_status('test@example.com');
```

## How the Hybrid System Works

### User Flow

1. **New User Signs Up**
   - User registers via Supabase Auth
   - Trigger automatically creates profile with `waitlist_status = 'pending'`
   - Email stored in localStorage as `waitlist_email`

2. **Admin Approves User**
   - Admin updates `waitlist_status` to 'approved' or 'active'
   - Can be done via Supabase Dashboard or admin panel

3. **Returning User Visits**
   - SignUpPage checks localStorage for `waitlist_email`
   - Calls `checkWaitlistStatus()` function
   - If approved → redirects to `/login`
   - If not approved → shows landing page

### Waitlist Status Values

- `pending` - User signed up, awaiting approval
- `approved` - User approved, can access platform
- `active` - User actively using platform
- `rejected` - User application rejected

## Managing Users

### Via Supabase Dashboard

1. Go to **Table Editor** → `profiles`
2. Click on any row to edit
3. Change `waitlist_status` to approve/reject users
4. Add `customer_id` to link with Airtable records

### Via SQL

```sql
-- Approve a user
UPDATE public.profiles 
SET waitlist_status = 'approved' 
WHERE email = 'user@example.com';

-- Link to Airtable
UPDATE public.profiles 
SET 
  airtable_record_id = 'recXXXXXXXX',
  customer_id = 'CUST_001'
WHERE email = 'user@example.com';

-- View all pending users
SELECT email, full_name, company, created_at 
FROM public.profiles 
WHERE waitlist_status = 'pending'
ORDER BY created_at DESC;
```

## Integration with Existing System

### profileService.js Methods

```javascript
// Check if email is approved
const { status, isApproved } = await profileService.checkWaitlistStatus('user@example.com');

// Get current user's profile
const profile = await profileService.getCurrentUserProfile();

// Update waitlist status (admin)
await profileService.updateWaitlistStatus('user@example.com', 'approved');

// Link Airtable record
await profileService.linkAirtableRecord('user@example.com', 'recXXX', 'CUST_001');
```

## Security

- Row Level Security (RLS) is enabled
- Users can only view/edit their own profiles
- `check_waitlist_status` function is publicly accessible (for checking before login)
- Service role has full access (for admin operations)

## Next Steps

1. Create admin panel for managing waitlist
2. Sync approved users with Airtable
3. Add email notifications for status changes
4. Create webhook for Airtable → Supabase sync