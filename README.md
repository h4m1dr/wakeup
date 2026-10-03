# ⚡ Wakee (Wakeup Bot)

A lightweight, serverless Discord management and wake-up bot built for **Cloudflare Workers**. Designed to keep your free-tier cloud services (like Render) alive using on-demand Discord UI buttons and randomized smart pings.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/h4m1dr/wakeup)

---

## Features

- **🚀 On-Demand UI Wake-up:** Wake up your sleeping Render or cloud services instantly using modern Discord buttons.
- **🕒 Smart Randomized Crons:** Automatically triggers randomized pings within specified active time windows to avoid robotic patterns.
- **☁️ Cloudflare Edge Hosted:** Runs globally on Cloudflare Workers with zero sleep timeout and absolute reliability.
- **🔒 Secure Interactions:** Validates all incoming Discord webhook signatures natively.

---

## One-Click Deployment

Click the button below to deploy your own instance of Wakee directly to Cloudflare Workers:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/h4m1dr/wakeup)

---

## Configuration

After deployment, make sure to configure your environment variables or target URLs inside your worker configuration to point to your target applications (e.g., your Render web services).

## License

MIT License
