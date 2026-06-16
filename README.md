# Shivang Codes — Blog & Digital Hub (`shivangcodes.in`)

A premium, ultra-fast, and completely static personal portfolio and engineering blog.

## 🏗️ Architecture Overview

This project is built using a JAMstack philosophy designed for absolute speed, zero server maintenance, and perfect security:
*   **Static Site**: Hosted on **Netlify CDN** for instant load times worldwide.
*   **Zero Database**: Articles are managed as plain data files inside the repository.
*   **Pure Vanilla Stack**: Built with plain HTML, Vanilla CSS, and modern JavaScript. No complex frameworks or compilation steps required.

---

## 📂 Project Structure

```bash
├── posts.js              # Source database of all articles (written as JS array)
├── posts-cache.json      # JSON snapshot of posts (used for static caching)
├── app.js                # Core JS engine (rendering, routing, layouts)
├── style.css             # Main stylesheet (dark navy glassmorphic layout)
├── index.html            # Portfolio & Digital Hub homepage
├── blog.html             # Blog directory & tags filter page
├── post.html             # Dynamic article reader (supports Markdown parsing)
├── about.html            # Personal profile page
├── portfolio-preview.png # Custom generated SEO preview banner
└── netlify.toml          # Custom cache configurations & headers for Netlify
```

---

## ✍️ How to Write and Publish a Post

Since the website is completely static, writing a post is simple:
1. Open the file **`posts.js`**.
2. Add a new object to the `BLOG_POSTS` array containing your article's metadata and content.
3. Run `node scratch/fix_json.js` to automatically regenerate and validate `posts-cache.json`.
4. Commit and push the changes to GitHub:
   ```bash
   git add posts.js posts-cache.json
   git commit -m "Content: Add my new post"
   git push origin main
   ```
5. Netlify will detect the commit, trigger a build, and publish your new post to the live web in seconds!
