# MegaDownloader-Revival-Web

**Language**: **English** · [中文](#中文)

## English

The official landing page for MegaDownloader Revival — full visual redesign (V2). Static files, no build step.

Cloudflare deployment is configured in `wrangler.jsonc`. `.assetsignore` lists the public website files, excluding development dependencies, tests, and local working data from uploads.

🌐 Live site: https://megadownloader-revival-web.a1175815821.workers.dev/ (hosted on [Cloudflare Workers](https://workers.cloudflare.com/), auto-deploys on push to main)

> ⭐ Like the project? Please Star the main repo: **[a1175815821/MegaDownloader-Revival](https://github.com/a1175815821/MegaDownloader-Revival)** — downloads and issues live there too; this repo hosts the site only.

### Main repo shortcuts

- 🏠 Main repo: https://github.com/a1175815821/MegaDownloader-Revival
- ⬇️ Download latest: https://github.com/a1175815821/MegaDownloader-Revival/releases/latest
- 🐞 Report issues: https://github.com/a1175815821/MegaDownloader-Revival/issues

### Local preview

```bash
python -m http.server 8471
# open http://127.0.0.1:8471/
```

Site data (stable version, release date, package sizes, download links, download counts, stars) syncs at runtime from the main repo's GitHub API. Counts are checked every 5 minutes while the page is visible; release metadata is cached for 6 hours. The download total sums GitHub Release asset downloads across all pages, including prereleases, rather than clicks on this website. The changelog cards are curated historical highlights.

Successful values are saved per field. Failed or rate-limited requests keep the last successful value and show an update status; a first visit without data shows `--`, never a built-in snapshot. The page retries while open and rechecks expired data when returning to the tab. GitHub's public API may itself cache counts, so this is not an instantaneous counter.

### Browser regression checks

The production site still needs no build step. Tests use Node.js 18+ and Playwright:

```bash
npm ci
npx playwright install chromium
npm test
```

To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` before running the tests. The tests mock GitHub responses and cover cache reloads, failed requests, pagination, zero counts, refresh timers, language changes, themes, and unavailable browser APIs. Set `LIVE_GITHUB=1` to also run the optional live API smoke check. Layout screenshots are saved under `test-results/`.

### Repo layout

| File | Purpose |
| --- | --- |
| `index.html` | markup only — structure and copy |
| `assets/css/style.css` | all styles (design system, components, motion) |
| `assets/js/main.js` | all logic (i18n, theme, GitHub sync, canvas FX, live demo) |
| `og.png` | 1200×630 share card used by the `og:image` / `twitter:image` tags |
| `_headers` | security & cache headers (CSP allows Google Fonts + api.github.com) |
| `robots.txt`, `sitemap.xml` | crawler hints |

### Site highlights

- Dark/light themes (system-following + manual), zh/en bilingual (browser detection + toggle)
- Live GitHub sync: stars / total downloads (5-minute checks), latest stable version / package metadata (6-hour cache), last-successful-data fallback
- Pure-canvas FX: particle network with download beams, live demo download window (3D tilt, throughput graph, quota countdown), decrypt-style headline
- `prefers-reduced-motion` fully respected; mobile sticky download bar; JSON-LD structured data

### License

[MIT](LICENSE)

## 中文

MegaDownloader Revival 的官网落地页 —— V2 全面视觉重制版。纯静态文件，无构建步骤。

Cloudflare 部署配置见 `wrangler.jsonc`。`.assetsignore` 指定公开站点文件，开发依赖、测试和本地工作数据不会上传。

🌐 线上地址：https://megadownloader-revival-web.a1175815821.workers.dev/（[Cloudflare Workers](https://workers.cloudflare.com/) 托管，push 到 main 自动部署）

> ⭐ 觉得项目不错请 Star 主仓库：**[a1175815821/MegaDownloader-Revival](https://github.com/a1175815821/MegaDownloader-Revival)** —— 下载、提 Issue 也都在那边，本仓只放站点。

### 主仓库直达

- 🏠 主仓库：https://github.com/a1175815821/MegaDownloader-Revival
- ⬇️ 下载最新版：https://github.com/a1175815821/MegaDownloader-Revival/releases/latest
- 🐞 反馈 Issue：https://github.com/a1175815821/MegaDownloader-Revival/issues

### 本地预览

```bash
python -m http.server 8471
# 打开 http://127.0.0.1:8471/
```

站点数据（稳定版本号、发布日期、包大小、下载链接、下载量、Stars）运行时从主仓库 GitHub API 同步。页面可见时每 5 分钟检查统计数据，版本元数据缓存 6 小时。累计下载汇总所有分页中的 GitHub Release 附件下载次数（含预发布版本），不统计官网按钮点击。更新日志卡片为人工精选的历史版本记录。

各项数据分别保存成功结果；接口失败或触发限流时保留上次成功值，并显示更新状态。首次访问且没有可用数据时显示 `--`，不再使用固定快照。页面保持打开时会重试，返回标签页时会检查过期数据。GitHub 公共接口自身也可能存在缓存，因此不是瞬时计数。

### 浏览器回归测试

生产网站仍无需构建。测试需要 Node.js 18+ 和 Playwright：

```bash
npm ci
npx playwright install chromium
npm test
```

也可以设置环境变量 `PLAYWRIGHT_CHANNEL=chrome`，使用已安装的 Chrome。测试模拟 GitHub 响应，覆盖缓存刷新、请求失败、分页、零计数、定时同步、语言和主题切换，以及浏览器 API 不可用的降级情况。设置 `LIVE_GITHUB=1` 可额外运行真实接口检查。布局截图保存在 `test-results/`。

### 仓库结构

| 文件 | 用途 |
| --- | --- |
| `index.html` | 纯标记（结构 + 文案） |
| `assets/css/style.css` | 全部样式（设计系统 / 组件 / 动效） |
| `assets/js/main.js` | 全部逻辑（双语 / 主题 / GitHub 同步 / Canvas 特效 / 仿真演示） |
| `og.png` | 1200×630 分享卡，供 `og:image` / `twitter:image` 引用 |
| `_headers` | 安全与缓存响应头（CSP 已放行 Google Fonts 与 api.github.com） |
| `robots.txt`、`sitemap.xml` | 爬虫提示 |

### 站点亮点

- 深/浅双主题（跟随系统 + 手动切换）、中英双语（浏览器检测 + 手动切换）
- GitHub 同步：Stars / 累计下载每 5 分钟检查，最新稳定版本与包信息缓存 6 小时，失败保留上次成功数据
- 纯 Canvas 特效：粒子网络 + 下载光束流星、3D 倾斜仿真下载窗口（吞吐曲线 / 配额倒计时）、解密式标题动画
- 完整支持 `prefers-reduced-motion`；移动端常驻下载条；JSON-LD 结构化数据

### License

[MIT](LICENSE)
