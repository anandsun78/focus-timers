# Focus Timers

React based application dashboard with count down timers for focusing. Tracking last time used 
social media etc.

## Tech Stack
- React 18 + TypeScript, React Router 6
- Netlify Functions (TypeScript) + MongoDB via mongoose
- Auth gate backed by Netlify Functions

## Getting Started
```bash
npm install
npm run build:functions
netlify dev
```

The app runs on `http://localhost:4050` by default.

## Required ENV Vars/Setup:
Require a mongodb atlas account. Can get a free account from https://account.mongodb.com/
Require a nelify account (optional) for deployment.

Create a `.env` file in the project root:
```bash
APP_PASSWORD - password to access the site (for ex 4499)
APP_SESSION_SECRET - used along side the password can use any hash value here.
APP_SESSION_DAYS - (optional) how many days the streak should be tracked by default it is 30 days
MONGODB_URI - the mongodb atlas uri ex: mongodb+srv://your_uri
```

## Deployment
Netlify-ready via `netlify.toml`. Functions are bundled from `netlify/functions` with `esbuild` and proxied under `/api/*`.
