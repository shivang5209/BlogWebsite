# Shivang Codes — Blog CMS & Digital Hub (`blog.shivangcodes.in`)

A premium, ultra-fast personal blog website with a self-hosted CMS backend. 

## 🏗️ Architecture Overview

This project uses a hybrid architecture designed for speed, security, and zero downtime:
*   **Frontend (Public Site)**: Hosted on **Netlify CDN** for instant load times worldwide.
*   **Backend (API & Database)**: Hosted on your **Fedora laptop** (runs Node.js Express + SQLite).
*   **Security Tunnel**: Exposed securely via **Cloudflare Tunnel (`cloudflared`)** at `api.shivangcodes.in` (no open router ports required).
*   **Offline Fallback (Laptop Off)**: When you publish/edit a post, the backend compiles a static `posts-cache.json` feed into the repository. If your laptop is off, Netlify serves articles from this static cache. The backend only needs to be on when you write or edit.

```
VISITOR                   NETLIFY CDN                  YOUR FEDORA LAPTOP
───────                   ───────────                  ──────────────────
                          index.html   (cached posts)
Reads blog ──────────────►blog.html    (cached posts)
                          post.html    (cached posts)
                               │
                               │ (Fetch latest posts on page load)
                               ▼
                      Cloudflare Tunnel ──────────────► Express API  :3000
                      api.shivangcodes.in               SQLite Database (blog.db)
```

---

## 📂 Project Structure

```bash
├── admin/
│   ├── login.html        # JWT authentication panel
│   ├── dashboard.html    # Statistics & post management (CRUD)
│   └── editor.html       # Dual Editor (Quill Rich Text + EasyMDE Markdown)
├── blog-backend/         # Node.js + Express API project (deploy to Fedora)
│   ├── db.js             # SQLite manager & auto-seeder
│   ├── server.js         # API entry point & CORS configuration
│   ├── routes/           # Auth & Post API handlers
│   ├── middleware/       # JWT gatekeeper middleware
│   ├── uploads/          # Local storage for cover images
│   ├── package.json      # Backend dependencies
│   ├── .env.example      # Environment variables template
│   ├── SETUP.md          # Complete Fedora server configuration guide
│   ├── blog-api.service  # Systemd API autostart service template
│   └── cloudflared.service # Systemd Tunnel autostart service template
├── uploads/              # Frontend replica directory for uploaded images
├── api-config.js         # Dynamic API endpoint router (Local vs Production)
├── posts-cache.json      # Auto-generated static snapshot of published posts
├── posts.js              # Hardcoded local posts fallback (failsafe)
├── app.js                # Core JS engine (routing, navigation, layouts)
├── style.css             # Main stylesheet (dark navy glassmorphic layout)
└── netlify.toml          # Custom cache configurations & headers for Netlify
```

---

## ✍️ How to Write and Publish a Post

1.  **Boot your Fedora laptop** (if not already running). The API and Cloudflare Tunnel will start automatically via systemd.
2.  Open your browser and navigate to `https://blog.shivangcodes.in/admin/login.html` (or `http://localhost:5500/admin/login.html` in development).
3.  Log in using your secure administrator credentials.
4.  Write your article. You can switch between **Rich Text (Quill)** or **Markdown (EasyMDE)** using the toggle bar.
5.  Upload a cover image directly from your computer. The editor will automatically host it on your laptop and create a local replica copy.
6.  Click **Save Article**. Your article is now saved to the SQLite database.
    *   If you selected **Draft**, it will remain hidden from readers.
    *   If you selected **Publish Now** (or a **Scheduled** date in the past), it will go live instantly.

### 🌐 Deploying the offline static fallback (Very Important)
To ensure readers can see your new article even when you close your laptop, open a terminal in the project directory on your laptop and push the auto-generated cache and uploaded images to GitHub:

```bash
git add posts-cache.json uploads/
git commit -m "Publish: Your New Post Title"
git push origin main
```
Netlify will rebuild and host the static files in seconds.

---

## 🚀 Setting Up the Backend on Fedora

Please refer to [blog-backend/SETUP.md](file:///d:/BlogWebsite/blog-backend/SETUP.md) for a complete walkthrough on installing dependencies, setting up SQLite, creating your password hash, routing Cloudflare Tunnel, and starting background systemd services.
