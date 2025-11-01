# 🔗 Your Vercel Project URL Information

## Your Project Details

- **Project Name:** `trifcalv1.0`
- **Vercel Account:** `pete-trifiros-projects`
- **Project URL:** https://vercel.com/pete-trifiros-projects/trifcalv1.0

## Your Stable Production URL

Based on your project name, your production URL should be:

**`https://trifcalv1.0.vercel.app`**

OR if Vercel assigned a different subdomain:

**`https://trifcalv1.0-pete-trifiros-projects.vercel.app`**

## ✅ How to Find Your Exact URL

### Method 1: Vercel Dashboard
1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0
2. Click on the **"Domains"** tab
3. You'll see your production domain listed there

### Method 2: Check Latest Deployment
1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/deployments
2. Click on the latest **Production** deployment
3. The URL will be shown at the top of the deployment page

### Method 3: Use Vercel CLI
```bash
cd /Users/petetrifiro/trifsync
vercel link
# Select your project when prompted
vercel inspect
```

## 🔧 Setting NEXTAUTH_URL

Once you have your exact production URL, set it in Vercel:

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/settings/environment-variables
2. Find or add: `NEXTAUTH_URL`
3. Set value to your production URL (e.g., `https://trifcalv1.0.vercel.app`)
4. Make sure it's set for **Production** environment
5. **Redeploy** after updating

## 🧪 Test Your URL

Visit your production URL:
```
https://trifcalv1.0.vercel.app/api/health
```

This should return a JSON response showing your environment status.

## 📝 Quick Checklist

- [ ] Find your exact production URL from Vercel dashboard
- [ ] Set `NEXTAUTH_URL` environment variable in Vercel to match
- [ ] Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [ ] Set `NEXTAUTH_SECRET`
- [ ] Update Google OAuth redirect URI to include your production URL
- [ ] Redeploy after setting environment variables
- [ ] Test `/api/health` endpoint

