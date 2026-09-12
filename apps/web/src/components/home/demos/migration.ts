import type { CodePart } from './code'

export function migrationCode(locale: 'zh-CN' | 'en'): CodePart[] {
  return [
    { text: 'vite.config.ts' },
    { text: `taro({\n  framework: 'react',\n  target: 'wechat',\n})` },
    { text: locale === 'zh-CN' ? '// 保留 Taro / React 写法，替换开发构建链路' : '// keep Taro / React code, change the dev and build pipeline' },
  ]
}
