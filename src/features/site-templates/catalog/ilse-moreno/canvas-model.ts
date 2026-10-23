export interface Point {
    x: number;
    y: number;
}
export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export const zoomSteps = [.5, .75, 1, 1.25, 1.5, 2] as const;
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
/** 小于视口时居中；大于视口时至少保留三分之一可见区域，拖拽不会丢失作品。 */
export function constrain(p: Point, zoom: number, width: number, height: number, b: Bounds): Point { const w = (b.right - b.left) * zoom, h = (b.bottom - b.top) * zoom; return { x: w <= width ? (width - w) / 2 - b.left * zoom : clamp(p.x, Math.min(width / 3, w) - b.right * zoom, width - Math.min(width / 3, w) - b.left * zoom), y: h <= height ? (height - h) / 2 - b.top * zoom : clamp(p.y, Math.min(height / 3, h) - b.bottom * zoom, height - Math.min(height / 3, h) - b.top * zoom) }; }
export function zoomAroundCenter(p: Point, from: number, to: number, width: number, height: number): Point { return { x: width / 2 - (width / 2 - p.x) * to / from, y: height / 2 - (height / 2 - p.y) * to / from }; }
export function languagePath(pathname: string, basePath: string, locale: 'zh' | 'en', search: string, hash: string) { const root = locale === 'en' ? basePath.replace(/\/en$/, '') : basePath; const slug = pathname.slice(basePath.length); return (root + (locale === 'zh' ? '/en' : '') + slug || '/') + search + hash; }
