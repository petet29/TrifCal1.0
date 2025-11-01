# 🚀 Vercel Deployment Guide for TrifSync

This guide will walk you through deploying TrifSync to Vercel for public access.

## ✅ Pre-Deployment Checklist

### 1. Build Test (✅ Already Passed!)
Your app builds successfully:
```bash
npm run build  # ✅ This works!
```

### 2. Code Committed to GitHub
Make sure all your changes are committed and pushed:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Google OAuth Configuration
You'll need to add your **production URL** to Google Cloud Console.

---

## 📋 Step-by-Step Deployment

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account (recommended for easiest setup)

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find your `trifsync` repository and click **"Import"**

### Step 3: Configure Project
Vercel will auto-detect Next.js. The default settings should work:
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variables
**⚠️ CRITICAL:** Add these in Vercel Dashboard before first deployment!

Go to **Settings** → **Environment Variables** and add:

#### Required Environment Variables:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Note:** 
- `NEXTAUTH_URL` will be `https://[your-project-name].vercel.app` initially
- After first deployment, Vercel will give you the exact URL
- You can update `NEXTAUTH_URL` later if you add a custom domain

#### Optional Environment Variables (if using):
```
APPLE_CALDAV_URL=your_apple_caldav_url
APPLE_USERNAME=your_apple_id
APPLE_PASSWORD=your_app_specific_password
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

**How to generate `NEXTAUTH_SECRET` (if you don't have one):**
```bash
openssl rand -base64 32
```

### Step 5: Update Google OAuth Redirect URIs

**Before deploying**, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
5. Also keep your localhost URI for local development:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google  # (in case port 3000 is busy)
   ```
6. Click **"Save"**

**⚠️ Important:** If you don't add the production redirect URI, users will get an OAuth error!

### Step 6: Deploy!
1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-app-name.vercel.app`

### Step 7: Test the Deployment
1. Visit your Vercel URL
2. Try signing in with Google
3. Verify calendar events are loading
4. Test on mobile device (your app is mobile-ready!)

---

## 🔄 Updating Your Deployment

Vercel automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
1. Automatically detect the push
2. Build your app
3. Deploy to production
4. Keep the previous deployment as a backup (you can rollback if needed)

---

## 🌐 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `trifsync.com`)
3. Follow Vercel's DNS instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Update Google OAuth redirect URI to include your custom domain

---

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally to catch errors first
- Verify all dependencies are in `package.json`

### OAuth Not Working
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Confirm redirect URI is added in Google Cloud Console

### Environment Variables Not Working
- Make sure they're set for **Production** environment (not just Development)
- Redeploy after adding new environment variables
- Check for typos in variable names

### Events Not Loading
- Check API route logs in Vercel dashboard
- Verify Google Calendar API is enabled in Google Cloud Console
- Ensure user has granted calendar permissions

---

## 📊 Vercel Dashboard Features

- **Analytics:** See page views, performance metrics
- **Logs:** View server logs and API route logs
- **Deployments:** See all deployments, rollback if needed
- **Functions:** Monitor serverless function performance
- **Speed Insights:** Performance monitoring (if enabled)

---

## 💰 Vercel Pricing

**Free Tier (Hobby):**
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic SSL
- ✅ Global CDN

**Pro Tier ($20/month):**
- Everything in Hobby
- ✅ Team collaboration
- ✅ Analytics
- ✅ Password protection
- ✅ More bandwidth

**For TrifSync:** The free tier should be more than enough to start!

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible at Vercel URL
- [ ] Google sign-in works
- [ ] Calendar events load correctly
- [ ] Mobile view works properly
- [ ] Session persists (check after refresh)
- [ ] Google OAuth redirect URI updated
- [ ] Environment variables all set
- [ ] Test user added in Google Cloud Console (if still in Testing mode)

---

## 🎉 You're Live!

Your app is now publicly accessible! Share your Vercel URL with friends and family.

**Next Steps:**
1. Test thoroughly on different devices
2. Consider adding a custom domain
3. Monitor performance in Vercel dashboard
4. Set up error monitoring (optional)
5. Continue adding features locally, then push to deploy

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Build Logs:** Check in Vercel Dashboard → Your Project → Deployments → Click deployment → View logs

**Ready to deploy? Let's go! 🚀**

