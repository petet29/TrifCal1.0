# 🔗 Setting Up a Stable Vercel URL

## Understanding Vercel URLs

Vercel creates two types of URLs:

1. **Production URL** (Stable): `https://your-project-name.vercel.app`
   - This URL stays the same across all deployments
   - Only the latest production deployment is accessible here
   - This is what you should use for `NEXTAUTH_URL`

2. **Preview URLs** (Unique per deployment): `https://your-project-name-abc123.vercel.app`
   - Each deployment gets a unique preview URL
   - Useful for testing before promoting to production
   - Not what you want for OAuth redirects

## ✅ Steps to Get Your Stable Production URL

### Option 1: Check Vercel Dashboard (Easiest)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. You'll see the **Production** URL at the top
4. It will be: `https://your-project-name.vercel.app`
5. Copy this URL - this is your stable URL!

### Option 2: Link Project via CLI (Recommended)
This ensures your local project knows the Vercel URL:

```bash
cd /Users/petetrifiro/trifsync
vercel link
```

When prompted:
- Select your existing project (or create new)
- This will create `.vercel/project.json` with your project details
- Your production URL will be shown

### Option 3: Use Vercel CLI to Get URL
```bash
vercel ls
# or
vercel inspect
```

This will show all your projects and their URLs.

## 🔧 Setting Up Your Environment Variables

Once you have your stable production URL, update your Vercel environment variables:

**In Vercel Dashboard → Settings → Environment Variables:**

```
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**Important:**
- Use your **exact production URL** (the `.vercel.app` one)
- Don't use preview URLs
- Make sure it starts with `https://`
- No trailing slash

## 🌐 Setting a Custom Domain (Optional)

If you want a custom domain (e.g., `trifsync.com`):

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain

## ✅ Verification

After setting up:

1. Visit: `https://your-project-name.vercel.app/api/health`
2. Check that `nextAuthUrl` in the response matches your URL
3. Test Google OAuth sign-in

---

**Your stable production URL is what you see in the Vercel Dashboard under "Production".**

