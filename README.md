# ⚡ Wakee (Wakeup Bot)

A lightweight, serverless Discord management and wake-up bot built for **Cloudflare Workers**. Designed to keep your free-tier cloud services (like Render) alive using on-demand Discord UI buttons and randomized smart pings.

## Quick Start (One-Click Deployment)

The fastest way to deploy Wakee is by using the official Cloudflare Workers deployment button below:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/h4m1dr/wakeup)

---

## Features

- **🚀 On-Demand UI Wake-up:** Wake up your sleeping Render or cloud services instantly using modern Discord buttons.
- **🕒 Smart Randomized Crons:** Automatically triggers randomized pings within specified active time windows to avoid robotic patterns.
- **☁️ Cloudflare Edge Hosted:** Runs globally on Cloudflare Workers with zero sleep timeout and absolute reliability.
- **🔒 Secure Interactions:** Validates all incoming Discord webhook signatures natively.

---

## Manual Installation Guide (Directly via Cloudflare Dashboard)

If you prefer not to use the automated deploy button or Wrangler CLI, you can easily set up and paste the code directly inside your Cloudflare browser dashboard. Follow these steps:

### Step 1: Create a Cloudflare Worker
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. From the left sidebar, navigate to **Workers & Pages**.
3. Click on the **Create application** button and select **Create Worker**.
4. Give your worker a recognizable name (e.g., `wakee-bot`) and click **Deploy**. (Don't worry about the default code for now).

### Step 2: Paste the Bot Code
1. Once deployed, click on the **Edit code** button inside your newly created worker.
2. In the online code editor (Workers Playground), delete any existing default code in the `index.js` file.
3. Copy the clean worker code from this repository's `index.js` (or `worker.js`) file and paste it directly into the Cloudflare online editor.
4. Click the **Save and deploy** button in the top right corner.

### Step 3: Configure Environment / Target URLs
1. Go back to your worker's main dashboard settings.
2. Navigate to the **Settings** tab, then select **Variables**.
3. Under the **Environment Variables** section, click **Add variable** to define your target project URLs (for example, to point to your Render web services).
4. Click **Save**.

### Step 4: Link with Discord Developer Portal
1. Copy your worker's live URL (e.g., `https://wakee-bot.your-subdomain.workers.dev`).
2. Go to the [Discord Developer Portal](https://discord.com/developers/applications), open your application, and paste your worker URL into the **Interactions Endpoint URL** field.
3. Save changes. Your bot is now fully operational and ready to receive interactions!

---

## License

MIT License

## Configuration

After deployment, make sure to configure your environment variables or target URLs inside your worker configuration to point to your target applications (e.g., your Render web services).

## License

MIT License
