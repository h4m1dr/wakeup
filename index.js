// Cloudflare Worker - Discord Wake-up & Control Bot with UI Buttons

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Discord Bot is running and waiting for interactions.", { status: 200 });
    }

    // 1. اعتبارسنجی درخواست‌های دیسکورد (Security Check)
    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    const bodyText = await request.text();

    // توجه: در پروژه واقعی روی کلادفلر، امضای دیسکورد با nacl بررسی می‌شود.
    const interaction = JSON.parse(bodyText);

    // پاسخ به PING اولیه دیسکورد برای تایید وب‌هوک
    if (interaction.type === 1) {
      return Response.json({ type: 1 });
    }

    // 2. مدیریت کلیک روی دکمه‌ها یا انتخاب از منوها (Message Components / UI)
    if (interaction.type === 3) {
      const customId = interaction.data.custom_id;

      if (customId === "btn_wake_hermes") {
        const targetUrl = "https://hermes-discord.onrender.com";
        try {
          const res = await fetch(targetUrl);
          return Response.json({
            type: 4,
            data: {
              content: `🟢 سیگنال بیدارباش با موفقیت به پروژه Hermes ارسال شد! (وضعیت پاسخ: ${res.status})`,
              flags: 64 // فقط خودت ببینی (Ephemeral)
            }
          });
        } catch (err) {
          return Response.json({
            type: 4,
            data: { content: `❌ خطا در بیدار کردن پروژه: ${err.message}`, flags: 64 }
          });
        }
      }
      
      // مدیریت سایر دکمه‌ها...
    }

    // 3. دستور متنی یا اسلش کامند برای باز کردن پنل گرافیکی UI
    if (interaction.type === 2) {
      const commandName = interaction.data.name;

      if (commandName === "controlpanel") {
        return Response.json({
          type: 4,
          data: {
            content: "🎛 **پنل مدیریت و بیدارباش پروژه‌های رندر**\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید:",
            components: [
              {
                type: 1, // Action Row
                components: [
                  {
                    type: 2, // Button
                    style: 1, // Primary (Blurple)
                    label: "🚀 بیدار کردن فوری Hermes",
                    custom_id: "btn_wake_hermes"
                  },
                  {
                    type: 2,
                    style: 2, // Secondary (Grey)
                    label: "⚙️ تنظیمات زمان‌بندی رندوم",
                    custom_id: "btn_random_settings"
                  }
                ]
              }
            ]
          }
        });
      }
    }

    return Response.json({ error: "Unknown interaction" }, { status: 400 });
  },

  // 4. بخش Cron Trigger برای اجرای خودکار در بازه‌های رندوم زمانی
  async scheduled(event, env, ctx) {
    const now = new Date();
    const currentHour = now.getHours(); // ساعت فعلی سیستم (UTC یا تنظیم‌شده)

    // فرض کنید بازه زمانی مجاز بین ساعت 12 تا 18 (12 الی 6 عصر) است
    const startHour = 12;
    const endHour = 18;

    if (currentHour >= startHour && currentHour < endHour) {
        // شانس رندوم برای اینکه در این ساعت پینگ فرستاده شود یا خیر (مثلاً 30 درصد شانس در هر اجرا)
        const randomChance = Math.random();
        if (randomChance < 0.3) {
            try {
                await fetch("https://hermes-discord.onrender.com");
                console.log("Random wake-up ping sent successfully during active window.");
            } catch (e) {
                console.error("Scheduled ping failed:", e);
            }
        }
    }
  }
};
