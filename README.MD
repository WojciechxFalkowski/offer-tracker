# Offer Tracker MVP Setup Guide

This guide explains how to set up and run the Offer Tracker MVP application.

## Project Structure

The project consists of two main parts:

- Frontend: Vue 3 + TypeScript + Element Plus
- Backend: NestJS + PostgreSQL

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

## Frontend Setup

1. Create a new Vue project:

```bash
npm init vue@latest
# Select the following options:
# ✓ Project name: offer-tracker-frontend
# ✓ Add TypeScript? Yes
# ✓ Add Vue Router? No
# ✓ Add Pinia? No
# ✓ Add Vitest? No
# ✓ Add End-to-End Testing? No
# ✓ Add ESLint? Yes
# ✓ Add Prettier? Yes
```

2. Navigate to the project folder and install dependencies:

```bash
cd offer-tracker-frontend
npm install
npm install element-plus @element-plus/icons-vue axios tailwindcss postcss autoprefixer
```

3. Set up Tailwind CSS:

```bash
npx tailwindcss init -p
```

4. Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

5. Create `.env` file in the project root:

```
VITE_API_URL=http://localhost:3000
```

6. Copy the provided Vue components and files into the appropriate folders:

   - `src/main.ts`
   - `src/App.vue`
   - `src/components/UrlTracker.vue`
   - `src/assets/main.css`

7. Start the development server:

```bash
npm run dev
```

## Backend Setup

1. Create a new NestJS project:

```bash
npm i -g @nestjs/cli
nest new offer-tracker-backend
cd offer-tracker-backend
```

2. Install required dependencies:

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/schedule @nestjs/config class-validator class-transformer cheerio axios
```

3. Create `.env` file in the project root:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=offertracker
DB_SYNCHRONIZE=true

# CORS
FRONTEND_URL=http://localhost:5173

# Server
PORT=3000
```

4. Create the database in PostgreSQL:

```sql
CREATE DATABASE offertracker;
```

5. Copy the provided NestJS files into the appropriate folders following the structure below:

```
src/
├── app.module.ts
├── main.ts
├── tracked-url/
│   ├── tracked-url.controller.ts
│   ├── tracked-url.dto.ts
│   ├── tracked-url.entity.ts
│   ├── tracked-url.module.ts
│   └── tracked-url.service.ts
├── offer/
│   ├── offer.entity.ts
│   ├── offer.module.ts
│   └── offer.service.ts
└── crawler/
    ├── crawler.module.ts
    └── crawler.service.ts
```

6. Start the backend server:

```bash
npm run start:dev
```

## Usage

1. Access the frontend application at `http://localhost:5173`
2. Add URLs to track through the UI
3. The backend will automatically crawl these URLs every hour (you can trigger manually for testing)
4. The parser in `crawler.service.ts` is configured for otomoto.pl, but you may need to adjust the selectors depending on the exact website structure

## Customization

### Adjusting the Crawler

The current crawler is configured for otomoto.pl. To adapt it for other websites:

1. Open `src/crawler/crawler.service.ts`
2. Modify the CSS selectors in the `crawlUrl` method to match the target website's structure
3. Adjust the data extraction logic as needed

### Adding New Features

Some potential enhancements:

- Email notifications for new offers
- More detailed offer information
- Filtering and searching capabilities
- User authentication
