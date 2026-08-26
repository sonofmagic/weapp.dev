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
      eyebrow: '小程序开源工具栈',
      title: 'weapp.dev',
      description: '为小程序开发提供可组合的样式与工程化工具。',
      primary: '浏览工具',
      secondary: '查看 GitHub',
      visualLabel: 'weapp.dev 工具栈包含 weapp-tailwindcss 与 weapp-vite',
    },
    about: {
      eyebrow: '关于工具栈',
      title: '面向小程序开发的开源基础设施',
      description: 'weapp.dev 汇集可独立使用、也能组合使用的样式与工程化工具，帮助团队从界面样式走向可靠构建。',
      items: [
        { title: '它是什么', body: '一个面向小程序和跨端项目的开源工具入口，提供官方项目、文档、源码和发布信息。' },
        { title: '适合谁', body: '适合需要多平台小程序开发、Tailwind CSS 工作流或 Vite 工程化体验的前端团队。' },
        { title: '项目如何配合', body: 'weapp-tailwindcss 负责样式工作流，weapp-vite 负责开发和构建基础设施，两者可以独立采用或组合使用。' },
      ],
    },
    projects: {
      eyebrow: '工具栈',
      title: '从样式到构建，一套清晰的开发路径',
      description: '每个项目独立使用，也能组合成完整的小程序工程。',
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
      title: '为真实的小程序工程而建',
      description: '工具保持独立，约定保持一致，平台差异在构建阶段解决。',
      items: [
        { title: '多平台优先', body: '同一套开发体验覆盖主流小程序平台与跨端框架。' },
        { title: '与现有技术栈组合', body: '按需采用，不绑定单一 UI、运行时或部署平台。' },
        { title: '开放且可验证', body: '源码、发布记录和工程决策保持公开，构建结果可以复现。' },
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
      description: '这个地址还没有内容，返回首页继续浏览工具栈。',
      action: '返回首页',
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
      eyebrow: 'Open-source mini-app stack',
      title: 'weapp.dev',
      description: 'Composable styling and build tools for mini-app development.',
      primary: 'Explore the tools',
      secondary: 'View on GitHub',
      visualLabel: 'The weapp.dev stack includes weapp-tailwindcss and weapp-vite',
    },
    about: {
      eyebrow: 'About the stack',
      title: 'Open infrastructure for mini-app development',
      description: 'weapp.dev brings together independent but composable styling and engineering tools, helping teams move from UI work to reliable builds.',
      items: [
        { title: 'What it is', body: 'An open-source entry point for mini-app and cross-platform projects, with official projects, docs, source, and release data.' },
        { title: 'Who it is for', body: 'Frontend teams that need multi-platform mini-app development, a Tailwind CSS workflow, or a modern Vite toolchain.' },
        { title: 'How the projects fit', body: 'weapp-tailwindcss handles styling workflows while weapp-vite provides development and build infrastructure. Use either project independently or combine them.' },
      ],
    },
    projects: {
      eyebrow: 'The stack',
      title: 'A clear path from styling to builds',
      description: 'Use each project independently or combine them into a complete mini-app workflow.',
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
      title: 'Built for real mini-app projects',
      description: 'Tools stay independent, conventions stay consistent, and platform differences are handled at build time.',
      items: [
        { title: 'Multi-platform first', body: 'One developer experience across major mini-app platforms and cross-platform frameworks.' },
        { title: 'Composable by default', body: 'Adopt only what you need without locking into a UI library, runtime, or host.' },
        { title: 'Open and verifiable', body: 'Source, releases, and engineering decisions stay public, with reproducible builds.' },
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
      description: 'There is no content at this address yet. Return home to explore the stack.',
      action: 'Return home',
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
