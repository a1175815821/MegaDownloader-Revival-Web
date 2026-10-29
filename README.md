# MegaDownloader-Revival-Web

**Language**: **English** · [中文](#中文)

## English

The official landing page for MegaDownloader Revival — V2.6 visual redesign around the 2.6 workbench release. Static files, no build step.

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

### The 2.6 workbench section

`#workbench` is a hands-on recreation of the 2.6 interface, not a screenshot. Four tour entries switch the simulated window between:

| Tour entry | What it demonstrates |
| --- | --- |
| One window, two steps | Paste links (step 1) → file selection (step 2); the “parse and pick files” button advances the demo |
| File tree · tri-state | Click any row or checkbox to tick it; folder checkboxes recompute to checked / partial / empty and the selected file count and size follow |
| Ctrl+F task search | Types into a real input; rows filter live on package name, filename and path, `Esc` clears and restores the queue |
| Scheduled downloads | Shows the daily window, cross-midnight / pause-at-end / restart-persistence toggles and the next-run strip |

The panel is decorative only: nothing is downloaded, stored, or sent anywhere. All text is bilingual and the whole section degrades to a static layout with `prefers-reduced-motion`.

### Real 2.6 screenshots

The screenshot strip under the demo stays hidden until the files exist, so the page never ships a broken image. Drop real captures into `assets/img/` with these exact names — light and dark for each slot:

| Slot | Dark | Light |
| --- | --- | --- |
| Workbench | `workbench-dark.png` | `workbench-light.png` |
| Two-step add / file tree | `addlink-dark.png` | `addlink-light.png` |
| Settings / schedule | `settings-dark.png` | `settings-light.png` |

Recommended 1280×800 (or any 16:10 crop). Each image is checked independently. The strip follows the site theme, falls back to the other image if needed, and stays hidden when no image loads.

### Browser regression checks

The production site still needs no build step. Tests use Node.js 18+ and Playwright:

```bash
npm ci
npx playwright install chromium
npm test
```

To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` before running the tests. The tests mock GitHub responses and cover cache reloads, failed requests, pagination, zero counts, refresh timers, language changes, themes, the workbench demo interactions, and unavailable browser APIs. Set `LIVE_GITHUB=1` to also run the optional live API smoke check. Layout screenshots are saved under `test-results/`.

### Repo layout

| File | Purpose |
| --- | --- |
| `index.html` | markup only — structure and copy |
| `assets/css/style.css` | all styles (design system, components, workbench demo, motion) |
| `assets/js/main.js` | all logic (i18n, theme, GitHub sync, canvas FX, live demo, workbench tour, screenshot probes) |
| `assets/img/` | optional real 2.6 screenshots — see the table above |
| `og.png` | 1200×630 share card used by the `og:image` / `twitter:image` tags |
| `_headers` | security & cache headers (CSP allows Google Fonts + api.github.com, images are same-origin) |
| `robots.txt`, `sitemap.xml` | crawler hints |

### Site highlights

- Dark/light themes (system-following + manual), zh/en bilingual (browser detection + toggle)
- Live GitHub sync: stars / total downloads (5-minute checks), latest stable version / package metadata (6-hour cache), last-successful-data fallback
- Interactive 2.6 workbench recreation: two-step add, tri-state file tree, live task search, schedule panel
- Cold-start comparison: 5–7 s → 0.15–0.2 s, with an animated bar pair and a five-metric hero strip
- Pure-canvas FX: particle network with download beams, live demo download window (3D tilt, throughput graph, quota countdown), decrypt-style headline
- Self-hiding screenshot slots, `prefers-reduced-motion` fully respected, mobile sticky download bar, JSON-LD structured data

### License

[MIT](LICENSE)

## 中文

MegaDownloader Revival 的官网落地页 —— V2.6 视觉重制，围绕 2.6 工作台大版本重写。纯静态文件，无构建步骤。

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

各项数据分别保存成功结果；接口失败或触发限流时保留上次成功值，并显示更新状态。首次访问且没有可用数据时显示 `--`，不使用固定快照。页面保持打开时会重试，返回标签页时会检查过期数据。GitHub 公共接口自身也可能存在缓存，因此不是瞬时计数。

### 2.6 工作台演示区

`#workbench` 是 2.6 界面的可交互仿真，不是截图。左侧四条导览会把右侧窗口切到不同状态：

| 导览 | 演示内容 |
| --- | --- |
| 一个窗口，两步完成 | 粘贴链接（第 1 步）→ 选择文件（第 2 步），点「解析并选择文件」进入下一步 |
| 文件树 · 三态勾选 | 点整行或勾选框切换；目录自动在「全选 / 半选 / 未选」之间重算，底部已选文件数与总大小实时更新 |
| Ctrl+F 任务搜索 | 真实输入框，按包名 / 文件名 / 路径实时过滤；`Esc` 清空并恢复队列 |
| 定时下载 | 展示每日时段、跨午夜 / 到点暂停 / 重启沿用开关与「下次启动」提示 |

演示不下载、不存储、不上传任何内容。文案中英双语，`prefers-reduced-motion` 下退化为静态布局。

### 2.6 真机截图

演示区下方的截图条在图片不存在时自动隐藏，不会出现裂图。把真机截图按下列文件名放进 `assets/img/`（每处都要深色 + 浅色两张）：

| 位置 | 深色 | 浅色 |
| --- | --- | --- |
| 工作台主界面 | `workbench-dark.png` | `workbench-light.png` |
| 两步添加 / 文件树 | `addlink-dark.png` | `addlink-light.png` |
| 设置 / 定时下载 | `settings-dark.png` | `settings-light.png` |

建议 1280×800（或任意 16:10 裁切）。每张图片分别检查，截图跟随网站主题；当前主题缺图时使用另一张，两张都缺失时隐藏该位置。

### 浏览器回归测试

生产网站仍无需构建。测试需要 Node.js 18+ 和 Playwright：

```bash
npm ci
npx playwright install chromium
npm test
```

也可以设置环境变量 `PLAYWRIGHT_CHANNEL=chrome`，使用已安装的 Chrome。测试模拟 GitHub 响应，覆盖缓存刷新、请求失败、分页、零计数、定时同步、语言和主题切换、工作台演示交互，以及浏览器 API 不可用的降级情况。设置 `LIVE_GITHUB=1` 可额外运行真实接口检查。布局截图保存在 `test-results/`。

### 仓库结构

| 文件 | 用途 |
| --- | --- |
| `index.html` | 纯标记（结构 + 文案） |
| `assets/css/style.css` | 全部样式（设计系统 / 组件 / 工作台演示 / 动效） |
| `assets/js/main.js` | 全部逻辑（双语 / 主题 / GitHub 同步 / Canvas 特效 / 仿真演示 / 工作台导览 / 截图探测） |
| `assets/img/` | 可选的 2.6 真机截图，命名见上表 |
| `og.png` | 1200×630 分享卡，供 `og:image` / `twitter:image` 引用 |
| `_headers` | 安全与缓存响应头（CSP 放行 Google Fonts 与 api.github.com，图片同源） |
| `robots.txt`、`sitemap.xml` | 爬虫提示 |

### 站点亮点

- 深/浅双主题（跟随系统 + 手动切换）、中英双语（浏览器检测 + 手动切换）
- GitHub 同步：Stars / 累计下载每 5 分钟检查，最新稳定版本与包信息缓存 6 小时，失败保留上次成功数据
- 2.6 工作台交互仿真：两步添加、文件树三态勾选、实时任务搜索、定时下载面板
- 冷启动对照：5–7 秒 → 0.15–0.2 秒，双条动画对比，首屏五个指标
- 纯 Canvas 特效：粒子网络 + 下载光束流星、3D 倾斜仿真下载窗口（吞吐曲线 / 配额倒计时）、解密式标题动画
- 截图位缺图自动隐藏；完整支持 `prefers-reduced-motion`；移动端常驻下载条；JSON-LD 结构化数据

### License

[MIT](LICENSE)
