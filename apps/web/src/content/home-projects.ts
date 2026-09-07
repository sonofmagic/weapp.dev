import type { HomeProjectPlacement } from '../lib/home-projects'

export const homeProjectPlacements = [
  { id: 'weapp-tailwindcss', demo: 'style', reversed: false, stage: { 'zh-CN': '样式', 'en': 'STYLE' } },
  { id: 'weapp-vite', demo: 'build', reversed: true, stage: { 'zh-CN': '构建', 'en': 'BUILD' } },
  { id: 'varo', demo: 'registry', reversed: false, stage: { 'zh-CN': '组件', 'en': 'COMPOSE' } },
] satisfies HomeProjectPlacement[]
