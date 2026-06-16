# Fedora Backend Setup Guide

This guide walks you through setting up and hosting your self-hosted CMS backend on your Fedora laptop. The backend handles your admin panel operations, SQLite database, image uploads, and exposes a public API secure under a Cloudflare Tunnel.

---

## Step 1: Install System Dependencies (Fedora)

Open a terminal on your Fedora laptop and install the required build tools and Node.js. 

SQLite's Node library (`better-sqlite3`) compiles native bindings upon installation. Therefore, you need the Fedora C/C++ development package group.

```bash
# Update system repositories
sudo dnf update -y

# Install Node.js (v18 or v20 recommended) and NPM
sudo dnf install nodejs npm -y

# Install standard GCC development tools (required to compile SQLite bindings)
sudo dnf groupinstall "Development Tools" -y
```

---

## Step 2: Copy files and Initialize

1. Copy the `blog-backend` folder from your Windows workspace to your Fedora home folder (e.g. `/home/yourusername/BlogWebsite/blog-backend`).
2. Open a terminal in that directory and run:

```bash
# Navigate to backend directory
cd /home/yourusername/BlogWebsite/blog-backend

# Install dependencies
npm install
```

---

## Step 3: Configure Environment Variables (`.env`)

1. Copy the template file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in a text editor (e.g., `nano .env`) and update details.
3. **Generate a JWT Secret**: Use openssl to get a secure secret:
   ```bash
   openssl rand -base64 32
   ```
   Paste this value into `JWT_SECRET=`.
4. **Generate Admin Password Hash**: 
   - Start the backend temporarily: `node server.js`
   - Open your browser, navigate to your login page (or send a POST request with your desired email and password).
   - The backend console will log a warning saying `ADMIN_PASSWORD_HASH is not set` and will print a pre-compiled hash for the password you tried.
   - Copy that string starting with `$2a$...` and paste it into `.env` under `ADMIN_PASSWORD_HASH=`.
   - Restart the server.

---

## Step 4: Configure Cloudflare Tunnel (`cloudflared`)

Cloudflare Tunnel securely exposes your local server port `3000` to the internet without opening router ports or exposing your IP address.

1. **Install cloudflared on Fedora**:
   ```bash
   # Add Cloudflare package repository and install
   curl -fsSL https://pkg.cloudflare.com/cloudflare-main.repo | sudo tee /etc/yum.repos.d/cloudflare-main.repo
   sudo dnf install cloudflared -y
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   # This will output a link. Open it in a browser, login, and authorize your domain (shivangcodes.in)
   cloudflared tunnel login
   ```

3. **Create the Tunnel**:
   ```bash
   # Create a named tunnel
   cloudflared tunnel create shivang-blog-api
   ```
   *Note: This creates a credentials JSON file in `/home/username/.cloudflared/`.*

4. **Route DNS**:
   ```bash
   # Link the subdomain api.shivangcodes.in to the tunnel
   cloudflared tunnel route dns shivang-blog-api api.shivangcodes.in
   ```

5. **Create the Tunnel Configuration File**:
   Create a file `/home/username/.cloudflared/config.yml` with:
   ```yaml
   tunnel: shivang-blog-api
   credentials-file: /home/username/.cloudflared/UUID-OF-YOUR-TUNNEL.json

   ingress:
     - hostname: api.shivangcodes.in
       service: http://localhost:3000
     - service: http_status:404
   ```

6. **Test the Tunnel**:
   ```bash
   cloudflared tunnel run shivang-blog-api
   ```
   You should now be able to visit `https://api.shivangcodes.in/health` in your browser and see `{"status":"healthy",...}`.

---

## Step 5: Run as Systemd Services (Automatic Background Execution)

To ensure the API and tunnel start automatically when your Fedora laptop boots up:

### 1. Enable Node Express API Service
1. Copy the provided systemd service file to the system folder:
   ```bash
   sudo cp blog-api.service /etc/systemd/system/blog-api.service
   ```
2. Edit `/etc/systemd/system/blog-api.service` to update:
   - `User=` (your Fedora username)
   - `WorkingDirectory=` (absolute path to the `blog-backend` folder)
   - `ExecStart=` (output of `which node`)
3. Reload systemd and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start blog-api
   sudo systemctl enable blog-api
   ```
4. Verify status:
   ```bash
   sudo systemctl status blog-api
   ```

### 2. Enable Cloudflare Tunnel Service
1. Configure `cloudflared` to run as a system service:
   ```bash
   sudo cloudflared service install
   ```
   This automatically creates `/etc/systemd/system/cloudflared.service` using the config in `/etc/cloudflared/` or the root credentials.
2. Start and enable it:
   ```bash
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```
3. Verify status:
   ```bash
   sudo systemctl status cloudflared
   ```

---

## Step 6: Git & Publishing Workflow

When you write a post on your local admin panel:
1. The post is saved in the SQLite `blog.db` database.
2. An updated static cache `posts-cache.json` is generated in your website folder.
3. Uploaded cover images are copied to `uploads/` in the website folder.
4. **To update the public blog (for when your laptop is offline)**, run these git commands in your website root:
   ```bash
   git add posts-cache.json uploads/
   git commit -m "Publish: [Post Title]"
   git push origin main
   ```
5. Netlify will pick up the changes and rebuild. Since Netlify serves `posts-cache.json` statically, readers can load all your articles instantly even if your laptop is closed.
