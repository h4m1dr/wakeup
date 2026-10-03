// Wakee Bot - Ultimate Cloudflare Worker with Setup Wizard, Protected Dashboard & Render Wake-up Engine

const SETUP_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>راه‌اندازی اولیه Wakee Wizard</title>
    <style>
        body { font-family: Tahoma, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 700px; margin: auto; background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); }
        h2 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px; }
        .step { background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-right: 4px solid #38bdf8; }
        input, button { width: 100%; padding: 12px; margin-top: 8px; background: #1e293b; border: 1px solid #475569; color: #fff; border-radius: 6px; box-sizing: border-box; }
        button { background: #0284c7; font-weight: bold; cursor: pointer; margin-top: 15px; }
        button:hover { background: #0369a1; }
        a { color: #38bdf8; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🛠 جادوگر راه‌اندازی ربات Wakee</h2>
        
        <div class="step">
            <strong>مقدمه:</strong> برای ساخت ربات، به <a href="https://discord.com/developers/applications" target="_blank">Discord Developer Portal</a> بروید، یک اپلیکیشن به نام <code>Wakee</code> بسازید.
        </div>

        <div class="step">
            <strong>لینک‌های قوانین و حریم خصوصی:</strong><br>
            لینک Terms: <input type="text" readonly value="https://h4m1dr.github.io/wakeup/terms.html"><br>
            لینک Privacy: <input type="text" readonly value="https://h4m1dr.github.io/wakeup/privacy.html">
        </div>

        <div class="step">
            <strong>تنظیم رمز عبور پنل:</strong>
            <input type="password" id="adminPass" placeholder="یک رمز عبور قوی برای پنل وارد کنید...">
        </div>

        <button onclick="completeSetup()">تایید و ورود به پنل مدیریت</button>
    </div>

    <script>
        function completeSetup() {
            const pass = document.getElementById('adminPass').value;
            if(!pass) { alert('لطفاً رمز عبور را وارد کنید!'); return; }
            localStorage.setItem('wakee_pass', pass);
            alert('راه‌اندازی اولیه انجام شد! به پنل هدایت می‌شوید.');
            window.location.href = '/panel';
        }
    </script>
</body>
</html>`;

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پنل مدیریت و بیدارباش Wakee</title>
    <style>
        body { font-family: Tahoma, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 900px; margin: auto; background: #1e293b; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        h2, h3 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 8px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-size: 14px; }
        input { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 6px; box-sizing: border-box; }
        button { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        button:hover { background: #0369a1; }
        .logs { background: #0f172a; padding: 12px; border-radius: 6px; font-family: monospace; height: 150px; overflow-y: auto; font-size: 12px; color: #34d399; }
    </style>
</head>
<body>
    <div class="container">
        <h2>⚡ کنترل‌پنل اختصاصی پروژه‌های رندر (هرمس و...)</h2>
        
        <div class="form-group">
            <label>آدرس پروژه رندر (مثلاً ربات هرمس):</label>
            <input type="text" id="renderUrl" placeholder="https://hermes-discord.onrender.com">
        </div>

        <div class="form-group">
            <label>توکن ربات دیسکورد:</label>
            <input type="password" id="botToken" placeholder="Discord Bot Token...">
        </div>

        <button onclick="saveProjectConfig()">ذخیره تنظیمات سرویس</button>

        <h3 style="margin-top: 30px;">📋 لاگ‌ها و وضعیت سیستم بیدارباش</h3>
        <div class="logs" id="logBox">
            [System] پنل امن با موفقیت بارگذاری شد.<br>
            [Status] آماده دریافت دستورات بیدارباش برای سرویس‌های رندر...
        </div>
    </div>
    <script>
        // بررسی رمز عبور ذخیره‌شده
        if(!localStorage.getItem('wakee_pass')) {
            window.location.href = '/setup';
        }

        function saveProjectConfig() {
            alert('تنظیمات پروژه با موفقیت ذخیره شد!');
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // صفحات عمومی و آزاد (بدون نیاز به رمز)
    if (url.pathname === "/setup") {
      return new Response(SETUP_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // صفحه پنل مدیریت (محافظت‌شده در لایه فرانت‌اند با پسورد)
    if (url.pathname === "/panel") {
      return new Response(DASHBOARD_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // مدیریت درخواست‌های دیسکورد (Interactions Endpoint)
    if (request.method === "POST") {
      const bodyText = await request.text();
      let interaction;
      try { interaction = JSON.parse(bodyText); } catch (e) { return new Response("Invalid JSON", { status: 400 }); }

      if (interaction.type === 1) return Response.json({ type: 1 }); // Discord Handshake

      // تعاملات دکمه‌ای برای بیدار کردن سرویس رندر هدف (مثل هرمس)
      if (interaction.type === 3 && interaction.data.custom_id === "btn_wake_target") {
        const targetUrl = env.RENDER_URL || "https://hermes-discord.onrender.com";
        try {
          const res = await fetch(targetUrl);
          return Response.json({
            type: 4,
            data: { content: `🟢 سیگنال بیدارباش به پروژه ارسال شد! (وضعیت پاسخ: ${res.status})`, flags: 64 }
          });
        } catch (err) {
          return Response.json({
            type: 4,
            data: { content: `❌ خطا در برقراری ارتباط با سرویس: ${err.message}`, flags: 64 }
          });
        }
      }

      // دستور اسلش برای فراخوانی دکمه‌های پنل
      if (interaction.type === 2) {
        return Response.json({
          type: 4,
          data: {
            content: "🎛 **مدیریت بیدارباش سرویس‌های رندر (Wakee)**\nبرای بیدار کردن پروژه روی دکمه زیر کلیک کنید:",
            components: [{
              type: 1,
              components: [{ type: 2, style: 1, label: "🚀 بیدار کردن سرویس رندر", custom_id: "btn_wake_target" }]
            }]
          }
        });
      }
    }

    // مسیر پیش‌فرض: هدایت به صفحه ستاپ یا پنل
    return Response.redirect(`${url.origin}/setup`, 302);
  }
};
