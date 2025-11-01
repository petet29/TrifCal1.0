# Fix: "App has not completed Google verification process"

## Problem
You're seeing: **"Access blocked: TrifFamilySync has not completed the Google verification process"** when trying to sign in.

This happens because your Google OAuth app is in "Testing" mode and your email isn't added as a test user.

## Solution: Add Yourself as a Test User

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Select Your Project
- Click the project dropdown at the top
- Select the project where you created the OAuth credentials (likely named "TrifSync" or "TrifFamilySync")

### Step 3: Navigate to OAuth Consent Screen
**Option A - Direct Link:**
- Go directly to: https://console.cloud.google.com/apis/credentials/consent
- (Make sure your project is selected)

**Option B - Through Navigation:**
1. Click the hamburger menu (☰) in the top left
2. Go to **APIs & Services**
3. Click **OAuth consent screen** (in the left sidebar)

### Step 4: Check Publishing Status
At the top of the OAuth consent screen, you should see:
- **"Publishing status"** section
- It should say **"Testing"** (not "In production")

**If it says "In production":**
- Click the **"BACK TO TESTING"** button at the top
- This will switch it back to Testing mode where you can add test users

### Step 5: Find and Add Test Users

**Look for one of these sections:**

1. **"Audience" section** - **LOOK HERE!**
   - Scroll down to find the **"Audience"** section
   - Under "Audience", you'll see **"Test users"**
   - Click **"ADD USERS"** or **"+ ADD USERS"** button
   - Enter: `petetrifiro@gmail.com`
   - Click **"ADD"**

2. **OR look for "User type" section:**
   - If you see "User type: External" at the top
   - Scroll down further - the "Test users" section should be below the scopes

3. **If you still can't find it:**
   - Make sure you've completed the OAuth consent screen setup
   - Go through the OAuth consent screen wizard if you haven't:
     - User Type: **External**
     - App name: Your app name
     - User support email: Your email
     - Developer contact: Your email
     - Click through and save
   - After saving, the "Test users" section should appear

### Step 6: Test It
1. Make sure you saved the test user
2. Go back to your app: http://localhost:3000
3. Try signing in with Google again
4. It should work now!

## Still Can't Find It?

### Alternative: Change App to "Internal" (Only if you have Google Workspace)
- If you have a Google Workspace account, you can set User Type to "Internal"
- Internal apps don't need test users - all users in your organization can access
- **Note:** This only works if you have Google Workspace, not for personal Google accounts

### Check These Things:
- ✅ Are you in the correct project?
- ✅ Is the OAuth consent screen fully configured?
- ✅ Is Publishing status set to "Testing" (not "In production")?
- ✅ Try refreshing the OAuth consent screen page

## Alternative: Publish Your App (Not Recommended for Development)

If you want anyone to sign in without being added as a test user:
1. Go to OAuth consent screen
2. Click "PUBLISH APP"
3. Note: For sensitive scopes like Calendar, Google requires verification for apps in production

**For local development, adding test users is the recommended approach.**

## Verification Required (For Production)

If you need to make this app public and available to anyone:
- Google requires verification for apps requesting sensitive scopes (like Calendar access)
- This involves a review process that can take several days
- For now, stick with test users for development

