# MegaDownloader-Revival-Web

**Language**: **English** · [中文](#中文)

## English

The official landing page for MegaDownloader Revival. No build step — plain static files, open `index.html` and you are done.

🌐 Live site: https://megadownloader-revival-web.a1175815821.workers.dev/ (hosted on [Cloudflare Workers](https://workers.cloudflare.com/), auto-deploys on push to main)

> ⭐ Like the project? Please Star the main repo: **[a1175815821/MegaDownloader-Revival](https://github.com/a1175815821/MegaDownloader-Revival)** — downloads and issues live there too; this repo hosts the site only.

### Main repo shortcuts

- 🏠 Main repo: https://github.com/a1175815821/MegaDownloader-Revival
- ⬇️ Download latest: https://github.com/a1175815821/MegaDownloader-Revival/releases/latest
- 🐞 Report issues: https://github.com/a1175815821/MegaDownloader-Revival/issues

### Local preview

```bash
# index.html is fully self-contained — open it directly in a browser
start index.html
```

Site data (version, changelog, download counts, stars) syncs at runtime from the main repo's GitHub API — no manual upkeep needed.

### Repo layout

| File | Purpose |
| --- | --- |
| `index.html` | the entire site — inline CSS + JS, no dependencies |
| `og.png` | 1200×630 share card used by the `og:image` / `twitter:image` tags |
| `_headers` | security and cache headers, applied by Cloudflare Workers Static Assets |
| `robots.txt`, `sitemap.xml` | crawler hints |

### License

[MIT](LICENSE)

## 中文

MegaDownloader Revival 的官网落地页。无构建，纯静态文件，双击 `index.html` 即看。

🌐 线上地址：https://megadownloader-revival-web.a1175815821.workers.dev/（[Cloudflare Workers](https://workers.cloudflare.com/) 托管，push 到 main 自动部署）

> ⭐ 觉得项目不错请 Star 主仓库：**[a1175815821/MegaDownloader-Revival](https://github.com/a1175815821/MegaDownloader-Revival)** —— 下载、提 Issue 也都在那边，本仓只放站点。

### 主仓库直达

- 🏠 主仓库：https://github.com/a1175815821/MegaDownloader-Revival
- ⬇️ 下载最新版：https://github.com/a1175815821/MegaDownloader-Revival/releases/latest
- 🐞 反馈 Issue：https://github.com/a1175815821/MegaDownloader-Revival/issues

### 本地预览

```bash
# index.html 自包含，直接用浏览器打开即可
start index.html
```

站点数据（版本号、更新日志、下载量、Stars）运行时从主仓库 GitHub API 实时同步，无需手动维护。

### 仓库结构

| 文件 | 用途 |
| --- | --- |
| `index.html` | 整站内容——CSS 与 JS 全部内联，无任何依赖 |
| `og.png` | 1200×630 分享卡，供 `og:image` / `twitter:image` 引用 |
| `_headers` | 安全与缓存响应头，由 Cloudflare Workers 静态资源应用 |
| `robots.txt`、`sitemap.xml` | 爬虫提示 |

### License

[MIT](LICENSE)
