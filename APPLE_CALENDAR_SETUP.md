# Apple Calendar Integration Setup

## Overview
TrifSync now supports real Apple Calendar integration via CalDAV. This allows you to sync your actual Apple Calendar events instead of using mock data.

## Setup Steps

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```env
# Apple Calendar API (CalDAV)
APPLE_CALDAV_URL=https://caldav.icloud.com/123456789/calendars/
APPLE_CALDAV_USERNAME=your_apple_id@icloud.com
APPLE_CALDAV_PASSWORD=your_app_specific_password_here

# Other required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get Apple Calendar Credentials

#### Step 2a: Find Your CalDAV URL
1. Go to [icloud.com](https://icloud.com) and sign in
2. Go to Calendar settings
3. Look for "CalDAV" or "Server Settings"
4. Your CalDAV URL will look like: `https://caldav.icloud.com/123456789/calendars/`
   - The numbers are your unique Apple ID number

#### Step 2b: Create App-Specific Password
1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Go to "Sign-In and Security" → "App-Specific Passwords"
4. Generate a new password for "TrifSync"
5. Use this password (not your regular Apple ID password)

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3002](http://localhost:3002)

3. The app will attempt to connect to your Apple Calendar
4. If successful, you'll see your real calendar events
5. If there's an issue, you'll see a warning message and fallback to sample data

## Troubleshooting

### Common Issues

1. **"Apple Calendar credentials not configured"**
   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"CalDAV request failed: 401 Unauthorized"**
   - Check your Apple ID username (should be your full email)
   - Verify your app-specific password is correct
   - Make sure you're using the app-specific password, not your regular password

3. **"CalDAV request failed: 404 Not Found"**
   - Check your CalDAV URL format
   - Make sure the URL ends with `/calendars/`
   - Verify the numbers in the URL are correct

4. **Events not showing**
   - Check if you have events in your Apple Calendar
   - Try a different date range
   - Check the browser console for error messages

### Getting Help

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Apple Calendar has events in the current date range
3. Try creating a test event in Apple Calendar to see if it appears

## Features

Once connected, you'll have:
- ✅ Real-time Apple Calendar event sync
- ✅ Support for all-day and timed events
- ✅ Event descriptions and locations
- ✅ Fallback to sample data if connection fails
- ✅ Error handling and user feedback

## Next Steps

After getting Apple Calendar working:
1. Set up Google Calendar integration
2. Add event creation/editing capabilities
3. Implement family member management
4. Add AI assistant features
