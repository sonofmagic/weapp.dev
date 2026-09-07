# weapp.dev 静态视觉验收

日期：2026-09-07。本次记录以用户提供的 `weapp.dev-homepage-gpt6-prompt.md` 和确认后的实施方案为准，替代旧验收记录中关于持续漂浮、反色 Hero 和动态视觉的要求。

## 实施结果

- Hero 使用现有 Build Lens WebP/AVIF，实际尺寸 1600×1100；图片直接显示，不等待 reveal，设置高加载优先级。
- 三个项目行直接使用 content JSON 的 primary 图片、原始尺寸及双语 alt/caption，保留文档、详情和统计属性。
- 删除 shader 组件、实现、脚本、单测、假产品界面和相关样式。源码及静态产物扫描均无 shader 或假界面残留。
- 删除首页重复编号、后续章节 eyebrow、彩色大阴影及重复响应式规则；保留项目入口编号和逐项目布局。
- 仅在允许动态效果时进行最多 1.5% 的项目图片缩放。reduced-motion 下无动画、缩放、延迟或隐藏内容；无 JavaScript 和 reveal 超时显示均通过测试。
- 截图验收发现 Pricing 原有反色区域的文字对比度低至约 1.5:1，已修正为当前主题的配色，并调整标题字号和行高。文案、页面结构及商业入口保持原有契约。
- Playwright 改用 Astro preview API 启动前台测试服务，避免 Astro CLI 在代理环境自动后台化造成冷启动失败；已验证冷启动。部署配置未变。
- 项目 JSON、字体、依赖、logo、产品素材、OG 设计与路由逻辑未修改，Varo 继续保持 planned。

## 命令输出摘要

以下四项按顺序执行，退出码均为 0：

```text
$ rtk pnpm --filter @weapp.dev/web check
Result (44 files):
- 0 errors
- 0 warnings
- 1 hint

$ rtk pnpm --filter @weapp.dev/web test
Test Files  4 passed (4)
Tests       14 passed (14)

$ rtk pnpm --filter @weapp.dev/web build
[build] output: "static"
[build] 14 page(s) built in 1.65s
[build] Complete!
Validated 19 required outputs and all internal links.

$ rtk pnpm --filter @weapp.dev/web test:e2e
Running 52 tests using 8 workers
2 skipped
50 passed (9.3s)
```

`check` 的提示来自详情页既有的 `document.execCommand('copy')` 兼容路径。两项跳过用例是默认关闭的真实 Google Analytics 协议测试；统计行为的模拟网络测试均已通过。

最后一次构建中，Varo 指标请求返回 404，weapp-vite 指标请求超时；两者均按现有机制使用提交的离线快照。构建未修改指标快照文件。

样式 lint、修改过的 TypeScript 文件 ESLint 及 `git diff --check` 均通过。

## 浏览器验收

- 28 组页面、视口与主题组合：`/`、`/en/`、三个中文项目详情、`/pricing/`、`/en/pricing/`，分别使用 1440×1000、390×844 及 light/dark。
- 全部组合均无横向溢出、控件裁切、损坏图片、canvas、隐藏 reveal、reduced-motion 动画或页面脚本异常。
- 检查首屏、整页截图和项目区域图片，文字、按钮与图片布局可读；Pricing 标题行距已复查。
- Axe 覆盖中英首页和 Pricing 的浅深主题，并在桌面与移动测试项目中通过，零违规。
- 原有 320、390、768、1024、1440px 首页响应式、键盘导航、主题持久化、移动导航、复制命令、FAQ、SEO 和 analytics 测试均通过。

截图和机器检查结果位于本地缓存目录 `apps/web/.cache/visual-qa/`，不作为站点产品素材发布：

- [中文首页桌面浅色](../../apps/web/.cache/visual-qa/home-zh-1440-light.png)
- [英文首页手机深色](../../apps/web/.cache/visual-qa/home-en-390-dark.png)
- [真实项目截图区域](../../apps/web/.cache/visual-qa/home-en-1440-light-projects.png)
- [Pricing 桌面浅色](../../apps/web/.cache/visual-qa/pricing-1440-light.png)
- [桌面截图总览](../../apps/web/.cache/visual-qa/contact-1440.png)
- [手机截图总览](../../apps/web/.cache/visual-qa/contact-390.png)
- [28 组检查数据](../../apps/web/.cache/visual-qa/results.json)

本地预览：[http://127.0.0.1:4321/](http://127.0.0.1:4321/)。
