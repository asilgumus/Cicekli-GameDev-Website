# Çiçekli Game Dev

Community site for Çiçekli Game Dev, a Turkish game development community. Blog, events and announcements in both English and Turkish, managed from a small admin panel.

## Getting started

Needs Node 18+.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. For a production build use `npm run build` and `npm run start`.

## How content works

There's no database. Everything — posts, events, announcements — lives in a single JSON file, `data/posts.json`. The admin panel reads and writes it through the API routes in `app/api`.

Admin login is at `/login`. Credentials come from `ADMIN_USERNAME` / `ADMIN_PASSWORD`; logging in sets an `auth_token` cookie whose value must match `ADMIN_SESSION_TOKEN`. `middleware.js` (for `/admin` pages) and all admin API routes check that cookie against it. Copy `.env.example` to `.env` and fill all three in, and set the same vars in your host's environment settings for production.

Images can be uploaded through the panel or added by URL. Uploaded files go to `public/uploads/`.

## Languages

The site is English/Turkish. UI text lives in `locale/en.json` and `locale/tr.json`; the switcher in the navbar toggles between them and the choice is remembered in localStorage.

## Structure

```
app/          pages, layouts and API routes
components/   shared UI components
contexts/     LanguageContext
locale/       en.json, tr.json
data/         posts.json (all content)
lib/          data helpers
```

## Tech

- Next.js (App Router) + React 19
- CSS Modules
- lucide-react for icons
- Space Grotesk / Inter

## Contact

- LinkedIn: [Çiçekli GameDev](https://www.linkedin.com/company/cicekli-gamedev/)
- GitHub: [Cicekli-GameDev](https://github.com/Cicekli-GameDev)
- Instagram: [@cicekli_gamedev](https://www.instagram.com/cicekli_gamedev/)