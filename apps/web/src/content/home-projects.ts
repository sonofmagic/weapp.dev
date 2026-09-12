import type { HomeProjectPlacement } from '../lib/home-projects'

export const homeProjectPlacements = [
  { id: 'weapp-vite', demo: 'build', reversed: false, stage: { 'zh-CN': '工程', 'en': 'BUILD' } },
  { id: 'weapp-tailwindcss', demo: 'style', reversed: true, stage: { 'zh-CN': '样式', 'en': 'STYLE' } },
  { id: 'varo', demo: 'registry', reversed: false, stage: { 'zh-CN': '组件', 'en': 'COMPOSE' } },
  { id: 'weapp-sqlite', demo: 'sqlite', reversed: true, stage: { 'zh-CN': '数据', 'en': 'DATA' } },
  { id: 'vite-plugin-taro', demo: 'migration', reversed: false, stage: { 'zh-CN': '迁移', 'en': 'MIGRATE' } },
] satisfies HomeProjectPlacement[]
