# MegaDownloader-Revival-Web

**Language**: **English** · [中文](#中文)

## English

The official landing page for MegaDownloader Revival — full visual redesign (V2). Static files, no build step.

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

Site data (version, download counts, stars) syncs at runtime from the main repo's GitHub API — no manual upkeep needed.

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
- Live GitHub sync: stars / total downloads / latest version (6h cache, graceful fallback)
- Pure-canvas FX: particle network with download beams, live demo download window (3D tilt, throughput graph, quota countdown), decrypt-style headline
- `prefers-reduced-motion` fully respected; mobile sticky download bar; JSON-LD structured data

### License

[MIT](LICENSE)

## 中文

MegaDownloader Revival 的官网落地页 —— V2 全面视觉重制版。纯静态文件，无构建步骤。

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

站点数据（版本号、下载量、Stars）运行时从主仓库 GitHub API 实时同步，无需手动维护。

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
- GitHub 实时同步：Stars / 累计下载 / 最新版本号（6h 缓存 + 失败降级）
- 纯 Canvas 特效：粒子网络 + 下载光束流星、3D 倾斜仿真下载窗口（吞吐曲线 / 配额倒计时）、解密式标题动画
- 完整支持 `prefers-reduced-motion`；移动端常驻下载条；JSON-LD 结构化数据

### License

[MIT](LICENSE)
