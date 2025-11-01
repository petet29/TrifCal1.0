# 🔧 Vercel Deployment Troubleshooting

## 404 NOT_FOUND Error

If you're seeing `404: NOT_FOUND` after deployment, here's how to fix it:

### Step 1: Check Environment Variables

**⚠️ MOST COMMON CAUSE:** Missing environment variables on Vercel.

Go to your Vercel project → **Settings** → **Environment Variables** and verify you have:

```
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET  
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL (should be https://your-project.vercel.app)
```

**Important:** Make sure to select **"Production"** environment when adding variables.

### Step 2: Redeploy After Adding Variables

After adding/updating environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Environment variables only apply to **new** deployments!

### Step 3: Check Build Logs

In Vercel Dashboard:
1. Go to **Deployments**
2. Click on the deployment
3. Check **Build Logs** for errors

Common build errors:
- TypeScript errors (should have been caught locally)
- Missing dependencies
- Environment variable issues

### Step 4: Test Health Endpoint

Visit: `https://your-project.vercel.app/api/health`

This will show:
- If the app is running
- Which environment variables are set (without revealing secrets)
- Timestamp of the request

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "environment": {
    "hasNextAuthSecret": true,
    "hasGoogleClientId": true,
    "hasGoogleClientSecret": true,
    "nextAuthUrl": "https://your-project.vercel.app"
  }
}
```

If `hasNextAuthSecret` or `hasGoogleClientId` is `false`, those variables aren't set correctly.

### Step 5: Check Browser Console

1. Open your Vercel URL in a browser
2. Open DevTools (F12)
3. Check **Console** tab for JavaScript errors
4. Check **Network** tab to see which requests are failing

### Step 6: Verify Routes Exist

The app should have these routes:
- `/` - Main calendar page
- `/api/auth/session` - Check authentication
- `/api/calendar/google/all-calendars` - Fetch events
- `/api/health` - Health check

### Common Issues & Fixes

#### Issue: Root page (/) returns 404
**Cause:** Missing environment variables causing app initialization to fail
**Fix:** Add all required environment variables and redeploy

#### Issue: API routes return 404
**Cause:** Routes not being found or build issue
**Fix:** 
1. Check build logs for errors
2. Verify `src/app/api/` directory structure
3. Ensure routes export `GET`, `POST`, etc.

#### Issue: NextAuth routes return 404
**Cause:** NextAuth not configured correctly for Vercel
**Fix:**
1. Verify `NEXTAUTH_URL` matches your Vercel domain exactly
2. Check that `/api/auth/[...nextauth]/route.ts` exists and exports handlers
3. Ensure environment variables are set

#### Issue: Build succeeds but app doesn't load
**Cause:** Runtime error or missing environment variables
**Fix:**
1. Check Function Logs in Vercel Dashboard
2. Verify environment variables are set for Production
3. Check browser console for client-side errors

### Quick Diagnostic Commands

**Test locally with production build:**
```bash
npm run build
npm start
# Visit http://localhost:3000
```

**Check for TypeScript errors:**
```bash
npx tsc --noEmit
```

**Check for linting errors:**
```bash
npm run lint
```

### Still Having Issues?

1. **Check Vercel Function Logs:**
   - Vercel Dashboard → Your Project → Functions
   - Look for error logs

2. **Check Deployment Logs:**
   - Click on the deployment
   - Scroll through all logs
   - Look for red error messages

3. **Test Health Endpoint:**
   - Visit `/api/health` to see what's configured

4. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Make sure they're set for **Production** environment
   - No typos in variable names
   - Values are correct (no extra spaces)

### Getting Help

If you're still stuck:
1. Share the full error message from Vercel logs
2. Share the response from `/api/health` endpoint
3. Share your environment variable names (not values!)
4. Check Vercel Status: https://www.vercel-status.com/

