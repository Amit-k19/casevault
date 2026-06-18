# CaseVault

A case-competition slide showcase, built for the E-Cell Tech Team Recruitment task.

## What this app does

- Anyone can **browse, search, filter, and sort** uploaded slides on the home page — no login needed (Public route).
- Only **logged-in users** can upload, edit, or delete a slide (Protected routes, checked via JWT).
- Auth is email + password. Passwords are hashed with bcrypt before being saved; nobody (not even you, looking at the database) can see the real password.

## Folder structure (and what each piece does)

```
casevault/
├── app/
│   ├── page.js              -> Home page (the Gallery): search, filter, sort, pagination
│   ├── login/page.js        -> Login form
│   ├── register/page.js     -> Register form
│   ├── upload/page.js       -> Upload form (protected — needs to be logged in)
│   ├── layout.js            -> Wraps every page (fonts, global styles)
│   ├── globals.css          -> Tailwind setup
│   └── api/
│       ├── auth/register/route.js   -> POST: create a new user
│       ├── auth/login/route.js      -> POST: check password, return a JWT
│       └── slides/
│           ├── route.js             -> GET (list, public) + POST (create, protected)
│           └── [id]/route.js        -> GET/PUT/DELETE for one specific slide
├── models/
│   ├── User.js               -> Mongoose schema: name, email, hashed password
│   └── Slide.js               -> Mongoose schema: title, description, tags, etc.
├── lib/
│   ├── mongodb.js            -> Opens (and reuses) the database connection
│   └── auth.js                -> Creates and checks JWT tokens
└── components/
    ├── Navbar.js
    └── SlideCard.js
```

## How to run this locally

1. **Copy environment variables.** Duplicate `.env.local.example` as `.env.local` and fill in:
   - `MONGODB_URI` — from MongoDB Atlas (free tier is fine). Atlas → Database → Connect → Drivers → copy the connection string, replace `<password>`.
   - `JWT_SECRET` — any random long string. Generate one with:
     ```
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

2. **Install and run:**
   ```
   npm install
   npm run dev
   ```
   Open http://localhost:3000

3. **Test the flow:** Register a user → Log in → Upload a slide (paste any image/PDF URL for the preview and slide link — no file-upload server needed) → see it appear on the home page.

## Deploying (for your submission link)

The fastest path with Next.js is **Vercel** (made by the same company, zero-config):

1. Push this project to GitHub (your repo, frontend + backend together since Next.js handles both).
2. Go to vercel.com → "Add New Project" → import your GitHub repo.
3. In the project's Environment Variables settings, add `MONGODB_URI` and `JWT_SECRET` (same values as your `.env.local`).
4. Deploy. You'll get a live `https://your-project.vercel.app` link — that's your submission link.

If Atlas blocks the connection, go to Atlas → Network Access → Add IP Address → "Allow access from anywhere" (0.0.0.0/0) — fine for a student project, not for real production.

## What was simplified on purpose (and why — good to mention in interview)

- **File uploads are URL-based, not direct file upload.** Instead of building a file-upload server (multer/Cloudinary/S3), the upload form takes a *link* to the slide and preview image. This was a deliberate scope decision to focus the limited time on the core CRUD + auth logic the task asks for, rather than file storage infrastructure.
- **Token storage is `localStorage`**, not httpOnly cookies. Simpler to implement and explain; in a real production app you'd usually prefer httpOnly cookies to reduce XSS risk.

## Explaining this in your interview — quick cheat sheet

- **"How does login work?"** → User submits email/password → server checks the email exists → compares the password against the bcrypt hash → if it matches, signs a JWT containing the user's ID → sends it back. The frontend stores that JWT and attaches it as `Authorization: Bearer <token>` on every request that needs to prove who's logged in.
- **"Why JWT and not sessions?"** → JWT is stateless — the server doesn't need to store session data anywhere; the token itself carries the proof. Good fit for an API-driven app like this.
- **"Why MongoDB?"** → Slides have a flexible-ish shape (tags array, optional fields) — a document database fits naturally without needing rigid table migrations.
- **"How does search/filter/sort work?"** → The GET `/api/slides` route reads query parameters (`search`, `category`, `sort`, `page`) and builds a MongoDB filter dynamically — `$regex` for text search, `countDocuments` + `skip`/`limit` for pagination.
- **"What would you improve given more time?"** → Real file uploads via a cloud storage bucket, httpOnly cookie-based auth, edit/delete UI for the slide owner, debounced search input.
