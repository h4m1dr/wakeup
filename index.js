// Wakee Bot Core Worker for Cloudflare Workers

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle UI interaction from Discord Buttons
    if (request.method === "POST") {
      const bodyText = await request.text();
      let interaction;
      try {
        interaction = JSON.parse(bodyText);
      } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
      }

      // Discord Ping verification (Handshake)
      if (interaction.type === 1) {
        return Response.json({ type: 1 });
      }

      // Button clicks (Message Components)
      if (interaction.type === 3) {
        const customId = interaction.data.custom_id;
        
        if (customId === "btn_wake_hermes") {
          const targetUrl = env.HERMES_URL || "https://hermes-discord.onrender.com";
          try {
            const res = await fetch(targetUrl);
            return Response.json({
              type: 4,
              data: {
                content: `🟢 سیگنال بیدارباش با موفقیت به پروژه ارسال شد! (وضعیت پاسخ: ${res.status})`,
                flags: 64 // Ephemeral (Visible only to user)
              }
            });
          } catch (err) {
            return Response.json({
              type: 4,
              data: { content: `❌ خطا در برقراری ارتباط با سرویس: ${err.message}`, flags: 64 }
            });
          }
        }
      }

      // Slash command or Panel trigger
      if (interaction.type === 2) {
        return Response.json({
          type: 4,
          data: {
            content: "🎛 **پنل مدیریت و بیدارباش پروژه‌های ابری (Wakee)**\nروی دکمه‌ی زیر کلیک کنید تا سرویس خوابیده بیدار شود:",
            components: [
              {
                type: 1, // Action Row
                components: [
                  {
                    type: 2, // Button
                    style: 1, // Primary (Blurple)
                    label: "🚀 بیدار کردن سرویس اصلی",
                    custom_id: "btn_wake_hermes"
                  }
                ]
              }
            ]
          }
        });
      }
    }

    // 2. Simple status page for the Worker endpoint
    return new Response("Wakee Bot Worker is active and running smoothly!", { 
      status: 200, 
      headers: { "Content-Type": "text/plain; charset=utf-8" } 
    });
  },

  // 3. Randomized Cron trigger to keep services alive when needed
  async scheduled(event, env, ctx) {
    const targetUrl = env.HERMES_URL || "https://hermes-discord.onrender.com";
    try {
      await fetch(targetUrl);
      console.log("Scheduled wake-up ping executed successfully.");
    } catch (e) {
      console.error("Scheduled ping failed:", e);
    }
  }
};
