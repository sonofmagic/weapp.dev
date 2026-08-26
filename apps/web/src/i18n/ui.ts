import type { Locale } from '../types/project'

export const siteCopy = {
  'zh-CN': {
    languageName: '中文',
    alternateLanguage: 'English',
    nav: {
      projects: '项目',
      about: '关于',
      principles: '原则',
      releases: '版本',
      github: 'GitHub',
      openMenu: '打开导航',
      theme: '切换主题',
    },
    hero: {
      eyebrow: '为真实小程序工程而建',
      title: 'weapp.dev',
      description: '从 Tailwind CSS 样式、Vite 构建到可编辑双端组件，用一套开放工具链交付小程序与 H5。',
      primary: '查看项目',
      secondary: '查看 GitHub',
      visualLabel: 'weapp.dev Build Lens 展示样式、构建、组件源码与多平台输出',
    },
    about: {
      eyebrow: '构建链路',
      title: '保留你的写法，升级交付链路',
      description: '工具分别接管样式转换、工程构建与组件源码，让现有小程序可以渐进接入，也让 H5 与新项目共享现代开发体验。',
      items: [
        { title: '编写', body: '继续使用原生小程序、Vue SFC 或跨端框架，保留团队熟悉的页面与组件边界。' },
        { title: '构建', body: '让 weapp-tailwindcss 处理样式与类名，让 weapp-vite 处理依赖、路由和多平台构建生命周期。' },
        { title: '组装', body: '从 Varo Registry 安装可编辑的双端组件、业务 Blocks 与 Agent UI，并在真实运行时中验证交付。' },
      ],
    },
    projects: {
      eyebrow: '工具栈',
      title: '三个项目，三层清晰边界',
      description: '按需独立采用，也可以组合成从样式、构建到 H5 与小程序组件源码的完整工程。',
      documentation: '阅读文档',
      details: '项目详情',
      weeklyDownloads: '周下载',
      stars: 'Stars',
      status: {
        stable: '稳定版',
        beta: '测试版',
        planned: '规划中',
      },
    },
    principles: {
      eyebrow: '设计原则',
      title: '工程约束比演示效果更重要',
      description: '工具保持独立，边界保持清楚，平台差异在可验证的构建与运行阶段解决。',
      items: [
        { title: '多平台是构建目标', body: '每次显式选择一个目标平台，避免用模糊兼容掩盖真实差异。' },
        { title: '渐进接入', body: '先稳定构建链路，再按页面引入新写法，不要求一次性重写业务。' },
        { title: '结果可验证', body: '源码、发布记录、运行日志与截图链路公开，构建结果可以复现。' },
      ],
    },
    releases: {
      eyebrow: '最新版本',
      title: '持续发布，稳定演进',
      description: '版本信息在构建时从 npm 获取，并保留可靠的离线快照。',
      released: '发布于',
      viewPackage: '查看 npm',
    },
    maintainer: {
      eyebrow: '维护者',
      title: '由 sonofmagic 发起并持续维护',
      description: 'weapp.dev 汇集面向小程序开发的开源项目、文档与实践。',
      action: '访问 GitHub',
    },
    project: {
      back: '返回工具栈',
      docs: '阅读文档',
      source: '查看源码',
      capabilities: '核心能力',
      platforms: '支持平台',
      metrics: '项目数据',
      version: '当前版本',
      downloads: '周下载',
      stars: 'GitHub Stars',
      futureDocs: '未来文档路径',
      futureDocsNote: '聚合文档上线后，此路径将成为 canonical 地址。',
      audience: '适合谁',
      useCases: '常见用法',
      install: '安装',
      copyInstall: '复制安装命令',
      copied: '已复制',
      visualProof: '真实运行结果',
      visualProofDescription: '以下截图来自项目官方仓库中的 demo 或回归基线，并在本站本地化保存。',
      faq: '常见问题',
      npm: '查看 npm',
    },
    footer: {
      description: '面向小程序开发的开源工具栈。',
      projects: '项目',
      resources: '资源',
      docs: '文档',
      source: '源码',
      releases: '版本订阅',
      privacy: '隐私说明',
      analyticsPreferences: '统计偏好',
      copyright: 'weapp.dev，以 MIT License 开放。',
    },
    analytics: {
      dialogTitle: '统计偏好',
      dialogBody: 'Cloudflare 无 Cookie 基础统计始终启用。百度统计和 Google Analytics 默认用于了解访问与关键交互，你可以随时关闭。',
      enabled: '允许百度统计和 Google Analytics',
      privacySignal: '浏览器已启用全局隐私控制或“请勿跟踪”，第三方统计保持关闭。',
      save: '保存偏好',
      close: '关闭',
    },
    privacy: {
      eyebrow: '数据与隐私',
      title: '隐私说明',
      description: 'weapp.dev 仅收集维护开源站点所需的最少访问与性能数据。',
      updated: '更新日期：2026 年 8 月 26 日',
      contents: '本页目录',
      dataFlow: '数据流',
      dataFlowItems: ['访问站点', '基础性能统计', '可选第三方统计'],
      preferences: '打开统计偏好',
      sections: [
        {
          title: '收集哪些数据',
          body: '我们统计页面浏览、来源、国家或地区、设备类别、浏览器、Core Web Vitals，以及项目、文档、GitHub、npm、语言和主题等有限交互。我们不采集姓名、邮箱、输入内容、完整外链地址或用户身份。',
        },
        {
          title: '使用哪些服务',
          body: 'Cloudflare Web Analytics 提供无 Cookie 的基础流量和性能统计。正式站点会同时使用百度统计和 Google Analytics 4；预览域名和本地开发不会加载这两个第三方平台。',
        },
        {
          title: '如何控制统计',
          body: '你可以通过页脚的“统计偏好”随时允许或关闭第三方统计。选择保存在浏览器 localStorage 中。我们尊重 Global Privacy Control 和 Do Not Track，并在检测到这些信号时关闭第三方统计。',
        },
        {
          title: '数据用途与保留',
          body: '数据仅用于理解访问趋势、改善页面性能和评估开源项目内容。数据由对应平台按各自保留策略处理，我们不会出售这些数据，也不会用于广告个性化或跨站追踪。',
        },
      ],
    },
    notFound: {
      title: '页面不存在',
      description: '构建路径有效，但这里没有可发布的页面。返回首页继续浏览工具栈。',
      action: '返回首页',
      code: 'ROUTE_NOT_EMITTED',
    },
  },
  'en': {
    languageName: 'English',
    alternateLanguage: '中文',
    nav: {
      projects: 'Projects',
      about: 'About',
      principles: 'Principles',
      releases: 'Releases',
      github: 'GitHub',
      openMenu: 'Open navigation',
      theme: 'Change theme',
    },
    hero: {
      eyebrow: 'Built for real mini-app projects',
      title: 'weapp.dev',
      description: 'Ship mini-app and H5 products with open tooling for Tailwind CSS styling, Vite-powered builds, and editable cross-runtime components.',
      primary: 'View projects',
      secondary: 'View on GitHub',
      visualLabel: 'The weapp.dev Build Lens covers styling, builds, editable components, and multi-platform output',
    },
    about: {
      eyebrow: 'Build path',
      title: 'Keep your syntax. Upgrade delivery.',
      description: 'Separate tools own style transforms, project builds, and component source, so existing mini-apps can migrate gradually while H5 and new products share modern DX.',
      items: [
        { title: 'Author', body: 'Keep native mini-app syntax, Vue SFC, or a cross-platform framework with the page boundaries your team already knows.' },
        { title: 'Build', body: 'Let weapp-tailwindcss own styles and classes while weapp-vite owns dependencies, routes, and multi-platform build lifecycles.' },
        { title: 'Compose', body: 'Install editable dual-target components, business blocks, and Agent UI from the Varo registry, then verify delivery in the real runtime.' },
      ],
    },
    projects: {
      eyebrow: 'The stack',
      title: 'Three projects. Three clear boundaries.',
      description: 'Adopt each independently or combine styling, builds, and editable H5 / mini-program component source.',
      documentation: 'Read the docs',
      details: 'Project details',
      weeklyDownloads: 'Weekly downloads',
      stars: 'Stars',
      status: {
        stable: 'Stable',
        beta: 'Beta',
        planned: 'Planned',
      },
    },
    principles: {
      eyebrow: 'Principles',
      title: 'Engineering constraints over demos',
      description: 'Tools stay independent, boundaries stay explicit, and platform differences are resolved through verifiable builds and runtime checks.',
      items: [
        { title: 'Platforms are build targets', body: 'Select one target for each build instead of hiding real differences behind vague compatibility.' },
        { title: 'Migrate progressively', body: 'Stabilize the build chain first, then adopt new syntax page by page without rewriting the product.' },
        { title: 'Verify the result', body: 'Source, releases, runtime logs, and screenshot workflows stay public and reproducible.' },
      ],
    },
    releases: {
      eyebrow: 'Latest releases',
      title: 'Ship steadily, evolve carefully',
      description: 'Release data is fetched from npm at build time with a reliable offline snapshot.',
      released: 'Released',
      viewPackage: 'View on npm',
    },
    maintainer: {
      eyebrow: 'Maintainer',
      title: 'Initiated and maintained by sonofmagic',
      description: 'weapp.dev brings together open-source projects, documentation, and practices for mini-app development.',
      action: 'Visit GitHub',
    },
    project: {
      back: 'Back to the stack',
      docs: 'Read the docs',
      source: 'View source',
      capabilities: 'Core capabilities',
      platforms: 'Platforms',
      metrics: 'Project metrics',
      version: 'Current version',
      downloads: 'Weekly downloads',
      stars: 'GitHub Stars',
      futureDocs: 'Future documentation path',
      futureDocsNote: 'This path will become canonical when aggregated documentation launches.',
      audience: 'Who it is for',
      useCases: 'Common use cases',
      install: 'Install',
      copyInstall: 'Copy install command',
      copied: 'Copied',
      visualProof: 'Real runtime output',
      visualProofDescription: 'These images come from official project demos or regression baselines and are stored locally on this site.',
      faq: 'Frequently asked questions',
      npm: 'View on npm',
    },
    footer: {
      description: 'The open-source tool stack for mini-app development.',
      projects: 'Projects',
      resources: 'Resources',
      docs: 'Documentation',
      source: 'Source',
      releases: 'Release feed',
      privacy: 'Privacy notice',
      analyticsPreferences: 'Analytics preferences',
      copyright: 'weapp.dev, open under the MIT License.',
    },
    analytics: {
      dialogTitle: 'Analytics preferences',
      dialogBody: 'Cookie-free Cloudflare baseline analytics always remains active. Baidu Analytics and Google Analytics are enabled by default on the production site, and you can turn them off at any time.',
      enabled: 'Allow Baidu Analytics and Google Analytics',
      privacySignal: 'Your browser has enabled Global Privacy Control or Do Not Track, so third-party analytics remains off.',
      save: 'Save preference',
      close: 'Close',
    },
    privacy: {
      eyebrow: 'Data and privacy',
      title: 'Privacy notice',
      description: 'weapp.dev collects only the visit and performance data needed to maintain this open-source site.',
      updated: 'Updated August 26, 2026',
      contents: 'On this page',
      dataFlow: 'Data flow',
      dataFlowItems: ['Visit the site', 'Baseline performance analytics', 'Optional third-party analytics'],
      preferences: 'Open analytics preferences',
      sections: [
        {
          title: 'What we collect',
          body: 'We measure page views, referrers, country or region, device category, browser, Core Web Vitals, and limited interactions with projects, documentation, GitHub, npm, language, and theme controls. We do not collect names, email addresses, input content, complete outbound URLs, or user identities.',
        },
        {
          title: 'Services we use',
          body: 'Cloudflare Web Analytics provides cookie-free baseline traffic and performance metrics. The production site uses both Baidu Analytics and Google Analytics 4; preview domains and local development do not load either third-party platform.',
        },
        {
          title: 'Your controls',
          body: 'Use “Analytics preferences” in the footer to allow or disable third-party analytics at any time. Your choice is stored in localStorage. We honor Global Privacy Control and Do Not Track by keeping third-party analytics off.',
        },
        {
          title: 'Purpose and retention',
          body: 'We use the data only to understand traffic trends, improve page performance, and evaluate open-source project content. Each provider processes data under its retention policy. We do not sell this data or use it for personalized advertising or cross-site tracking.',
        },
      ],
    },
    notFound: {
      title: 'Page not found',
      description: 'The build path is valid, but no page was emitted here. Return home to explore the stack.',
      action: 'Return home',
      code: 'ROUTE_NOT_EMITTED',
    },
  },
} as const

export function localizePath(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') {
    return normalized === '/' ? '/en/' : `/en${normalized}`
  }
  return normalized
}

export function projectPath(locale: Locale, slug: string): string {
  return localizePath(locale, `/projects/${slug}/`)
}

export function alternatePath(locale: Locale, currentPath: string): string {
  if (locale === 'en') {
    return currentPath.replace(/^\/en(?=\/|$)/, '') || '/'
  }
  return currentPath === '/' ? '/en/' : `/en${currentPath}`
}
