import type { HomeProjectPlacement } from '../lib/home-projects'

export const homeProjectPlacements = [
  { id: 'weapp-tailwindcss', layout: 'phone', reversed: false, stage: { 'zh-CN': '样式', 'en': 'STYLE' } },
  { id: 'weapp-vite', layout: 'phone-pair', reversed: true, stage: { 'zh-CN': '构建', 'en': 'BUILD' } },
  { id: 'varo', layout: 'component', reversed: false, stage: { 'zh-CN': '组件', 'en': 'COMPOSE' } },
] satisfies HomeProjectPlacement[]
