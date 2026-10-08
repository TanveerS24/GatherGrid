# GatherGrid

A public, city-wide activity platform — discover, join, and manage events near you.

---

## Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **MongoDB Atlas account** — [mongodb.com/atlas](https://www.mongodb.com/atlas) (free tier works)

---

## One-time setup

### 1 — Clone and install

```
# From anywhere on your machine:
cd C:\Users\Tanveer\Projects\GatherGrid
npm install
```

### 2 — Create your `.env` file

```
# In C:\Users\Tanveer\Projects\GatherGrid
copy .env.example server\.env
```

Open `server\.env` and fill in your Atlas connection string:

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/gathergrid?retryWrites=true&w=majority
```

> **Where to find it:** MongoDB Atlas dashboard → your cluster → **Connect** → **Drivers** → copy the connection string.

---

## Running the apps

Open **4 separate terminal windows**, all starting from the same root directory:

```
C:\Users\Tanveer\Projects\GatherGrid
```

### Terminal 1 — API server (port 4000)

```
npm run dev:server
```

### Terminal 2 — Participant app (port 5173)

```
npm run dev:participant
```

### Terminal 3 — Organizer portal (port 5174)

```
npm run dev:organizer
```

### Terminal 4 — Admin panel (port 5175)

```
npm run dev:admin
```

> All commands must be run from `C:\Users\Tanveer\Projects\GatherGrid` (the workspace root).

---

## URLs

| App | URL |
|---|---|
| Participant | http://localhost:5173 |
| Organizer Portal | http://localhost:5174 |
| Admin Panel | http://localhost:5175 |
| API Health | http://localhost:4000/health |
| API Readiness | http://localhost:4000/ready |

---

## Verify everything is working

After starting the server, open your browser (or curl) and hit:

```
http://localhost:4000/health
```

You should see:
```json
{ "status": "ok", "timestamp": "...", "uptime": 1.23 }
```

Then check:
```
http://localhost:4000/ready
```

You should see:
```json
{ "status": "ok", "db": "connected", "timestamp": "..." }
```

If `db` shows `disconnected`, double-check your `MONGODB_URI` and that your Atlas cluster allows connections from your IP (Atlas → Network Access → Add IP Address).

---

## Other useful commands

All run from `C:\Users\Tanveer\Projects\GatherGrid`:

```bash
# Type-check everything
npm run typecheck

# Run server tests
npm run test -w server

# Build everything for production
npm run build

# Format all files
npm run format
```