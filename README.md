# Sky Life Sciences Solutions V2

<p align="center">
  <img src="public/logo.jpg" alt="Sky Life Sciences Solutions" height="70" />
</p>

<p align="center">
  <strong>Production-grade B2B pharmaceutical product management platform</strong><br/>
  Dynamic product catalog · Headless CMS · Secure authentication · Cloudinary media · SMTP enquiries
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.20-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" />
</p>

---

## Project Overview

Sky Life Sciences Solutions V2 is a full-stack B2B web platform built for a pharmaceutical analytical instruments and life sciences technology company. The platform replaces a previous Vite + localStorage architecture with a production-ready Next.js 15 application backed by MongoDB Atlas.

Every page on the site — hero section, product catalog, service pages, director biography, careers, legal policies, footer — is editable through a custom admin dashboard without any code changes. Content is stored in MongoDB and served via server-side rendering on every request.

---

## Features

### Public Website
- **Dynamic Homepage** — configurable sections, hero with video/image/slideshow, statistics, highlights, services, CTA
- **Product Catalog** — browsable by category at `/products`
- **Category Pages** — product grid filtered by category at `/products/[category-slug]`
- **Product Detail Pages** — full product info, image gallery, spec table, PDF brochure, embedded video at `/products/[product-slug]`
- **Live Search** — header search bar queries products, categories, and services
- **What We Do** — capabilities and solutions page with alternating media sections
- **Services Page** — full services listing
- **About the Director** — biography, credentials, photo
- **Careers Page** — open positions and company culture
- **Legal Pages** — privacy policy, terms & conditions, accessibility, cookie policy, disclaimer (all CMS-editable)
- **Contact Form** — validates name, email, phone, organization, industry, message. Stores to MongoDB and dispatches email.
- **Google Translate** — multilingual translation widget integrated in layout

### Admin Dashboard (`/admin`)
- Full CRUD management of all site content (products, categories, services, hero, highlights, statistics, director, careers, footer, legal pages)
- Drag-and-drop homepage section reordering with visibility toggles
- Integrated media library browser (Cloudinary)
- File upload: images, videos, PDFs (up to 50 MB)
- Enquiry inbox — view and delete contact form submissions
- Product importer — paste any product URL to auto-extract title, description, images, videos, and spec data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.20 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 + custom CSS custom properties |
| Animations | Framer Motion 12 |
| Database | MongoDB Atlas |
| ODM | Mongoose 9 |
| Authentication | NextAuth v4 (Credentials + JWT) |
| Password Hashing | bcryptjs |
| Validation | Zod 4 |
| Media Storage | Cloudinary v2 |
| Email | Nodemailer (SMTP) |
| Font | Inter via `next/font/google` |
| Bundler | Turbopack |

---

## Architecture

```
Browser (SSR HTML)
      │
      ▼
Next.js App Router (Server Components)
      │  ← fetches content from MongoDB on request
      ▼
ClientLayout + AppContext (Client)
      │  ← holds content state, navigation, modals
      ▼
Page Components (Client)
      │  ← react to content, navigate via next/navigation
      ▼
API Routes (/api/*)
      │  ← protected by edge middleware JWT check
      ▼
MongoDB Atlas (via Mongoose)
Cloudinary (media)
Nodemailer (email)
```

### Key Architectural Decisions
- **Monolithic CMS document** — entire site config stored as one MongoDB document for simplicity
- **Server fetches → client hydration** — server pages fetch content, pass it to `ClientLayout`, which distributes via `AppContext`
- **`revalidate = 0`** — all pages are fully dynamic (no static caching)
- **Edge middleware** — JWT validation runs at the edge before any API handler executes
- **Global connection cache** — `global.mongoose` prevents connection storms in serverless environments

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — fonts, metadata, Providers
│   ├── page.tsx                 # Home page (SSR)
│   ├── globals.css              # All design system tokens + component CSS
│   ├── admin.css                # Admin-only styles
│   ├── admin/page.tsx           # Admin dashboard
│   ├── products/page.tsx        # Product catalog
│   ├── products/[slug]/page.tsx # Category or product detail (dynamic)
│   ├── services/page.tsx        # Services
│   ├── what-we-do/page.tsx      # Solutions/capabilities
│   ├── about-the-director/      # Director biography
│   ├── careers/                 # Careers
│   ├── privacy-policy/          # Legal pages (×5)
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── content/             # CMS save endpoint
│       ├── enquiries/           # Contact form + inbox
│       ├── upload/              # Cloudinary file upload
│       ├── media/               # Cloudinary library management
│       └── import-product/      # Web scraper
├── components/                  # 37 React components
├── context/AppContext.tsx        # Global app state
├── lib/
│   ├── auth.ts                  # NextAuth config
│   ├── cloudinary.ts            # Cloudinary SDK setup
│   ├── db.ts                    # Mongoose connection + auto-seed
│   └── validation.ts            # Zod schemas
├── models/
│   ├── Content.ts               # CMS document model
│   ├── Enquiry.ts               # Form submission model
│   └── User.ts                  # Admin user model
└── middleware.ts                 # Edge JWT guard
```

---

## Screenshots

> *(Add screenshots of the homepage, product detail page, and admin dashboard here)*

---

## Installation Guide

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account
- Cloudinary account (optional — required for media uploads)
- SMTP email provider (optional — required for email notifications)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/skylife-sciences-v2.git
cd skylife-sciences-v2

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local
# Edit .env.local and fill in your values (see below)

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` — on first load, the app automatically:
1. Connects to your MongoDB Atlas cluster
2. Seeds the default admin account (`admin` / `adminpassword123`)
3. Seeds the full site content from `public/content.json`

> ⚠️ **Change the admin password** from the Atlas console or add a change-password feature before deploying to production.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# ── MongoDB Atlas ──────────────────────────────────────────────────────────────
# In MongoDB Atlas: Connect → Drivers → copy the connection string
# If using mongodb+srv:// and getting ECONNREFUSED on Windows, use the direct
# replica set format instead (see README troubleshooting section)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skylife?retryWrites=true&w=majority

# ── NextAuth ───────────────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-long-random-secret-string-here

# ── Admin seed account (used on first run only) ────────────────────────────────
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password

# ── Cloudinary (required for media uploads) ────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── SMTP Email (required for contact form email notifications) ─────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

---

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Click **Connect → Drivers** and copy the connection string
5. Replace `<password>` with your database user's password
6. Paste the full string as `MONGODB_URI` in `.env.local`

### Windows / Node.js DNS Issue
If you see `querySrv ECONNREFUSED` on Windows, use the direct replica set URI format instead of `mongodb+srv://`:

```env
MONGODB_URI=mongodb://user:pass@shard-00-00.xxx.mongodb.net:27017,shard-00-01.xxx.mongodb.net:27017,shard-00-02.xxx.mongodb.net:27017/skylife?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

Run `nslookup -q=SRV _mongodb._tcp.your-cluster.mongodb.net` and `nslookup -q=TXT your-cluster.mongodb.net` to retrieve your shard hostnames and replica set name.

---

## Running Locally

```bash
# Development (Turbopack hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## CMS Overview

Log in at `/admin` with your admin credentials. The dashboard provides:

| Tab | What you can edit |
|---|---|
| Homepage Layout | Show/hide/reorder homepage sections |
| Hero | Title, description, media (video/image/slideshow), CTA buttons, catalogue PDF |
| Products | Create/edit/delete products — name, slug, category, description, images, specs, brochure PDF, video |
| Categories | Create/edit/delete product categories |
| Services | Create/edit/delete services |
| What We Do | Solution sections with titles, descriptions, media, CTA buttons |
| Highlights | Event/milestone cards with image/video media |
| Statistics | Achievement numbers shown on homepage |
| About | Company description and profile image |
| Director | Biography, credentials, photo |
| Careers | Job listings |
| Footer | Phone, email, map URL, social links |
| Legal Pages | All 5 legal policy pages |
| Media Library | Upload and manage all media via Cloudinary |
| Enquiries | View and delete contact form submissions |
| Product Import | Paste any external URL to auto-populate product data |

---

## Product Features

### Dynamic Routing
The route `/products/[slug]` resolves to either a **category page** or a **product detail page** based on whether the slug matches a category or product in the database. No separate routes needed.

### Product Detail Page
Each product page includes:
- Image gallery with thumbnail navigation
- Embedded video (YouTube, Vimeo, or direct `.mp4`)
- Spec table (key-value pairs)
- Downloadable PDF brochure button
- Feature points list
- Contact enquiry button (pre-fills product context)

### Header Search
Live search queries products, categories, and services as you type. Results link directly to the relevant page.

---

## Email Enquiry System

When a visitor submits the contact form:

1. Input is validated with Zod (name, email, phone, organization, industry, message)
2. The enquiry is saved to MongoDB with a unique ID and timestamp
3. An HTML email is dispatched via Nodemailer to `shylender@skylifesciencessolutions.com`
4. The email includes customer details, message, product/service context, source URL, and timestamp
5. If SMTP is not configured, the email content is logged to stdout

---

## Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs, cost factor 10 |
| Session management | NextAuth JWT, HTTP-only cookie, 2-hour expiry |
| API protection | Edge middleware validates JWT token on all admin API routes |
| Input validation | Zod schemas on all POST endpoints |
| File type whitelist | Uploads restricted to `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.mp4`, `.webm`, `.ogg` |
| File size limits | 10 MB images/PDFs, 50 MB videos |
| Environment variables | All credentials stored in `.env.local`, never committed |

---

## SEO Features

| Feature | Status |
|---|---|
| Static metadata (title, description, keywords) | ✅ |
| Semantic HTML (h1, main, section, nav, footer) | ✅ |
| Google Fonts via next/font (display: swap) | ✅ |
| Dynamic per-page metadata | ❌ Planned |
| sitemap.xml | ❌ Planned |
| robots.txt | ❌ Planned |
| OpenGraph tags | ❌ Planned |
| JSON-LD structured data | ❌ Planned |

---

## Future Improvements

- Per-page dynamic metadata (`generateMetadata()`) for SEO
- `sitemap.xml` and `robots.txt`
- OpenGraph and Twitter card meta tags
- JSON-LD Product/Organization schema markup
- Replace `<img>` with Next.js `<Image>` for automatic optimization
- Rate limiting on public API endpoints
- Remove hardcoded JWT secret fallback
- Fix `Content.deleteMany()` in seeding (currently wipes DB on restart)
- Admin page-level session protection (currently middleware only guards API)
- Redirect `/terms-and-conditions` → `/terms-conditions`
- Mobile navigation hamburger menu visibility fix
- Related products section on product detail pages
- Enquiry analytics in admin dashboard

---

## License

Private — All rights reserved. Sky Life Sciences Solutions LLP.

---

## Author

**B. Keshav**  
Full-stack Developer  
Built with Next.js 15, MongoDB Atlas, TypeScript, and Tailwind CSS.
