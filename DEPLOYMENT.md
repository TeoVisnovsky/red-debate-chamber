# Deployment Guide for Vercel

## Fixed: Page Reload Issue on Vercel

### What was the problem?
Vercel (and other hosting platforms) need explicit instructions to handle client-side routing. Without proper configuration, refreshing a page like `/cccp` or `/eu` would result in a 404 error because the server tries to find a file at that path instead of serving the React app.

### Solutions Implemented:

#### 1. **vercel.json** (Primary Fix)
Created `vercel.json` with:
- **Rewrites**: All routes redirect to `/index.html` to enable SPA routing
- **Cache Headers**: Proper caching for assets and HTML files
- This ensures Vercel always serves your React app, regardless of the URL path

#### 2. **_redirects** (Fallback)
The `public/_redirects` file provides:
- Netlify/Cloudflare Pages compatibility
- Fallback for other deployment platforms
- Same SPA routing behavior

#### 3. **Error Boundary & Enhanced Safety**
- React Error Boundary catches any runtime errors
- Enhanced localStorage checks prevent SSR/hydration issues
- Suspense boundary for smooth loading states

## Deployment Steps:

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel Dashboard
3. Vercel will automatically detect the Vite project
4. Deploy!

### Option 3: Manual Upload
1. Run `npm run build`
2. Upload the `dist` folder to Vercel
3. Make sure `vercel.json` is in the root directory

## Build Configuration (if needed):

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

## Environment Variables (if any):
No environment variables are currently required for this project.

## Testing After Deployment:

1. ✅ Visit the home page `/`
2. ✅ Navigate to `/cccp` - should load CCCP committee
3. ✅ **Refresh the page** - should NOT crash
4. ✅ Navigate to `/eu` - should load EU committee
5. ✅ **Refresh the page** - should NOT crash
6. ✅ Add delegates and refresh - delegates should persist
7. ✅ Navigate between committees - delegates should be separate

## Common Issues:

### Still getting 404 on refresh?
- Make sure `vercel.json` is in the **root directory** (not in `src/` or `public/`)
- Redeploy the project after adding `vercel.json`
- Clear Vercel's cache: Settings → Clear Cache → Deploy

### Delegates not persisting?
- Check browser console for localStorage errors
- Make sure cookies/localStorage are enabled in browser
- Check for any ad-blockers that might block localStorage

### Build failing?
- Make sure all dependencies are installed: `npm install`
- Try clearing cache: `rm -rf node_modules && npm install`
- Check Node version (recommended: Node 18 or higher)

## File Checklist:
- ✅ `vercel.json` - SPA routing configuration
- ✅ `public/_redirects` - Fallback for other platforms
- ✅ `src/components/ErrorBoundary.tsx` - Error handling
- ✅ `src/App.tsx` - Enhanced with ErrorBoundary and Suspense
- ✅ `src/pages/CCCPCommittee.tsx` - localStorage persistence
- ✅ `src/pages/EUCommittee.tsx` - localStorage persistence

## Success! 🎉
Your MUN Command Center should now work perfectly on Vercel with:
- ✅ Client-side routing that works on refresh
- ✅ Persistent delegates per committee
- ✅ Error boundaries for graceful error handling
- ✅ Proper caching for optimal performance
