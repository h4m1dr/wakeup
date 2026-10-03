// Wakee Bot - Stage 1: Setup Wizard Only
const WIZARD_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>راه‌اندازی Wakee | Setup Wizard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-3xl w-full bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 class="text-3xl font-bold text-blue-400 mb-2 text-center">⚡ جادوگر راه‌اندازی Wakee</h1>
        <p class="text-center text-slate-400 mb-8 text-sm">این صفحه ورکر اولیه شماست. مراحل زیر را تکمیل کنید تا ربات به صورت خودکار پیکربندی و ارتقا یابد.</p>

        <div class="space-y-6">
            <!-- Step 1: Discord Info -->
            <div class="bg-slate-900 p-5 rounded-lg border-r-4 border-blue-500">
                <h3 class="font-bold text-lg mb-3 text-blue-300">۱. تنظیمات دیسکورد (Discord Developer Portal)</h3>
                <p class="text-sm text-slate-400 mb-3">مقادیر زیر را در بخش تنظیمات اپلیکیشن دیسکورد خود کپی کنید:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span class="text-slate-500">Name:</span> <code class="bg-slate-700 px-2 py-1 rounded text-white">Wakee</code></div>
                    <div><span class="text-slate-500">Description:</span> <code class="bg-slate-700 px-2 py-1 rounded text-white text-xs">Smart management and wake-up bot for Render services.</code></div>
                    <div class="md:col-span-2"><span class="text-slate-500">Terms/Privacy URL:</span> <code class="bg-slate-700 px-2 py-1 rounded text-white text-xs break-all">https://h4m1dr.github.io/wakeup/terms.html</code></div>
                    <div class="md:col-span-2"><span class="text-slate-500">Interactions Endpoint:</span> <code id="workerUrl" class="bg-slate-700 px-2 py-1 rounded text-green-400 text-xs break-all">در حال دریافت...</code></div>
                </div>
                <p class="text-xs text-yellow-400 mt-3">⚠️ فراموش نکنید در بخش <strong>Bot</strong>، گزینه‌های Presence, Server Members, و Message Content Intent را روشن کنید.</p>
            </div>

            <!-- Step 2: Cloudflare Credentials -->
            <div class="bg-slate-900 p-5 rounded-lg border-r-4 border-yellow-500">
                <h3 class="font-bold text-lg mb-3 text-yellow-300">۲. اطلاعات حساب کلادفلر</h3>
                <p class="text-sm text-slate-400 mb-3">برای ساخت خودکار KV و تنظیمات، به این اطلاعات نیاز داریم:</p>
                
                <label class="block text-sm mb-1">Account ID:</label>
                <input type="text" id="cfAccountId" class="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white mb-3 focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="مثال: 8d5a...">
                <a href="https://dash.cloudflare.com/?to=/:account/workers" target="_blank" class="text-xs text-blue-400 hover:underline">🔗 پیدا کردن Account ID در پنل کلادفلر</a>

                <label class="block text-sm mb-1 mt-4">Cloudflare API Token:</label>
                <input type="password" id="cfApiToken" class="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white mb-3 focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="توکن با دسترسی Workers Edit و KV Edit">
                <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" class="text-xs text-blue-400 hover:underline">🔗 ساخت توکن جدید (از الگوی Edit Cloudflare Workers استفاده کنید و دسترسی Workers KV Storage: Edit را هم اضافه کنید)</a>
            </div>

            <!-- Step 3: Bot Config -->
            <div class="bg-slate-900 p-5 rounded-lg border-r-4 border-green-500">
                <h3 class="font-bold text-lg mb-3 text-green-300">۳. تنظیمات امنیتی ربات</h3>
                <label class="block text-sm mb-1">Discord Bot Token:</label>
                <input type="password" id="discordToken" class="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white mb-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="توکن ربات دیسکورد شما">
                
                <label class="block text-sm mb-1">رمز عبور مدیریت پنل (Admin Password):</label>
                <input type="password" id="adminPass" class="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none" placeholder="یک رمز قوی برای ورود به پنل انتخاب کنید">
            </div>

            <!-- Action Button -->
            <button id="installBtn" onclick="startInstallation()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition duration-200 text-lg shadow-lg">
                🚀 شروع نصب خودکار و ارتقای ورکر
            </button>
            
            <div id="statusLog" class="hidden bg-black rounded p-4 font-mono text-xs text-green-400 h-40 overflow-y-auto border border-slate-700"></div>
        </div>
    </div>

    <script>
        // نمایش آدرس فعلی ورکر
        document.getElementById('workerUrl').innerText = window.location.origin;

        function log(msg) {
            const logBox = document.getElementById('statusLog');
            logBox.classList.remove('hidden');
            logBox.innerHTML += \`> \${msg}<br>\`;
            logBox.scrollTop = logBox.scrollHeight;
        }

        async function startInstallation() {
            const accountId = document.getElementById('cfAccountId').value.trim();
            const apiToken = document.getElementById('cfApiToken').value.trim();
            const discordToken = document.getElementById('discordToken').value.trim();
            const adminPass = document.getElementById('adminPass').value.trim();
            const btn = document.getElementById('installBtn');

            if (!accountId || !apiToken || !discordToken || !adminPass) {
                alert('لطفاً تمام فیلدها را پر کنید!');
                return;
            }

            btn.disabled = true;
            btn.innerText = '⏳ در حال پیکربندی... (لطفاً صبر کنید)';
            log('شروع فرآیند نصب...');

            try {
                const workerName = "wakee-bot"; // نام پیش‌فرض ورکر
                const rawWorkerUrl = "https://raw.githubusercontent.com/h4m1dr/wakeup/main/full_worker.js";

                log('۱. در حال دریافت کد کامل ربات از گیت‌هاب...');
                const scriptRes = await fetch(rawWorkerUrl);
                if (!scriptRes.ok) throw new Error("عدم دسترسی به full_worker.js در گیت‌هاب");
                const scriptCode = await scriptRes.text();

                log('۲. در حال ساخت فضای ذخیره‌سازی KV (WAKEE_KV)...');
                const kvRes = await fetch(\`https://api.cloudflare.com/client/v4/accounts/\${accountId}/storage/kv/namespaces\`, {
                    method: 'POST',
                    headers: {
                        'Authorization': \`Bearer \${apiToken}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: "WAKEE_KV" })
                });
                const kvData = await kvRes.json();
                if (!kvData.success) throw new Error("خطا در ساخت KV: " + JSON.stringify(kvData.errors));
                const kvId = kvData.result.id;
                log(\`✅ KV ساخته شد. ID: \${kvId}\`);

                log('۳. در حال آپلود کد کامل ربات و اتصال KV...');
                // استفاده از فرمت multipart برای آپلود ورکر با بایندینگ
                const formData = new FormData();
                formData.append("metadata", JSON.stringify({
                    main_module: "worker.js",
                    bindings: [{ name: "WAKEE_KV", type: "kv_namespace", namespace_id: kvId }]
                }));
                formData.append("worker.js", new Blob([scriptCode], { type: "application/javascript+module" }));

                const uploadRes = await fetch(\`https://api.cloudflare.com/client/v4/accounts/\${accountId}/workers/scripts/\${workerName}\`, {
                    method: 'PUT',
                    headers: { 'Authorization': \`Bearer \${apiToken}\` },
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (!uploadData.success) throw new Error("خطا در آپلود ورکر: " + JSON.stringify(uploadData.errors));
                log('✅ کد ربات با موفقیت جایگزین و KV متصل شد.');

                log('۴. در حال ذخیره امن توکن‌ها (Secrets)...');
                const secrets = [
                    { name: "DISCORD_TOKEN", text: discordToken },
                    { name: "ADMIN_PASSWORD", text: adminPass }
                ];
                
                for (const secret of secrets) {
                    const secRes = await fetch(\`https://api.cloudflare.com/client/v4/accounts/\${accountId}/workers/scripts/\${workerName}/secrets\`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': \`Bearer \${apiToken}\`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: secret.name, text: secret.text, type: "secret_text" })
                    });
                    const secData = await secRes.json();
                    if (!secData.success) throw new Error(\`خطا در ذخیره \${secret.name}\`);
                }
                log('✅ توکن‌ها به صورت رمزنگاری‌شده ذخیره شدند.');

                log('۵. در حال تنظیم Cron Job برای بیدارباش خودکار (هر ۱۵ دقیقه)...');
                const cronRes = await fetch(\`https://api.cloudflare.com/client/v4/accounts/\${accountId}/workers/scripts/\${workerName}/schedules\`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': \`Bearer \${apiToken}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cron: ["*/15 * * * *"] })
                });
                const cronData = await cronRes.json();
                if (!cronData.success) log('⚠️ هشدار: تنظیم Cron با خطا مواجه شد، می‌توانید دستی از پنل کلادفلر انجام دهید.');
                else log('✅ Cron Job تنظیم شد.');

                log('🎉 نصب با موفقیت کامل شد! در حال انتقال به پنل مدیریت...');
                setTimeout(() => {
                    window.location.href = '/panel';
                }, 2000);

            } catch (error) {
                console.error(error);
                log(\`❌ خطا: \${error.message}\`);
                btn.disabled = false;
                btn.innerText = '🚀 تلاش مجدد برای نصب';
            }
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request) {
    // هر درخواستی به این ورکر اولیه، صفحه ویزارد را برمی‌گرداند
    return new Response(WIZARD_HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};
