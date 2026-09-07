import type { HomeProjectPlacement } from '../../lib/home-projects'

// Keep fallback sizes beside the home layout; lazy images use their rendered size first.
export const showcaseSizes: Record<HomeProjectPlacement['layout'], string> = {
  'phone': '(max-width: 720px) min(340px, calc(100vw - 32px)), 340px',
  'phone-pair': '(max-width: 720px) min(340px, calc(100vw - 32px)), (max-width: 900px) calc((100vw - 80px) * 0.225 - 8px), min(258.4px, calc((100vw - 104px) * 0.225 - 8px))',
  'component': '(max-width: 720px) calc(100vw - 32px), (max-width: 900px) calc((100vw - 80px) * 0.55), min(651.2px, calc((100vw - 104px) * 0.55))',
}
