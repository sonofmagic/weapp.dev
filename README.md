# weapp.dev

[weapp.dev](https://weapp.dev) 是面向小程序开发的开源工具聚合门户。目前收录 [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 和 [weapp-vite](https://github.com/weapp-vite/weapp-vite)，中文为默认语言，英文内容位于 `/en/`。

站点使用 Astro 6 和 TypeScript 生成完全静态的 HTML，由 Cloudflare Workers Static Assets 发布。页面和资源采用 assets-only 部署，直接由 Cloudflare Static Assets 返回，不经过用户 Worker。

## 开发

环境要求：

- Node.js 22.12.0 或更高版本，本仓库使用 22.23.2
- pnpm 10.33.4

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

常用命令：

```bash
pnpm check                                      # Lint、Astro、TypeScript 和单元测试
pnpm build                                      # 拉取指标、构建并检查静态产物
pnpm --filter @weapp.dev/web test:e2e           # Playwright 桌面端与移动端测试
pnpm --filter @weapp.dev/web deploy:dry-run     # Wrangler 部署预检
pnpm repo:doctor                                # repoctl 工作区诊断
pnpm repo:check                                 # repoctl 提交前检查
```

## 项目数据

项目定义位于 `apps/web/src/content/projects/`，并由 Astro Content Collection 校验。新增项目时：

1. 增加一份以项目 slug 命名的 JSON 定义。
2. 将品牌资源放入 `apps/web/public/brands/`。
3. 运行 `pnpm --filter @weapp.dev/web metrics:update-fallback` 提交最新的指标快照。

首页、导航、项目详情、RSS 与指标抓取都会自动发现新定义，无需修改组件。GitHub 与 npm 指标只在构建时请求；请求失败或响应无效时使用 `apps/web/src/data/project-metrics.fallback.json`，不会因为外部 API 不可用而中断构建。

现有文档继续发布在 `tw.icebreaker.top` 和 `vite.icebreaker.top`。未来聚合文档使用 `/docs/<project>/`，旧站继续可访问，并将 canonical 统一指向对应的 `weapp.dev` 路径。

## Cloudflare Workers Builds

在 Cloudflare Workers 中连接 `sonofmagic/weapp.dev` 后使用以下配置：

| 设置                          | 值                                                                     |
| ----------------------------- | ---------------------------------------------------------------------- |
| Production branch             | `main`                                                                 |
| Root directory                | 仓库根目录，留空                                                       |
| Build command                 | `pnpm install --frozen-lockfile && pnpm --filter @weapp.dev/web build` |
| Deploy command                | `pnpm --filter @weapp.dev/web exec wrangler deploy`                    |
| Non-production deploy command | `pnpm --filter @weapp.dev/web exec wrangler versions upload`           |
| Build variable                | `PNPM_VERSION=10.33.4`                                                 |
| Build secret                  | 只读 `GITHUB_TOKEN`                                                    |

启用非生产分支构建后，其他分支会获得 Workers 预览版本。首次生产部署会按 `apps/web/wrangler.jsonc` 绑定 `weapp.dev` 与 `www.weapp.dev`；Cloudflare 会创建所需 DNS 记录和证书，因此这一步必须在域名所在的 Cloudflare zone 中执行。

`apps/web/wrangler.jsonc` 只配置静态 Assets 和两个自定义域名，不包含 Worker 入口或 `run_worker_first`。`www.weapp.dev` 的 308 跳转在 Cloudflare Redirect Rules 中配置，条件为 `http.host eq "www.weapp.dev"`，目标为 `https://weapp.dev` 加原始路径，保留查询参数。

## 访问统计

生产站点使用三层统计，并且不会在预览域名或本地开发环境加载第三方脚本：

- Cloudflare Web Analytics 提供无 Cookie 的基础流量与 Core Web Vitals。
- 正式域名访问同时加载百度统计和 Google Analytics 4；预览域名和本地开发不会加载生产统计。
- 首次访问不显示同意横幅，页脚的统计偏好入口可以随时关闭或重新开启两个平台。
- 浏览器启用 Global Privacy Control 或 Do Not Track 时不会加载百度统计或 GA4。

百度统计 ID 和 GA4 Measurement ID 是公开标识，直接由前端统计加载器使用，不作为 Secret，也不通过 Worker API 返回。

事件字典固定为 `select_project`、`click_outbound`、`switch_language`、`change_theme` 和 `navigate_section`。事件参数只允许项目 slug、目标类型、语言、主题或站内区块；页面 URL 仅保留 UTM 参数。统计运维分别在 Cloudflare Web Analytics、百度统计和 Google Analytics 中完成，搜索表现分别在百度搜索资源平台与 Google Search Console 中查看。

## SEO 与 GEO

站点为中文默认、英文 `/en/` 的静态双语站点。每个公开页面都会生成规范 canonical、双向 hreflang、Open Graph/Twitter 分享元数据和 JSON-LD；项目页的实体信息以仓库、文档和 npm 官方链接为准。404 页面使用 `noindex, follow`，不会进入 sitemap。

面向生成式搜索的可引用入口为 [`/llms.txt`](https://weapp.dev/llms.txt) 和 [`/llms-full.txt`](https://weapp.dev/llms-full.txt)。维护项目内容时应同步更新中英文的一句话定义、适用对象、用例、安装命令和问答，避免只增加关键词而没有可验证事实。

发布前运行 `pnpm build`，它会校验 title、description、canonical、hreflang、robots、JSON-LD、sitemap 和 LLM 资源。发布后在 Google Search Console、百度搜索资源平台、Rich Results Test 和 Schema Markup Validator 中检查收录与结构化数据；生成式搜索的引用效果按真实查询和来源链接持续观察，不以单一工具分数作为上线标准。

## License

[MIT](LICENSE) © 2026 sonofmagic
