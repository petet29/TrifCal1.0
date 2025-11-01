# 🔧 Fix: Using the Correct Production URL

## ❌ Current Issue

You're looking at a **Preview Deployment URL**:
```
https://trifcalv10-2d7dtuh5x-pete-trifiros-projects.vercel.app
```

This URL:
- ✅ Works for testing this specific deployment
- ❌ Changes with every new deployment
- ❌ NOT what you should use for `NEXTAUTH_URL`
- ❌ NOT stable for OAuth redirects

## ✅ What You Need: Production URL

Your **Production URL** should look like one of these:
```
https://trifcalv10.vercel.app
OR
https://trifcalv10-pete-trifiros-projects.vercel.app
```

This URL:
- ✅ Stays the same across all deployments
- ✅ Only the latest production deployment is accessible here
- ✅ This is what you use for `NEXTAUTH_URL`

## 🎯 How to Find Your Production URL

### Step 1: Check Production Deployment

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/deployments
2. Look for a deployment marked **"Production"** (usually has a special badge)
3. Click on it
4. The production URL should be shown at the top

### Step 2: Or Check Domains Tab

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/settings/domains
2. Your production domain will be listed there

### Step 3: Promote Current Deployment to Production

If your current deployment isn't in production yet:

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/deployments
2. Find the deployment you want to use
3. Click the **"..."** menu (three dots)
4. Click **"Promote to Production"**

This will make it the production deployment and use your stable production URL.

## 🔧 Setting Environment Variables

Once you have your production URL, set it in Vercel:

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/settings/environment-variables
2. Add/Update: `NEXTAUTH_URL`
3. Set value to: `https://trifcalv10.vercel.app` (or whatever your production URL is)
4. Make sure it's set for **Production** environment
5. **Redeploy** or **Promote to Production**

## 🧪 Test Both URLs

**Preview URL (current):**
```
https://trifcalv10-2d7dtuh5x-pete-trifiros-projects.vercel.app/api/health
```

**Production URL (what you need):**
```
https://trifcalv10.vercel.app/api/health
```
(Replace with your actual production URL)

## ✅ Quick Actions

1. **Find production deployment** in Vercel dashboard
2. **Note the production URL** (the simpler one without the hash)
3. **Set `NEXTAUTH_URL`** to that production URL in environment variables
4. **Promote current deployment** to production if needed
5. **Redeploy** after setting environment variables

---

**The key difference:**
- Preview URL = `project-hash-team.vercel.app` (changes each deployment)
- Production URL = `project.vercel.app` (stays the same)

