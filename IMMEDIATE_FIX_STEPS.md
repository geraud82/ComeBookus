# IMMEDIATE FIX for Signup 500 Error

## The Problem
Your signup is failing with a 500 error because the `SUPABASE_SERVICE_ROLE_KEY` is set to a placeholder value `"your-service-role-key"` instead of the actual key from your Supabase project.

## STEP 1: Get Your Real Supabase Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project: **ychpqxyjffjdqzsjmgth**
3. Go to **Settings** → **API**
4. Find the **service_role** key (NOT the anon key)
5. Copy the entire key (it should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`)

## STEP 2: Update Your Environment File

Open `frontend/.env.local` and replace this line:
```env
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

With your actual service role key:
```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE"
```

## STEP 3: Restart Your Development Server

1. Stop your current development server (Ctrl+C)
2. Start it again:
   ```bash
   cd frontend
   npm run dev
   ```

## STEP 4: Test the Signup

1. Go to your signup page
2. Try creating a new account
3. Check the browser console and terminal for detailed error messages

## What I've Already Fixed

I've updated your signup API route to provide much better error messages and debugging information. Now when you try to signup, you'll see exactly what's wrong in the console logs.

## Expected Results

- **Before fix**: Generic 500 error with no useful information
- **After fix**: Clear error messages telling you exactly what's misconfigured
- **After Supabase key fix**: Signup should work normally

## If You Still Get Errors

The improved error handling will now show you exactly what's wrong:

1. **"Authentication service not properly configured"** = Supabase key issue
2. **"Failed to create user profile"** = Database connection issue
3. **Specific Supabase auth errors** = User already exists, invalid email, etc.

## Database Setup (if needed)

If you get database errors after fixing the Supabase key:

```bash
cd database
npm install
npx prisma generate
npx prisma db push
```

## Quick Test

After updating the Supabase key, you can test if it's working by checking the terminal output when you try to signup. You should see:

```
Signup API called
Request data: { email: 'test@example.com', name: 'Test User', businessName: 'Test Business', passwordLength: 8 }
Supabase admin client configured successfully
Creating user profile in database for user: [user-id]
Database connection successful
User profile created successfully: [user-id]
```

If you see "Supabase admin client not configured" instead, the key is still wrong.
