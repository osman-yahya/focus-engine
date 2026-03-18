<p align="center">
  <img src="https://img.shields.io/badge/FocusEngine-Self--Hosted%20Search-2563eb?style=for-the-badge&logo=searxng&logoColor=white" alt="FocusEngine"/>
  <br/>
  <em>Your data. Your index. Your search.</em>
</p>

<p align="center">
  <a href="https://github.com/osman-yahya/focus-engine/stargazers"><img src="https://img.shields.io/github/stars/osman-yahya/focus-engine?style=flat-square&color=2563eb" alt="Stars"/></a>
  <a href="https://github.com/osman-yahya/focus-engine/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License"/></a>
  <a href="#"><img src="https://img.shields.io/badge/docker-ready-0db7ed?style=flat-square&logo=docker&logoColor=white" alt="Docker"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" alt="Next.js"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Meilisearch-powered-ff5caa?style=flat-square&logo=meilisearch&logoColor=white" alt="Meilisearch"/></a>
</p>

---

**FocusEngine** is a fully self-hosted, privacy-first internal search engine designed for **companies, teams, and privacy-conscious individuals** who need to index and search their own chosen set of websites — without sending a single query to Google, Bing, or any third party.

You own the index. You own the queries. You own the data.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Private Search** | All queries stay on your server — zero external tracking |
| 🕷️ **Async Crawler** | BullMQ-powered web crawler with configurable depth limits |
| 🌳 **Crawl Tree** | Parent↔child URL tracking — see exactly which pages were discovered from which |
| 🔑 **Admin Panel** | Full management UI for admins, queue, indexed content and settings |
| 👥 **User Management** | Multi-admin support with role-based access (`SUPERADMIN`, `ADMIN`, `VIEWER`) |
| 📌 **Pinned Sites** | Curate quick-access tiles on the search homepage for your team |
| 🎯 **Sitelinks** | Results grouped by domain with sub-page sitelinks, just like Google |
| ⚡ **Autocomplete** | Real-time search with 300ms debounce as you type |
| 🛠️ **Docker-first** | One command to start everything — no manual dependency setup |
| 🔐 **JWT Auth** | Secure cookie-based authentication for the admin panel |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Docker Compose                         │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │  Next.js App │   │   Crawler    │   │    Meilisearch     │  │
│  │  (Web + API) │   │   Worker     │   │  (Search Index)    │  │
│  │  :3000       │   │  (BullMQ)    │   │  :7700             │  │
│  └──────┬───────┘   └──────┬───────┘   └────────────────────┘  │
│         │                  │                                     │
│  ┌──────▼───────────────────▼───────┐   ┌────────────────────┐  │
│  │           PostgreSQL             │   │       Redis        │  │
│  │       (Jobs + Settings)          │   │   (Job Queue)      │  │
│  └──────────────────────────────────┘   └────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Stack:**
- **Frontend & API:** Next.js 16, Vanilla CSS, Outfit (Google Font)
- **Crawler Worker:** Node.js + Cheerio + BullMQ
- **Database:** PostgreSQL via Prisma ORM
- **Queue Broker:** Redis
- **Search Index:** Meilisearch
- **Auth:** JWT + HTTP-only cookies

---

## 🚀 Quick Start

**Prerequisites:** Docker + Docker Compose installed.

```bash
# 1. Clone the repo
git clone https://github.com/osman-yahya/focus-engine.git
cd focus-engine

# 2. Copy environment file and adjust if needed
cp .env.example .env

# 3. Start everything
docker-compose up -d --build

# 4. Apply the database schema (first run only)
docker exec focus-engine-web npx prisma db push

# 5. Create your first admin account
# Visit: http://localhost:3000/admin/setup
```

Open **[http://localhost:3000](http://localhost:3000)** and start searching. 🎉

---

## ⚙️ Environment Variables

Create a `.env` file at the project root. A minimal setup:

```env
# Database
DATABASE_URL=postgresql://focususer:focuspass@postgres:5432/focusengine

# Redis
REDIS_URL=redis://redis:6379

# Meilisearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=meili_master_key

# Auth (change this in production!)
JWT_SECRET=change_me_in_production
```

---

## 📖 Usage

### 1. Admin Setup

Visit `/admin/setup` on first launch to create your superadmin account.

### 2. Add URLs to Crawl

Navigate to **Admin → Dashboard**, enter a URL and set the crawl depth:
- `Depth 0` — index only the exact URL entered
- `Depth 1` — index the URL + all linked pages on the same domain
- `Depth 2+` — recursively follow links up to N levels deep

### 3. Monitor the Queue

Go to **Admin → Crawler Queue** to watch jobs in real time. Filter by status, select multiple jobs and bulk-delete them.

### 4. Search

Visit the homepage and start typing. Results are grouped by domain with sitelinks for sub-pages.

---

## 🗂️ Project Structure

```
focus-engine/
├── web/                  # Next.js application (UI + API routes)
│   ├── app/
│   │   ├── page.tsx      # Public search homepage
│   │   ├── admin/        # Admin panel pages
│   │   └── api/          # REST API routes
│   ├── components/       # React components
│   ├── lib/              # Prisma, Meilisearch, BullMQ clients
│   └── prisma/           # Database schema
│
├── crawler/              # Standalone crawler worker
│   └── index.ts          # BullMQ worker + Cheerio scraper
│
└── docker-compose.yml    # Full stack orchestration
```

---

## 🔒 Privacy & Security Notes

- **No telemetry.** FocusEngine never phones home. All data — URLs, queries, indexed content — stays on your infrastructure.
- **Air-gapped friendly.** Can run entirely offline on a private network. Just point your crawler at internal URLs.
- **Change defaults in production.** Set strong values for `JWT_SECRET` and `MEILI_MASTER_KEY` before exposing to the internet.
- **Firewall Meilisearch.** The Meilisearch port (`:7700`) should not be publicly exposed. It is only used internally by the web and crawler containers.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © [osman-yahya](https://github.com/osman-yahya). Free to use, modify and self-host.

---

<p align="center">Made with ❤️ for privacy.</p>
