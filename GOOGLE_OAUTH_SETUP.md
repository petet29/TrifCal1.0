# Google OAuth Setup Guide

## Quick Setup Steps

### 1. Create Google Cloud Project & OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
   - Click project dropdown → "New Project"
   - Name: "TrifSync" (or whatever you prefer)
   - Click "Create"

3. **Enable Google Calendar API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: "External" (for personal use)
     - App name: "TrifSync"
     - Support email: your email
     - Click "Save and Continue" through the steps
   - Back to creating OAuth client:
     - Application type: "Web application"
     - Name: "TrifSync Local Dev" (or whatever)
     - **Authorized redirect URIs**: Add these:
       ```
       http://localhost:3000/api/auth/callback/google
       http://localhost:3001/api/auth/callback/google
       ```
     - Click "Create"
   - **Copy your Client ID and Client Secret**

### 2. Update Your .env.local File

```bash
# Already set ✅
NEXTAUTH_SECRET=XoP8DiBWJP0/KlvVbR8NO0ljaYmg0p5lIvVVFtgl71M=
NEXTAUTH_URL=http://localhost:3000

# Add these with your actual values:
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 3. Restart Your Dev Server

```bash
# Kill existing server
pkill -f "next dev"

# Start fresh
npm run dev
```

### 4. Test It!

1. Visit: http://localhost:3000
2. Click "Sign In with Google"
3. Authorize TrifSync
4. You should see your Google Calendar events!

## Troubleshooting

### "Invalid client" error
- Double-check your Client ID and Secret
- Make sure there are no extra spaces

### "Redirect URI mismatch" error
- Verify the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:3000/api/auth/callback/google`
- If using port 3001, add that too

### Still not working?
- Check: http://localhost:3000/api/auth/setup-status
- Verify all environment variables are set
- Restart the dev server after changing .env.local

## Next Steps

Once OAuth is working:
- ✅ Sign in will work
- ✅ Calendar events will load from Google Calendar
- ✅ You can import iCal feeds into Google Calendar to see them in TrifSync

## Security Note

- Never commit `.env.local` to git (it's already in .gitignore)
- For production, use environment variables in your hosting platform
- Rotate secrets periodically
