// Render the share card from HTML and the bundled native screenshot. No network requests.
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

async function main() {
  const root = path.resolve(__dirname, '..');
  const capture = await fs.readFile(path.join(root, 'assets/img/workbench-dark.png'));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html lang="zh-CN"><meta charset="utf-8">
      <style>
        *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;color:#f5f5fa;
          font-family:"Microsoft YaHei","Segoe UI",sans-serif;background:#07080e;
          background-image:radial-gradient(ellipse at 0 0,#39151d 0,transparent 55%),radial-gradient(ellipse at 100% 100%,#20183d 0,transparent 60%)}
        .frame{position:absolute;inset:25px;border:1px solid #ffffff20;border-radius:24px}
        header{display:flex;align-items:center;gap:14px;padding:54px 56px 0;font-size:17px;font-weight:700}
        .logo{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:linear-gradient(120deg,#ff4655,#ff8a3d)}
        .version{padding:6px 12px;margin-left:10px;border-radius:20px;background:#ff654322;color:#ff9a60;font:700 13px "Segoe UI",sans-serif}
        main{display:grid;grid-template-columns:470px 1fr;gap:26px;margin:46px 56px 0;align-items:center}
        h1{font-size:38px;line-height:1.35;letter-spacing:-1px;margin:0 0 8px}
        h2{font-size:47px;line-height:1.3;letter-spacing:-1px;margin:0 0 24px;background:linear-gradient(100deg,#ff4655,#ffaf46);background-clip:text;color:transparent}
        p{font-size:18px;line-height:1.85;color:#b4bdcf;margin:0}p b{color:#f5f5fa}
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.chips span{border:1px solid #ffffff28;padding:6px 10px;border-radius:20px;font-size:11px;color:#d3d8e6}
        figure{margin:0;transform:rotate(-1deg)}img{display:block;width:100%;height:auto;border:1px solid #ffffff33;border-radius:10px;box-shadow:0 25px 60px #0008}
        figcaption{text-align:right;font-size:11px;color:#8f9bb0;margin-top:12px}
        footer{position:absolute;left:56px;right:56px;bottom:46px;display:flex;justify-content:space-between;font:11px "Segoe UI",sans-serif;letter-spacing:1px;color:#7c8ba5}
      </style>
      <div class="frame"></div><header><span class="logo"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg></span>MegaDownloader Revival<span class="version">V2.6.1</span></header>
      <main><section><h1>经典 MEGA 下载工作台</h1><h2>2.6.1，更顺手。</h2><p><b>更清晰的工作台 · 更快打开的设置</b><br>语言跟随 Windows，细节持续打磨。<br>两步批量添加、搜索与定时下载。</p><div class="chips"><span>Windows 7 SP1+</span><span>单文件免安装</span><span>10 种界面语言</span><span>MIT 开源</span></div></section><figure><img src="data:image/png;base64,${capture.toString('base64')}" width="1196" height="759" alt="2.6.1 原生工作台"><figcaption>2.6.1 原生界面 · 简体中文示例数据</figcaption></figure></main>
      <footer><span>MULTI-THREADED · RESUMABLE · QUOTA RECOVERY</span><span>github.com/a1175815821/MegaDownloader-Revival</span></footer>
    </html>`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(root, 'og.png') });
    console.log('Rendered og.png (1200 × 630)');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
