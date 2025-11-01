# Google Calendar Integration Setup

## Overview
TrifSync now supports Google Calendar integration, which is a great way to aggregate multiple calendars including imported iCal feeds.

## Step 1: Set Up Google OAuth

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Calendar API**

### 1.2 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### 1.3 Get Your Credentials
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

### 1.4 Update `.env.local`
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Step 2: Import iCal Links into Google Calendar

This is the key step! Instead of connecting directly to Apple Calendar, import your iCal feeds into Google Calendar.

### 2.1 Get Your iCal Links
Common sources:
- **Apple Calendar**: Settings → Calendar → Account → iCal URL
- **Other calendars**: Look for "iCal feed" or "Subscribe" options

### 2.2 Import into Google Calendar
1. Open [Google Calendar](https://calendar.google.com)
2. On the left sidebar, next to "Other calendars", click the **+** button
3. Select **From URL**
4. Paste your iCal feed URL
5. Click **Add calendar**
6. The calendar will appear in your calendar list

### 2.3 Repeat for Multiple Calendars
You can import multiple iCal feeds:
- Personal calendars
- Work calendars
- Family member calendars
- Sports team schedules
- School calendars
- Any public iCal feed

All imported calendars will sync automatically and appear in TrifSync!

## Step 3: Sign In to TrifSync

1. Visit your TrifSync app: http://localhost:3000
2. Click **Sign In with Google**
3. Authorize TrifSync to access your Google Calendar
4. You'll be redirected back to the app

## Step 4: View Your Calendar

Once signed in, TrifSync will:
- ✅ Fetch all your Google calendars (including imported iCal feeds)
- ✅ Display events from all calendars
- ✅ Show calendar colors and sources
- ✅ Support multiple calendar views (month/week/day)

## Benefits of This Approach

### Why Google Calendar First?
1. **Better API**: Google Calendar API is more reliable than CalDAV
2. **Aggregation**: Import multiple iCal feeds into one place
3. **Automatic Sync**: Google handles the syncing for you
4. **Universal**: Works with any iCal-compatible calendar
5. **Easy Management**: Manage all calendars in Google Calendar interface

### Common iCal Sources
- Apple Calendar (export as iCal feed)
- Outlook Calendar
- Sports teams
- Schools/universities
- Public event calendars
- Business calendars
- Any calendar service that exports iCal

## Troubleshooting

### "Sign In Required" Error
- Make sure you've set up Google OAuth credentials
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env.local`
- Verify redirect URI matches in Google Cloud Console

### No Events Showing
- Check that your Google Calendar has events
- Verify iCal feeds are properly imported into Google Calendar
- Try navigating to different months
- Check the browser console for errors

### Events Not Syncing
- Google Calendar syncs automatically, but can take a few minutes
- Make sure iCal feeds are active and accessible
- Check calendar visibility settings in Google Calendar

## Testing

### Test Endpoint
You can test your Google Calendar connection:
```
http://localhost:3000/api/calendar/google/test?token=YOUR_ACCESS_TOKEN
```

Or use Google OAuth Playground:
1. Go to [OAuth Playground](https://developers.google.com/oauthplayground/)
2. Select "Calendar API v3"
3. Authorize and get access token
4. Use in test endpoint

## Next Steps

After setting up Google Calendar:
1. Import all your iCal feeds into Google Calendar
2. Sign in to TrifSync with Google
3. Enjoy unified calendar view!
4. Consider adding more features:
   - Event creation/editing
   - Calendar selection
   - Family member management
   - AI assistant integration
