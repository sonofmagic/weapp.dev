# weapp.dev

[weapp.dev](https://weapp.dev) 是面向小程序开发的开源工具聚合门户。目前收录 [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 和 [weapp-vite](https://github.com/weapp-vite/weapp-vite)，中文为默认语言，英文内容位于 `/en/`。

站点使用 Astro 6 和 TypeScript 生成完全静态的 HTML，由 Cloudflare Workers Static Assets 发布。静态页面和资源直接由 Asset Worker 返回，用户 Worker 只处理 `/api/analytics/config` 统计配置接口。

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

`apps/web/wrangler.jsonc` 的 `assets.run_worker_first` 只匹配 `/api/analytics/config`，并通过 `!/*` 将其他请求交给 Asset Worker。`www.weapp.dev` 的 308 跳转应在 Cloudflare Redirect Rules 中配置，条件为 `http.host eq "www.weapp.dev"`，目标为 `https://weapp.dev` 加原始路径，保留查询参数。

## 访问统计

生产站点使用三层统计，并且不会在预览域名或本地开发环境加载第三方脚本：

- Cloudflare Web Analytics 提供无 Cookie 的基础流量与 Core Web Vitals。
- 中国大陆访客使用百度统计，其他地区使用 Google Analytics 4。
- 欧盟、英国、瑞士和地区未知的访客须先同意；其他访客可通过页脚的统计偏好随时退出。
- 浏览器启用 Global Privacy Control 或 Do Not Track 时不会加载百度统计或 GA4。

公开的 `BAIDU_TONGJI_ID` 与 `GA4_MEASUREMENT_ID` 配置在 `apps/web/wrangler.jsonc`。Worker 的 `/api/analytics/config` 根据 Cloudflare 国家码只返回所需平台和是否需要同意，不返回国家码或 IP。

事件字典固定为 `select_project`、`click_outbound`、`switch_language`、`change_theme` 和 `navigate_section`。事件参数只允许项目 slug、目标类型、语言、主题或站内区块；页面 URL 仅保留 UTM 参数。统计运维分别在 Cloudflare Web Analytics、百度统计和 Google Analytics 中完成，搜索表现分别在百度搜索资源平台与 Google Search Console 中查看。

## License

[MIT](LICENSE) © 2026 sonofmagic
