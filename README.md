# Gnana Sekhar Chandra — Portfolio

A full-stack portfolio site:

- **Backend** — Java 17 + Spring Boot 3 REST API (`/backend`). Serves projects and experience data, accepts contact-form submissions, and exposes a token-protected admin API for editing content.
- **Frontend** — React 19 + Vite (`/frontend`). A single-page site styled as a "systems console" — status panels, deploy timelines, service cards — plus a hidden `/admin` dashboard for managing content without touching code.

```
portfolio/
├── backend/   Spring Boot API
└── frontend/  React site
```

---

## 1. Run it locally

### Backend

Requires **Java 17+** and **Maven**.

```bash
cd backend
mvn spring-boot:run
```

This starts on `http://localhost:8080` using the `dev` profile, which uses an **in-memory H2 database** — no setup required. On first boot it seeds your résumé's projects and experience automatically (see `DataSeeder.java`).

- API: `http://localhost:8080/api/projects`, `/api/experiences`
- H2 console (dev only): `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:portfoliodb`, user `sa`, no password
- Health check: `http://localhost:8080/actuator/health`

The admin endpoints (`/api/admin/**`) require a header `X-Admin-Token: <token>`. In dev, the token defaults to `change-this-token-before-deploying` (see `application.yml`) — fine locally, **never use this in production**.

### Frontend

Requires **Node.js 18+**.

```bash
cd frontend
npm install
cp .env.example .env      # already points at localhost:8080
npm run dev
```

Open `http://localhost:5173`. If the backend isn't running, the site still renders using cached fallback data (`src/api/fallbackData.js`) so you always see a working page.

---

## 2. Deploy — free tier

This pairs **Render** (backend + Postgres) with **Vercel** (frontend). Both have generous free tiers and deploy straight from GitHub.

### Push to GitHub first

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
gh repo create portfolio-site --public --source=. --push
# or create a repo on github.com and:
# git remote add origin <your-repo-url>
# git push -u origin main
```

### Step A — Deploy the backend on Render

1. Go to [render.com](https://render.com) → sign up/log in with GitHub.
2. **New → Blueprint**, pick your repo. Render will detect `backend/render.yaml` and propose:
   - a free PostgreSQL database (`portfolio-db`)
   - a free web service (`portfolio-backend`) built from `backend/Dockerfile`
3. Click **Apply**. Render builds the Docker image and provisions the database — first build takes a few minutes.
4. Once live, copy the service URL, e.g. `https://portfolio-backend-xxxx.onrender.com`.
5. In the service's **Environment** tab, set `ALLOWED_ORIGINS` to your real frontend URL once you have it from Step B (comma-separated if you need more than one, e.g. preview + production URLs).
6. Note the auto-generated `ADMIN_TOKEN` value (Render generated it for you) — you'll need it to call the admin API.

**Free-tier specifics to know:**
- Render's free web services **spin down after 15 minutes of inactivity** and take ~30–60s to wake back up on the next request. The frontend's fallback data handles this gracefully — visitors see content immediately, then it swaps to live data once the backend wakes up.
- Render's free PostgreSQL databases **expire after 30 days** and must be recreated. For a portfolio you check on periodically, that's usually fine; if you want it to never expire, upgrade that one database to the cheapest paid tier (~$6-7/mo) or switch to a permanent free Postgres host like Supabase or Neon and point `DATABASE_HOST`/`PORT`/`NAME`/`USERNAME`/`PASSWORD` at it instead.

### Step B — Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up/log in with GitHub.
2. **Add New → Project**, import the same repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset should auto-detect as **Vite**. Build command `npm run build`, output directory `dist` (defaults are correct).
5. Add an environment variable:
   - `VITE_API_BASE_URL` = your Render backend URL from Step A (e.g. `https://portfolio-backend-xxxx.onrender.com`)
6. Click **Deploy**.
7. Once live, copy your Vercel URL and go back to Render to set `ALLOWED_ORIGINS` to it (Step A.5) — CORS will block requests until you do.

That's it — two services, both auto-deploying on every `git push`.

### Custom domain (optional)

Both Render and Vercel support adding a custom domain for free (you just pay for the domain itself, e.g. via Namecheap or Google Domains). Add it in each platform's dashboard under **Settings → Domains** and update DNS records as instructed.

---

## 3. Admin dashboard

There's a hidden admin UI built into the React app — no separate deploy, no extra hosting. It's not linked from anywhere on the public site; you just go directly to the URL.

**Local:** `http://localhost:5173/admin`
**Deployed:** `https://your-frontend.vercel.app/admin`

It'll ask for your admin token (the value of `ADMIN_TOKEN` on the backend — Render generated one for you when you deployed; find it in the service's **Environment** tab). Once unlocked you get three sections:

- **Projects** — list on the left, a form on the right. Click a project to load it into the form and edit, or "+ New project" to add one. Tech stack is comma-separated, highlights are one per line.
- **Experience** — same pattern: company, role, dates (leave end date blank for "Present"), bullets one per line.
- **Messages** — read-only inbox of contact form submissions, newest first, with a mark read/unread toggle.

The token is kept in `sessionStorage`, so it clears when you close the tab — you'll need to re-enter it next time. If the backend's token ever gets rotated while you're logged in, the next action you take will kick you back to the login screen automatically rather than failing silently.

There's no public link to `/admin` anywhere in the site's markup or nav — it's reachable only if you (or someone) types the URL directly. That's "security by obscurity," not real access control: anyone who finds the URL still needs the correct token to do anything, since every admin API call is checked server-side regardless of how they got to the page. Don't reuse this token anywhere else, and treat it like a password.

### Using the raw API instead

Everything the dashboard does, you can also do with `curl` — useful for scripting or if you ever want to seed data in bulk:

```bash
# Create a project
curl -X POST https://your-backend-url.onrender.com/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "New Project",
    "description": "What it does.",
    "techStack": ["React", "Spring Boot"],
    "highlights": ["Did a thing", "Did another thing"],
    "status": "live",
    "displayOrder": 2
  }'

# View contact form submissions
curl https://your-backend-url.onrender.com/api/admin/messages \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN"
```

Full endpoint list:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/projects` | — | List projects |
| GET | `/api/experiences` | — | List experience |
| POST | `/api/contact` | — | Submit contact form |
| POST | `/api/admin/projects` | token | Create project |
| PUT | `/api/admin/projects/{id}` | token | Update project |
| DELETE | `/api/admin/projects/{id}` | token | Delete project |
| POST/PUT/DELETE | `/api/admin/experiences...` | token | Same, for experience |
| GET | `/api/admin/messages` | token | View contact submissions |
| PATCH | `/api/admin/messages/{id}/read` | token | Mark a message read |

---

## 4. Turning on contact-form email notifications

By default, contact form messages are saved to the database but no email is sent. To get notified by email:

1. In Render's environment variables for the backend, set:
   - `MAIL_ENABLED=true`
   - `NOTIFY_EMAIL=gnanasekharchandra@gmail.com`
   - `MAIL_USERNAME` / `MAIL_PASSWORD` — for Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your real password (requires 2FA enabled on the account).
2. Redeploy. Submissions will now also land in your inbox; if email sending fails for any reason, the message is still saved — it just won't double as a notification.

---

## 5. A note on this build environment

This project's backend was hand-written and reviewed carefully, but **wasn't compiled with Maven inside this sandbox** — outbound network access here is restricted to a small allowlist that doesn't include Maven Central, so dependencies couldn't be downloaded for a live build check. The frontend, by contrast, **was fully installed, built, and tested** — including the admin dashboard, whose API logic (login, create/update/delete, the 401-handling that bounces you back to login if your token goes stale) was verified end-to-end against a throwaway mock server implementing the same request/response contract as the real backend. The visual layout was reviewed by code rather than by screenshot this round, since a browser wasn't available in this particular session.

Before you deploy, run this once on your own machine (which has normal internet access) to confirm the backend compiles cleanly:

```bash
cd backend
mvn clean package
```

If anything doesn't compile, paste the error back to me and I'll fix it immediately — but the code follows standard, well-trodden Spring Boot patterns throughout, so this is a precaution rather than an expectation of trouble.
