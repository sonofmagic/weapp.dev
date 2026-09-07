# 首页真实案例素材

## 实现边界

首页新增 `visuals.showcase` 数组，Hero 和项目区域共享四张实际运行截图。详情页仍读取原来的 `primary`、`secondary`。桌面 Hero 并列展示零售首页、商品详情、AgentChat；720px 以下仅保留零售首页，项目区域逐张展示全部案例。图片保持原色、实际宽高比，无设备外壳或运行时演示依赖。

### 来源说明

- 零售案例：`weapp-vite/weapp-vite`，提交 `add5d6c7f31e74e9fa2290e43891548f2a00eccc`，目录 `apps/tdesign-miniprogram-starter-retail`。通过 weapp-vite 构建，在微信开发者工具中运行。
- Varo：`daguanren21/Varo`，提交 `0b50328b0861a8cfb754200812c37fb609705635`，文档 `/ai/agent-chat` 的实际 AgentChat 组件。保留已有中文示例、工具事件、确认区域和输入框。网站仍标记为规划中。
- 选型调整：现有 Vue/Tailwind 零售移植模板的规格弹层样式不完整，因此采用同仓库的 TDesign 原生参考案例。weapp-tailwindcss 区域的中英文 caption 明确写明来源和参考性质，不能将该图作为 Tailwind 移植版实现的证明。
- 原仓库的性能测试 fixture 替换了商品图片和价格，造成服装文案与其他商品照片不匹配。准备脚本仅在独立缓存副本中恢复原有 `allGoods` 数据；不修改源仓库或组件样式。
- 商品详情选用同一商品原有的第二张照片 `nz-09b.png`，其源文件质量优于第一张。首页缩略图仍保留模板原图，清晰度受源文件限制。

## 维护流程

正常 `build` 只使用已经提交的静态素材，不要求安装源仓库或微信开发者工具。重新截图是显式维护操作，需要两个源仓库安装好依赖、weapp-vite automator 已构建，以及已开启自动化接口的微信开发者工具。

在仓库根目录执行，环境变量替换为本机源仓库路径：

```bash
export WEAPP_VITE_SOURCE=/path/to/weapp-vite
export VARO_SOURCE=/path/to/varo
rtk pnpm --filter @weapp.dev/web media:prepare-showcase
rtk pnpm --dir apps/web/.cache/retail-capture build
rtk pnpm --filter @weapp.dev/web media:capture-showcase
rtk pnpm --filter @weapp.dev/web media:showcase
```

自动化默认端口为 9430，也可通过 `WEAPP_DEVTOOLS_WS` 连接已有会话。模拟器使用 390×844 逻辑视口。若视口变化，生成脚本会拒绝沿用裁切坐标，需要重新复核画面。准备副本的 `node_modules` 指向源案例已安装的依赖。

采集等待页面数据、商品图片请求与解码、组件内容和字体就绪。图片请求失败、页面报错或低信息量截图将使采集失败。仍须人工查看原始画面，自动检查无法证明所有视觉内容正确。Varo 只扩大文档外层的可见高度，截取组件本身；不修改其内部样式或翻译截图内容。

原始 PNG 和带 SHA-256 的采集记录存放在 `apps/web/media-source/showcase/`。生成脚本校验哈希，去掉模拟器导航、状态栏和底部外壳，并按内容单独裁切规格弹层。输出 390px、780px（不超过原图时）及原生宽度的 WebP/AVIF；不放大低分辨率源图。公开清单位于 `apps/web/public/media/showcase/sources.json`，记录源仓库、版本、页面、交互状态、视口、裁切坐标、输出尺寸和双语说明。

仅 Hero 第一张图片使用高加载优先级。其余图片懒加载，`sizes="auto, ..."` 优先按实际布局宽度选图，兼容不支持自动尺寸的浏览器回退值。英文和深色网站使用原应用的中文浅色画面，通过双语 alt/caption 和周围主题背景衔接。

## 验证与截图

按顺序运行：

```bash
rtk pnpm --filter @weapp.dev/web check
rtk pnpm --filter @weapp.dev/web test
rtk pnpm --filter @weapp.dev/web build
rtk pnpm --filter @weapp.dev/web test:e2e
rtk pnpm --filter @weapp.dev/web media:verify-showcase
```

最后一项使用本地预览 `http://127.0.0.1:4321`，可由 `SHOWCASE_BASE_URL` 覆盖。检查中英文首页、三个项目详情、双语 Pricing 的 1440×1000 和 390×844 浅深主题，共 28 组，并验证字体和图片成功解码、无横向溢出、控件裁断、隐藏 reveal、持续动画及页面错误。

截图和机器检查结果输出到 `apps/web/.cache/showcase-qa/`，包括首屏、全页和项目区域。若 `apps/web/.cache/visual-qa/` 中存在上版同名截图，同时输出 `*-comparison.png`：左侧为旧版，右侧为新版。截图属于本机验收产物，不参与网站构建。

### 2026-09-07 最终运行记录

```text
check: Result (49 files): 0 errors, 0 warnings, 1 hint
test: Test Files 4 passed (4); Tests 14 passed (14)
build: 14 page(s) built; Validated 19 required outputs and all internal links.
test:e2e: 2 skipped; 50 passed (8.8s)
media:verify-showcase: PASS: 28 route/viewport/theme combinations.
git diff --check: exit 0
```

类型检查唯一提示是详情页既有 `document.execCommand('copy')` 弃用提示。构建时 Varo 指标接口返回 404，按既有机制使用 fallback。两项默认跳过的测试是线上 Google Analytics 请求验证；本地 analytics 契约、隐私偏好、错误恢复和持久化测试已通过。

E2E 覆盖图片加载及比例、双语 alt/caption、项目链接、canonical、hreflang、键盘、导航、主题持久化、自动无障碍检查、320–1440px 响应式、reduced-motion、无 JavaScript 和 reveal 超时。原始零售及 AgentChat 截图、最终首屏和项目区域已人工复核；规格截图增加了按钮下方留白。三个项目的既有 JSON 内容与详情页素材经结构化比较保持一致。

本机验收入口：

- 预览：<http://127.0.0.1:4321/> 与 <http://127.0.0.1:4321/en/>
- 桌面对比（左旧右新）：`apps/web/.cache/showcase-qa/home-zh-1440-light-comparison.png`
- 手机对比（左旧右新）：`apps/web/.cache/showcase-qa/home-zh-390-light-comparison.png`
- 英文深色：`apps/web/.cache/showcase-qa/home-en-1440-dark.png`
- 完整机器检查记录：`apps/web/.cache/showcase-qa/results.json`
