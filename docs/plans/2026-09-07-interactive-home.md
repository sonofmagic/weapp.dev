# 首页代码与交互演示交付记录

实施分支：`codex/static-product-visuals`。首页案例截图已替换为样式、构建和组件演示。详情页素材、产品状态、路由、部署模型及依赖版本保持原有契约。

PR 分支：`codex/interactive-home-demos`。原 PR #6 已合并，本次从 main `fcb8290` 创建新分支，仅应用交互演示提交，保留 #7 的贡献者基金页面及相关更新。

## 最终实现

- Hero 标签与项目区复用独立的 Astro 演示组件；每个实例拥有自己的状态。无自动播放或模拟构建/AI 日志。
- Tailwind 预设由现有构建生成真实 CSS；代码与实际类名来自同一状态。
- weapp-vite 展示官方多平台模板的配置摘录、命令和输出目录，保留 experimental 标注。
- Varo 使用上游当前 `@varo-ui/cli add --target weapp` 命令，原生 HTML 组合标注为交互示意，产品仍标记规划中。
- 移动端先显示结果，再显示可滚动代码。控件区使用稳定高度，修复英文 320px 换行造成的约 2px 标签切换跳动。
- 移除首页截图组件、图片布局字段和旧入场动画残留；历史素材与显式采集命令保留。

来源版本、数据流和维护边界见 [首页架构说明](../architecture/homepage.md)。

## 最终验证结果

按 check、test、build、test:e2e 顺序完成最终回归：

| 命令                                                 | 实际结果                                       |
| ---------------------------------------------------- | ---------------------------------------------- |
| `rtk pnpm --filter @weapp.dev/web check`             | 76 个文件；0 errors、0 warnings、1 个既有 hint |
| `rtk pnpm --filter @weapp.dev/web test`              | 6 个测试文件，22 passed                        |
| `rtk pnpm --filter @weapp.dev/web build`             | 14 个页面；19 项必需产物及全部内部链接校验通过 |
| `rtk pnpm --filter @weapp.dev/web test:e2e`          | 70 passed、2 skipped，9.8 秒                   |
| `rtk pnpm --filter @weapp.dev/web lint`              | 通过                                           |
| `rtk pnpm --filter @weapp.dev/web lint:styles`       | 通过                                           |
| `rtk pnpm --filter @weapp.dev/web media:verify-home` | 28 组路由、视口与主题检查通过                  |

唯一类型提示为详情页既有的 `document.execCommand('copy')` 弃用提示。默认跳过的两项测试验证线上 Google Analytics 请求；本地 analytics 契约、隐私偏好和错误恢复均通过。新代码复制使用 Clipboard API，并测试成功与失败反馈。

E2E 覆盖双语交互、实际 CSS、输出文件映射、最少一个 Registry 组件、实例隔离、键盘、主题、无 JavaScript、reduced-motion、reveal 超时、无障碍和 320–1440px 响应式状态。首页未请求旧案例图片，详情页图片正常加载。

## 截图与预览

创建 PR 前在最新 main 基础上再次按相同顺序回归：check 检查 80 个文件，0 errors、0 warnings、1 个既有 hint；7 个测试文件、23 项单测通过；构建 16 个页面、21 项必需产物及全部内部链接通过；E2E 为 72 passed、2 skipped（11.5 秒）；根目录 `rtk pnpm lint` 同时通过 ESLint 和 Stylelint。新增基线的贡献者页面与中英文路由测试均通过。

预览：<http://127.0.0.1:4321/>，英文：<http://127.0.0.1:4321/en/>。

截图目录：`apps/web/.cache/demo-qa/`。`results.json` 记录 28 组检查，均无横向溢出、控件文字裁切、隐藏 reveal、canvas、持续动画或页面错误。人工复查包含桌面首页、移动端浅深主题、构建与组件状态、三个项目详情页和 Pricing。

- `home-zh-1440-light-comparison.png`：桌面前后对比，左旧右新。
- `home-en-390-dark-comparison.png`：移动端前后对比，左旧右新。
- `home-{zh,en}-{1440,390}-{light,dark}.png`：首页首屏。
- 对应 `-full.png`、`-projects.png`：全页和项目区域。
- 对应 `-{style,build,registry}-detail.png`：三个标签的操作后状态。

前版截图继续保存在 `apps/web/.cache/showcase-qa/`，重新运行视觉检查不会覆盖它们。
