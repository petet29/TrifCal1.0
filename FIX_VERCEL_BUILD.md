# 🔧 Fix Vercel Build/Deploy Failure

## ✅ Good News
Your build works locally! This means the issue is likely:
- Missing environment variables on Vercel
- Vercel build configuration
- Node.js version mismatch

## 🔍 Step 1: Check Vercel Build Logs

1. Go to: https://vercel.com/pete-trifiros-projects/trifcalv1.0/deployments
2. Click on the **failed deployment**
3. Click **"View Build Logs"** or scroll down to see errors
4. Look for:
   - Red error messages
   - Missing environment variable warnings
   - TypeScript errors
   - Build command failures

**Share the error message and I'll help fix it!**

## 🔧 Step 2: Common Fixes

### Fix 1: Remove `--webpack` Flag (If Needed)
Vercel might not like the `--webpack` flag. Update `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev"
  }
}
```

### Fix 2: Set Node.js Version
Create `.nvmrc` file:
```
18
```
Or `20` if you prefer Node 20.

### Fix 3: Check Environment Variables
Make sure these are set in Vercel:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=https://trifcalv10.vercel.app`

### Fix 4: Update Build Command (If Needed)
In Vercel Dashboard → Settings → General:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## 📝 Step 3: Commit and Push Latest Changes

Make sure all fixes are committed:

```bash
git add .
git commit -m "Fix: Remove deprecated Supabase package, add health endpoint"
git push origin main
```

This will trigger a new deployment automatically.

## 🧪 Step 4: Test After Fix

Once deployed:
1. Visit: `https://trifcalv10.vercel.app/api/health`
2. Should return JSON with environment status
3. Visit: `https://trifcalv10.vercel.app/`
4. Should show your calendar app

## 🆘 What Error Are You Seeing?

Common Vercel build errors:
- **"Module not found"** → Missing dependency
- **"Environment variable not set"** → Add missing vars
- **"Build failed"** → Check build logs for specific error
- **"Type error"** → TypeScript issue (should be caught locally)
- **"Command failed"** → Build script issue

**Please share the exact error message from Vercel build logs!**

