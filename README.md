<p align="center">
  <img src="https://img.shields.io/badge/FocusEngine-Self--Hosted%20Search-0a1628?style=for-the-badge&logo=searchenginepng&logoColor=7cb8ff" alt="FocusEngine"/>
  <br/><br/>
  <strong>Index your own web. Search it privately.</strong><br/>
  <em>No third-party APIs. No telemetry. No cloud dependency.</em>
</p>

<p align="center">
  <a href="https://github.com/osman-yahya/focus-engine/stargazers"><img src="https://img.shields.io/github/stars/osman-yahya/focus-engine?style=flat-square&color=0a1628&labelColor=0d1a30" alt="Stars"/></a>
  <a href="https://github.com/osman-yahya/focus-engine/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=0d1a30" alt="MIT License"/></a>
  <a href="#"><img src="https://img.shields.io/badge/docker-ready-0db7ed?style=flat-square&logo=docker&logoColor=white&labelColor=0d1a30" alt="Docker"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-14+-white?style=flat-square&logo=nextdotjs&labelColor=0d1a30" alt="Next.js"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Meilisearch-powered-ff5caa?style=flat-square&logo=meilisearch&logoColor=white&labelColor=0d1a30" alt="Meilisearch"/></a>
</p>

---

## What is FocusEngine?

FocusEngine is a **fully self-hosted, privacy-first search engine** for companies, teams, and individuals. Point it at your chosen websites, it crawls and indexes them, and your team searches locally — with **zero queries leaving your network**.

You own the index. You own the queries. You own the data.

---

## ⚡ Features

| | Feature | Details |
|---|---|---|
| 🔒 | **Zero-Telemetry Search** | Every query stays on your server — no trackers, no third-party calls |
| 🕷️ | **Async Web Crawler** | BullMQ-powered, configurable depth, parent↔child tree tracking |
| 🖥️ | **Admin Dashboard** | Manage admins, monitor crawler queue, browse indexed content, configure settings |
| 👥 | **Multi-Admin RBAC** | `SUPERADMIN` · `ADMIN` · `VIEWER` role hierarchy with JWT auth |
| 📌 | **Pinned Sites** | Curate quick-access tiles on the search homepage |
| 🎯 | **Sitelinks** | Google-style domain grouping with sub-page links |
| ⚡ | **Live Search** | Real-time results with 300ms debounced autocomplete |
| 🌑 | **3D Dark UI** | Particle-field background, glassmorphic dark panels, smooth animations |
| 🐳 | **Docker-First** | One command to start five services |

---

## 🏛️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Docker Compose                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Next.js App │  │   Crawler    │  │   Meilisearch    │   │
│  │  (Web + API) │  │   Worker     │  │  (Search Index)  │   │
│  │  :3000       │  │  (BullMQ)    │  │  :7700           │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘   │
│         │                 │                                   │
│  ┌──────▼─────────────────▼──────┐  ┌──────────────────┐    │
│  │         PostgreSQL            │  │      Redis       │    │
│  │     (Jobs + Settings)         │  │   (Job Queue)    │    │
│  └───────────────────────────────┘  └──────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

| Layer | Technology |
|---|---|
| **Frontend & API** | Next.js 14+, React, Vanilla CSS, Inter font |
| **Crawler** | Node.js + Cheerio + BullMQ |
| **Database** | PostgreSQL via Prisma ORM |
| **Queue** | Redis |
| **Search** | Meilisearch |
| **Auth** | JWT + HTTP-only cookies |

---

## 🚀 Quick Start

> **Prerequisites:** Docker & Docker Compose

```bash
# Clone
git clone https://github.com/osman-yahya/focus-engine.git
cd focus-engine

# Configure
cp .env.example .env          # edit .env as needed

# Launch
docker-compose up -d --build

# Initialize database (first run only)
docker exec focus-engine-web npx prisma db push

# Create your first admin → http://localhost:3000/admin/setup
```

Open **[http://localhost:3000](http://localhost:3000)** — you're live. 🎉

---

## ⚙️ Environment Variables

Create `.env` at the project root:

```env
# Database
DATABASE_URL=postgresql://focususer:focuspass@postgres:5432/focusengine

# Redis
REDIS_URL=redis://redis:6379

# Meilisearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=meili_master_key          # ⚠ change in production

# Auth
JWT_SECRET=change_me_in_production          # ⚠ change in production
```

---

## 📖 Usage

### 1 → Setup

Visit `/admin/setup` on first launch to create the superadmin account.
default admin credentials for preset db is : "admin" "admin"
### 2 → Crawl

Navigate to **Admin → Dashboard**, enter a URL and depth:

| Depth | Behaviour |
|---|---|
| `0` | Index only the exact URL |
| `1` | Index URL + all same-domain links |
| `2+` | Recursively follow links N levels deep |

### 3 → Monitor

**Admin → Queue** — watch crawl jobs in real time, filter by status, bulk-delete.

### 4 → Search

Go to the homepage and type. Results stream in with domain grouping and sitelinks.

---

## 🗂️ Project Structure

```
focus-engine/
├── web/                      # Next.js (UI + API)
│   ├── app/
│   │   ├── page.tsx          # Public search page
│   │   ├── admin/            # Admin panel (7 pages)
│   │   └── api/              # REST API routes (10 endpoints)
│   ├── components/           # SearchEngineUI + shared
│   ├── lib/                  # Prisma, Meilisearch, BullMQ clients
│   └── prisma/               # Database schema
│
├── crawler/                  # Standalone BullMQ worker
│   └── index.ts              # Cheerio scraper
│
├── agents/                   # AI agent team definitions
│
└── docker-compose.yml        # Full-stack orchestration
```

---

## 🔒 Security & Privacy

- **No telemetry** — FocusEngine never phones home. All data stays on your infrastructure.
- **Air-gap friendly** — runs fully offline on a private network.
- **Change defaults** — set strong `JWT_SECRET` and `MEILI_MASTER_KEY` before deploying.
- **Firewall Meilisearch** — port `:7700` should not be publicly exposed; it's internal-only.

---

## 🤝 Contributing

1. Fork the repo
2. `git checkout -b feature/my-feature`
3. `git commit -m 'feat: add my feature'`
4. `git push origin feature/my-feature`
5. Open a PR

---

## 📄 License

MIT © [osman-yahya](https://github.com/osman-yahya)

<p align="center"><sub>Built for privacy. Designed for speed.</sub></p>
