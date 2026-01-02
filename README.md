# Focus Timers

A lightweight React app for tracking streaks and relapses, backed by Netlify
Functions and MongoDB.

## Features
- Multi-tracker dashboard with progress and relapse stats
- Auth gate backed by Netlify Functions
- MongoDB persistence for trackers

## Tech Stack
- React + TypeScript (Create React App)
- Netlify Functions (TypeScript build output)
- MongoDB via Mongoose

## Getting Started
```bash
npm install
npm run build:functions
netlify dev
```

The app runs on `http://localhost:4050` by default.

## Environment Variables
Create a `.env` file in the project root:
```bash
APP_PASSWORD=your-password
APP_SESSION_SECRET=your-secret
APP_SESSION_DAYS=30
MONGODB_URI=mongodb+srv://...
```

## Scripts
- `npm run start` - Starts CRA on port 4050
- `npm run build:functions` - Builds Netlify Functions to `netlify/functions/dist`
- `npm run build` - Builds app + functions
- `netlify dev` - Runs the app and functions locally
