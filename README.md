# LeadDesk Mini 🚀

LeadDesk Mini is a portfolio-quality lead-capture and management SaaS platform featuring a public-facing, high-converting marketing landing page with server-validated intake and a secure, authenticated admin dashboard.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, TypeScript)
- **Database**: [Neon](https://neon.tech/) Serverless Postgres
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) using `@neondatabase/serverless` HTTP driver (`drizzle-orm/neon-http`). *Note: Operates without long-lived connection pools, ideal for serverless execution.*
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/) with Credentials Provider, JWT session strategy, and `bcryptjs` password hashing.
- **Validation**: [Zod](https://zod.dev/) shared schemas for client-side forms (`react-hook-form` + `@hookform/resolvers/zod`) and server action re-validation.
- **Styling**: Tailwind CSS v4 with dark mode SaaS aesthetics and Lucide React icons.

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- NPM or PNPM

### 2. Environment Variables
Create a `.env` file in the project root based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@ep-cool-server.region.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-generated-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Admin Seed Credentials
ADMIN_SEED_EMAIL="admin@leaddesk.com"
ADMIN_SEED_PASSWORD="AdminPass123!"
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Database Migration & Seeding
Generate database migrations and run the admin seed script:

```bash
# Push database schema to Neon Postgres
npm run db:push

# Seed default admin user account
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/admin](http://localhost:3000/admin) to log into the admin dashboard.

---

## 🔑 Test Admin Credentials (Grader Account)

The database seed script automatically generates an admin user based on `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`.

- **Email**: `admin@leaddesk.com`
- **Password**: `AdminPass123!`
- **Login URL**: `/login` (automatically redirected from `/admin` when unauthenticated).

---

## 📐 Data Model Rationale

The database schema (`src/db/schema.ts`) consists of two core tables:

### 1. `leads`
| Column | Type | Rationale |
| :--- | :--- | :--- |
| `id` | `text` (UUID) | Unique identifier for each inbound lead request. |
| `name` | `text` | Full name of client / lead contact. |
| `email` | `text` | Lead email address. |
| `budget_range` | `text` | Categorical budget tier (`< $5,000`, `$5,000 - $15,000`, etc.) used for lead qualification. |
| `message` | `text` | Project requirements overview. |
| `status` | `enum` (`new`, `contacted`, `closed`) | Tracks progress state in admin pipeline, defaulting to `new`. |
| `created_at` | `timestamp` | Timestamp of lead submission. |

### 2. `admin_users`
| Column | Type | Rationale |
| :--- | :--- | :--- |
| `id` | `text` (UUID) | Primary key for administrative accounts. |
| `email` | `text` (Unique) | Admin login identifier. |
| `password_hash` | `text` | Salted bcrypt password hash. Plaintext passwords are never stored. |
| `created_at` | `timestamp` | Account creation timestamp. |

---

## 🛡️ Authentication Architecture

- **Credentials Provider & JWT Strategy**: NextAuth v5 is configured with a Credentials provider and JWT session management. Since serverless deployments do not share persistent state, JWT tokens signed with `NEXTAUTH_SECRET` provide stateless, secure session verification.
- **Bcrypt Password Hashing**: Passwords are hashed with `bcryptjs` during seeding and verified server-side during login.
- **Middleware Guard**: `src/middleware.ts` intercept requests to `/admin*` and redirects unauthenticated users to `/login`.
- **Server Action Protection**: All sensitive server actions (such as `updateLeadStatusAction`) re-verify session credentials before mutating database state.

---

## 🌐 Public Site Footer Credit
Visible footer credit line included on all public pages per specification:
`Built for Digital Heroes Training Task` linking to [https://digitalheroesco.com](https://digitalheroesco.com).
