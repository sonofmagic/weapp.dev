import type { CodePart } from './code'

export function sqliteCode(locale: 'zh-CN' | 'en'): CodePart[] {
  return [
    { text: locale === 'zh-CN' ? '-- 迁移草图：API 与运行时待确认' : '-- migration sketch: API and runtime are to be confirmed' },
    { text: 'CREATE TABLE notes (\n  id INTEGER PRIMARY KEY,\n  body TEXT NOT NULL\n);' },
    { text: locale === 'zh-CN' ? '-- 先验证数据模型，再决定接入方式' : '-- validate the data model before choosing an integration boundary' },
  ]
}
