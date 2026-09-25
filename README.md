# TallyVote — Multi-Tenant Voting SaaS 🗳️

## Quick Start

```bash
yarn install
cp .env.local.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

yarn db:push     # create tables in Postgres
yarn db:seed     # seed superadmin + test org
yarn dev         # localhost:3000
```

## Login
```
Superadmin → superadmin@tallyvote.app / Admin@1234
Test Org   → admin@testorg.com / Admin@1234
```

## Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Prisma Commands
```bash
yarn db:push      # sync schema to DB
yarn db:seed      # seed test data
yarn db:studio    # visual DB browser
yarn db:reset     # drop + recreate + reseed
```

## Routes
```
/auth/login           → shared login
/superadmin           → platform overview
/superadmin/orgs      → manage tenants
/superadmin/orgs/new  → CREATE TENANT
/superadmin/elections → all elections
/superadmin/revenue   → MRR breakdown
/dashboard            → org dashboard
/dashboard/elections  → org elections
/dashboard/results    → live results
/dashboard/create     → create election
/dashboard/qr         → QR codes
```
