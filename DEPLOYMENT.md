# Deployment Guide

This guide covers everything required to deploy the portfolio live. Some steps require your personal accounts — those are clearly marked.

---

## 1. Prerequisites

- [GitHub](https://github.com) account (`aashirsohail104`)
- [Vercel](https://vercel.com) account (free tier)
- [Resend](https://resend.com) account (free tier, 100 emails/day)

---

## 2. Create a Fine-Grained GitHub Personal Access Token

**Required for:** The GitHub Actions sync workflow to read your repository data.

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click **Generate new token**
3. Set:
   - **Token name:** `portfolio-sync-token`
   - **Resource owner:** `aashirsohail104`
   - **Repository access:** `Only select repositories` → select `portfolio`
   - **Permissions:** Contents (Read-only), Metadata (Read-only)
4. Click **Generate token**
5. **Copy the token immediately** — you won't see it again

---

## 3. Add PORTFOLIO_SYNC_TOKEN to GitHub Secrets

**Required action:** You must do this manually.

1. Navigate to `https://github.com/aashirsohail104/portfolio/settings/secrets/actions`
2. Click **New repository secret**
3. Set:
   - **Name:** `PORTFOLIO_SYNC_TOKEN`
   - **Secret:** Paste the token from step 2
4. Click **Add secret**

---

## 4. Push to GitHub

Once git is initialized and the remote is configured:

```bash
git remote add origin https://github.com/aashirsohail104/portfolio.git
git push -u origin main
```

---

## 5. Deploy to Vercel

**Required action:** You must connect your GitHub repo in Vercel.

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Continue with GitHub**
3. Authorize Vercel to access `aashirsohail104/portfolio`
4. Vercel auto-detects the settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**
6. Wait for the initial build to complete

After this, every `git push` to `main` automatically triggers a new deployment.

---

## 6. Configure Vercel Environment Variables

**Required action:** You must add these in the Vercel dashboard.

1. Open your project on [Vercel Dashboard](https://vercel.com)
2. Go to **Settings → Environment Variables**
3. Add:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_...` (from Resend) | Production |
| `CONTACT_TO_EMAIL` | `you@example.com` (your real email) | Production |
| `SITE_URL` | `https://portfolio.vercel.app` (your Vercel URL) | Production |

4. Click **Save**

### Getting a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify a domain (or use the test `onboarding@resend.dev` sender during development)
3. Go to **API Keys** → **Create API Key**
4. Copy the key starting with `re_...`

Before going live: Replace `onboarding@resend.dev` in `api/contact.js` with your verified domain.

---

## 7. Verify GitHub Actions Sync

1. Go to `https://github.com/aashirsohail104/portfolio/actions`
2. Click **Sync GitHub Projects** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete (≈30 seconds)
5. Verify that `src/data/projects.json` was committed with your real repository data
6. Confirm Vercel automatically redeploys with the updated data

The workflow also runs automatically every 6 hours.

---

## 8. After Deployment Verification Checklist

- [ ] Site loads at your Vercel URL
- [ ] All sections render correctly
- [ ] Navigation/scroll links work
- [ ] GitHub Dashboard shows real stats
- [ ] Projects section shows real repos
- [ ] Contact form submits without errors
- [ ] Social links open correct sites
- [ ] Mobile responsive at 375px, tablet, desktop
- [ ] Lighthouse scores 95+ (run via Chrome DevTools)

---

## 9. Troubleshooting

### Build fails on Vercel
```bash
# Reproduce locally
npm run build
```
Check `Error: Cannot find native binding.` — this is an npm bug. Delete `node_modules` and `package-lock.json`, then `npm install` again.

### GitHub Actions fails
- Verify `PORTFOLIO_SYNC_TOKEN` is set in repository secrets
- Verify the token has read-only access to the `portfolio` repo
- Run the workflow manually from the Actions tab

### Contact form not sending email
- Verify `RESEND_API_KEY` is set in Vercel environment variables
- Check Resend dashboard for delivery logs
- The `onboarding@resend.dev` sender only works for testing — configure your domain for production

### Projects/github data not updating
- The sync workflow runs every 6 hours — wait or trigger manually
- Check Actions logs for errors
- Verify the token has not expired or been revoked

### Site not updating after push
- Confirm the push reached `main` branch
- Check Vercel deployments for the latest commit
- Reconnect repo in Vercel if the link is broken

---

## 10. Environment Variables Reference

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `RESEND_API_KEY` | Vercel Env Vars | Yes | Sends contact form emails via Resend |
| `CONTACT_TO_EMAIL` | Vercel Env Vars | Yes | Destination email for form submissions |
| `SITE_URL` | Vercel Env Vars | Yes | Used for OG tags and canonical URL |
| `PORTFOLIO_SYNC_TOKEN` | GitHub Secrets | Yes | GitHub API token for project sync