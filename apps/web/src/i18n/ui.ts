import type { Locale } from '../types/project'

export const siteCopy = {
  'zh-CN': {
    languageName: '中文',
    alternateLanguage: 'English',
    nav: {
      projects: '项目',
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
    },
    footer: {
      description: '面向小程序开发的开源工具栈。',
      projects: '项目',
      resources: '资源',
      docs: '文档',
      source: '源码',
      releases: '版本订阅',
      copyright: 'weapp.dev，以 MIT License 开放。',
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
    },
    footer: {
      description: 'The open-source tool stack for mini-app development.',
      projects: 'Projects',
      resources: 'Resources',
      docs: 'Documentation',
      source: 'Source',
      releases: 'Release feed',
      copyright: 'weapp.dev, open under the MIT License.',
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
