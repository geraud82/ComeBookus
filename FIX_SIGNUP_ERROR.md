# How to Fix the Signup 500 Error

## Step 1: Fix Supabase Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to your project (ychpqxyjffjdqzsjmgth)
3. Go to **Settings** → **API**
4. Copy the **service_role** key (NOT the anon key)
5. Replace the placeholder in `frontend/.env.local`:

```env
# Replace this line:
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# With your actual service role key:
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY"
```

## Step 2: Fix Database Setup

Run these commands in your terminal:

```bash
# Navigate to database directory
cd database

# Install dependencies
npm install

# Generate Prisma client (try multiple times if it fails)
npm run generate

# Push database schema
npm run push
```

If the generate command fails with permission errors, try:
- Close any running development servers
- Run as administrator
- Or delete `node_modules/.prisma` folder and try again

## Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## Step 4: Restart Development Server

```bash
# In frontend directory
npm run dev
```

## Step 5: Test the Signup

1. Open your browser to the signup page
2. Try creating a new account
3. Check the browser console and terminal for any remaining errors

## What I Fixed

1. **Added null check for supabaseAdmin**: The signup route now properly handles the case when the Supabase admin client is not configured, providing a clear error message instead of crashing.

2. **Improved error logging**: Better error messages to help identify the root cause.

## Expected Behavior After Fix

- If Supabase service role key is missing: You'll get a clear error message "Authentication service not properly configured"
- If database connection fails: You'll get a specific database error message
- If everything is configured correctly: User signup should work normally

## Still Having Issues?

If you're still getting errors after following these steps, please share:
1. The exact error message from the browser console
2. Any error messages from the terminal
3. Confirmation that you've updated the Supabase service role key
