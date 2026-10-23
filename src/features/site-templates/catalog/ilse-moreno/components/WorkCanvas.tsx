'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, type PointerEvent, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { projects, text, type Locale } from '../content/data';
import { constrain, zoomAroundCenter, zoomSteps, clamp, type Point } from '../canvas-model';
import { Modal, Praise } from './Shared';

const referencePositions = [{ x: 64, y: 104, w: 560, h: 350 }, { x: 720, y: 64, w: 420, h: 263 }, { x: 1236, y: 136, w: 480, h: 300 }, { x: 64, y: 576, w: 400, h: 250 }, { x: 560, y: 536, w: 520, h: 325 }, { x: 1176, y: 608, w: 440, h: 275 }];
// 预设坐标还原参考作品的比例；新增作品继续排布，空集合也有有效边界。
const positions = projects.map((_, index) => referencePositions[index] ?? {x:64+index%3*536,y:1400+Math.floor((index-6)/3)*420,w:440,h:275});
const bounds={left:Math.min(64,...positions.map(p=>p.x)),top:Math.min(64,...positions.map(p=>p.y)),right:Math.max(1,...positions.map(p=>p.x+p.w)),bottom:Math.max(1,...positions.map(p=>p.y+p.h+26))};
type Travel = 'intro' | 'fly' | 'glide' | 'none';
interface Drag {
    sx: number;
    sy: number;
    px: number;
    py: number;
    lx: number;
    ly: number;
    at: number;
    vx: number;
    vy: number;
    moved: boolean;
    target: EventTarget;
}
export default function WorkCanvas({ locale, basePath }: {
    locale: Locale;
    basePath: string;
}) {
    const router = useRouter(), reduced = useReducedMotion(), stage = useRef<HTMLDivElement>(null), container = useRef<HTMLDivElement>(null), drag = useRef<Drag | null>(null), [width, setWidth] = useState(1248), [mode, setMode] = useState<'canvas' | 'list'>('canvas'), [zoom, setZoom] = useState(1), [point, setPoint] = useState<Point>({ x: 0, y: 0 }), [travel, setTravel] = useState<Travel>('intro'), [active, setActive] = useState(-1), [praise, setPraise] = useState(-1), [slide, setSlide] = useState(0), [swipe, setSwipe] = useState(0), [intro, setIntro] = useState(false), [dragged, setDragged] = useState(false);
    const height = 760, phone = width < 640;
    useEffect(() => { const el = container.current; if (!el)
        return; const observer = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); observer.observe(el); return () => observer.disconnect(); }, []);
    useEffect(() => { const el = stage.current; if (!el || phone || mode !== 'canvas')
        return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) {
        setIntro(true);
        observer.disconnect();
    } }, { threshold: .35 }); observer.observe(el); return () => observer.disconnect(); }, [phone, mode]);
    useEffect(() => { function escape(e: globalThis.KeyboardEvent) { if (e.key === 'Escape' && (active >= 0 || praise >= 0)) {
        if (active < 0) { setPraise(-1); return; }
        setActive(-1);
        setPraise(-1);
        setZoom(1);
        setPoint(constrain({ x: 0, y: 0 }, 1, width, height, bounds));
        setTravel('fly');
    } } window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, [width, active, praise]);
    function go(p: Point, z: number, t: Travel) { setPoint(p); setZoom(z); setTravel(t); }
    function changeZoom(direction: number) { const at = zoomSteps.findIndex(z => z >= zoom - .001), next = zoomSteps[clamp((at < 0 ? zoomSteps.length - 1 : at) + direction, 0, zoomSteps.length - 1)]; go(constrain(zoomAroundCenter(point, zoom, next, width, height), next, width, height, bounds), next, 'fly'); setActive(-1); console.debug('[ilse-moreno:canvas] 缩放', { from: zoom, to: next }); }
    function focus(i: number) { if (active === i) {
        router.push(basePath + '/work/' + projects[i].id);
        return;
    } const p = positions[i], panel = Math.min(360, width * .36), free = width - panel - 40, z = clamp(Math.min(2, (free - 80) / p.w, (height - 120) / (p.h + 30)), .5, 2); go({ x: (free - p.w * z) / 2 - p.x * z, y: (height - (p.h + 30) * z) / 2 - p.y * z }, z, 'fly'); setActive(i); setPraise(-1); }
    function start(e: PointerEvent<HTMLDivElement>) { if ((e.target as HTMLElement).closest('[data-canvas-ui]'))
        return; drag.current = { sx: e.clientX, sy: e.clientY, px: point.x, py: point.y, lx: e.clientX, ly: e.clientY, at: performance.now(), vx: 0, vy: 0, moved: false, target: e.target }; e.currentTarget.setPointerCapture(e.pointerId); }
    function move(e: PointerEvent<HTMLDivElement>) { const d = drag.current; if (!d)
        return; const dx = e.clientX - d.sx, dy = e.clientY - d.sy; if (!d.moved && Math.hypot(dx, dy) < 5)
        return; d.moved = true; setDragged(true); if (phone) {
        setSwipe(dx);
        return;
    } const now = performance.now(), dt = Math.max(now - d.at, 1); d.vx = (e.clientX - d.lx) / dt; d.vy = (e.clientY - d.ly) / dt; d.lx = e.clientX; d.ly = e.clientY; d.at = now; setActive(-1); setPraise(-1); go(constrain({ x: d.px + dx, y: d.py + dy }, zoom, width, height, bounds), zoom, 'none'); }
    function end() { const d = drag.current; drag.current = null; if (!d)
        return; if (phone) {
        if (d.moved && Math.abs(swipe) > 50)
            setSlide((slide + (swipe < 0 ? 1 : -1) + projects.length) % projects.length);
        setSwipe(0);
        if (!d.moved) {
            const link = container.current?.querySelector<HTMLAnchorElement>('[data-active-project]');
            link?.click();
        }
        return;
    } if (d.moved) {
        const recent = performance.now() - d.at < 60;
        go(constrain({ x: point.x + (recent ? clamp(d.vx, -1.5, 1.5) * 120 : 0), y: point.y + (recent ? clamp(d.vy, -1.5, 1.5) * 120 : 0) }, zoom, width, height, bounds), zoom, 'glide');
        console.debug('[ilse-moreno:canvas] 拖拽释放', { zoom, x: point.x, y: point.y });
        return;
    } const frame = (d.target as HTMLElement).closest<HTMLElement>('[data-frame]'); if (frame)
        focus(Number(frame.dataset.frame));
    else
        setPraise(-1); }
    function keyboard(e: KeyboardEvent<HTMLDivElement>) { if (e.target !== e.currentTarget)
        return; const steps: Record<string, Point> = { ArrowLeft: { x: 80, y: 0 }, ArrowRight: { x: -80, y: 0 }, ArrowUp: { x: 0, y: 80 }, ArrowDown: { x: 0, y: -80 } }; if (phone) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            setSlide((slide + (e.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length);
        }
        return;
    } if (steps[e.key]) {
        e.preventDefault();
        go(constrain({ x: point.x + steps[e.key].x, y: point.y + steps[e.key].y }, zoom, width, height, bounds), zoom, 'glide');
    } if (['+', '='].includes(e.key))
        changeZoom(1); if (e.key === '-')
        changeZoom(-1); }
    const duration = reduced || travel === 'none' ? 0 : travel === 'intro' ? 1.2 : travel === 'fly' ? .6 : .35;
    if (!projects.length) return <div className="im-glass">{text(locale,'暂无作品','No projects yet')}</div>;
    return <div ref={container} className="im-work-canvas" data-mode={mode} data-zoom={Math.round(zoom * 100)}>
    {mode === 'list' || reduced ? <div className="im-canvas-list im-glass"><div className="im-canvas-list-head"><span>{projects.length} {text(locale, '个项目', 'projects')}</span><button className="im-btn" onClick={() => setMode('canvas')}>{text(locale, '切换画布', 'View as canvas')}</button></div>{projects.map(p => <Link key={p.id} href={basePath + '/work/' + p.id} className="im-list-row"><img src={p.cover} alt={p.name}/><div><h3>{p.name}</h3><p>{p.summary[locale]}</p></div><span>{p.name} · {text(locale, '网站', 'Website')}</span><small>2026</small></Link>)}</div> : phone ? <><div className="im-phone-stack" tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${projects[slide].name} ${slide + 1}/${projects.length}`} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={() => { drag.current = null; setSwipe(0); }} onKeyDown={keyboard}>{[2, 1, 0].map(offset => { const p = projects[(slide + offset) % projects.length]; return <motion.div key={offset} className="im-phone-card im-glass" aria-hidden={offset > 0} animate={{ x: offset === 0 ? swipe : 0, y: offset * 14, scale: 1 - offset * .04, rotate: offset === 0 ? swipe / 40 : 0, opacity: 1 - offset * .25 }} transition={{ duration: swipe !== 0 ? 0 : .3, ease: [.2, .8, .2, 1] }} style={{ zIndex: 3 - offset }}>{offset === 0 && <><span className="im-tag">{p.name} · {text(locale, '网站', 'Website')}</span><div className="im-phone-preview"><img src={p.mobile} alt={p.name} draggable={false}/><button data-canvas-ui className="im-pin" onClick={() => setPraise(slide)} aria-label={text(locale, '查看客户评价', 'Praise from') + ' ' + p.praise.name}><img src={p.praise.avatar} alt=""/><b>✓</b></button></div><Link data-active-project data-canvas-ui href={basePath + '/work/' + p.id}><h3>{p.name}</h3><p>{p.summary[locale]}</p></Link></>}</motion.div>; })}</div><div className="im-phone-controls"><div><button onClick={() => setSlide((slide - 1 + projects.length) % projects.length)} aria-label={text(locale, '上一个项目', 'Previous project')}>‹</button><span aria-live="polite">{slide + 1} / {projects.length}</span><button onClick={() => setSlide((slide + 1) % projects.length)} aria-label={text(locale, '下一个项目', 'Next project')}>›</button></div><button className="im-btn" onClick={() => setMode('list')}>{text(locale, '列表视图', 'View as list')}</button></div></> : <div ref={stage} className="im-canvas-stage" tabIndex={0} role="region" aria-label={text(locale, '作品画布，可拖拽或使用方向键平移，使用加减键缩放', 'Work canvas. Drag or use arrow keys to pan, plus and minus to zoom.')} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={() => drag.current = null} onKeyDown={keyboard} style={{ backgroundSize: `${24 * zoom}px ${24 * zoom}px`, backgroundPosition: `${point.x}px ${point.y}px` }}><motion.div className="im-canvas-plane" initial={false} animate={intro || reduced ? { x: point.x, y: point.y, scale: zoom } : { x: width / 2 - 840 * .82, y: height / 2 - 637 * .82, scale: .82 }} transition={{ duration, ease: travel === 'fly' ? [.65, 0, .35, 1] : [.22, 1, .36, 1] }}>{projects.map((p, i) => { const box = positions[i]; return <motion.div key={p.id} data-frame={i} className="im-frame" data-active={active === i} role="button" tabIndex={0} aria-label={p.name + ': ' + p.summary[locale]} onKeyDown={e => { if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        focus(i);
    } }} initial={false} animate={{ opacity: !intro && !reduced ? 0 : active >= 0 && active !== i ? .35 : 1, y: !intro && !reduced ? 16 : 0 }} transition={{ duration: reduced ? 0 : .6, delay: intro && travel === 'intro' ? .15 + i * .09 : 0 }} style={{ left: box.x, top: box.y, width: box.w }}><span className="im-frame-label">{p.name} · {text(locale, '网站', 'Website')}</span><div className="im-frame-image" style={{ height: box.h }}><img src={p.cover} alt="" draggable={false}/></div>{i < 3 && <button data-canvas-ui className="im-pin" aria-label={text(locale, '查看客户评价', 'Praise from') + ' ' + p.praise.name} aria-expanded={praise === i} onClick={() => setPraise(praise === i ? -1 : i)} style={{ transform: `scale(${1 / zoom})` }}><img src={p.praise.avatar} alt=""/><b>✓</b></button>}</motion.div>; })}</motion.div>{!dragged && active < 0 && <span className="im-drag-hint">{text(locale, '拖拽探索作品', 'Drag to look around')}</span>}<button data-canvas-ui className="im-btn im-canvas-list-button" onClick={() => { setMode('list'); setActive(-1); }}>{text(locale, '列表视图', 'View as list')}</button><div data-canvas-ui className="im-canvas-tools"><div className="im-minimap" aria-hidden="true">{positions.map((p, i) => <i key={i} style={{ left: 10 + p.x * .09, top: 10 + p.y * .09, width: p.w * .09, height: p.h * .09 }}/>)}<b style={{ left: 10 + clamp(-point.x / zoom * .09, 0, 145), top: 10 + clamp(-point.y / zoom * .09, 0, 100), width: Math.min(145, width / zoom * .09), height: Math.min(100, height / zoom * .09) }}/></div><div className="im-zoom"><button aria-label={text(locale, '缩小', 'Zoom out')} disabled={zoom <= .5} onClick={() => changeZoom(-1)}>−</button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button aria-label={text(locale, '放大', 'Zoom in')} disabled={zoom >= 2} onClick={() => changeZoom(1)}>+</button></div></div>{active >= 0 && <motion.aside data-canvas-ui className="im-project-panel im-glass" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .45 }}><span className="im-tag">{projects[active].name} · {text(locale, '网站', 'Website')}</span><h3>{projects[active].name}</h3><p>{projects[active].summary[locale]}</p><dl><dt>{text(locale, '角色', 'Role')}</dt><dd>{projects[active].role[locale]}</dd><dt>{text(locale, '年份', 'Year')}</dt><dd>2026</dd><dt>{text(locale, '成果', 'Result')}</dt><dd>{projects[active].outcome[locale]}</dd></dl><Link className="im-btn im-dark" href={basePath + '/work/' + projects[active].id}>{text(locale, '查看完整案例', 'Open case study')}</Link><button className="im-btn" onClick={() => { setActive(-1); go(constrain({ x: 0, y: 0 }, 1, width, height, bounds), 1, 'fly'); }}>{text(locale, '返回画布', 'Back to canvas')}</button></motion.aside>}{praise >= 0 && <aside data-canvas-ui role="dialog" aria-label={text(locale, '客户评价', 'Client praise')} className="im-canvas-praise im-glass" style={{ left: clamp(point.x + (positions[praise].x + positions[praise].w) * zoom - 30, 20, width - 420), top: clamp(point.y + (positions[praise].y + positions[praise].h * .5) * zoom, 20, height - 350) }}><button className="im-close" onClick={() => setPraise(-1)} aria-label={text(locale, '关闭评价', 'Close praise')}>×</button><Praise project={projects[praise]} locale={locale}/><Link className="im-btn" href={basePath + '/work/' + projects[praise].id}>{text(locale, '查看项目', 'Open project')}</Link></aside>}</div>}
    <Modal open={phone && praise >= 0} onClose={() => setPraise(-1)} label={text(locale, '客户评价', 'Client praise')}>{praise >= 0 && <><Praise project={projects[praise]} locale={locale}/><Link className="im-btn im-dark" href={basePath + '/work/' + projects[praise].id}>{text(locale, '查看项目', 'Open project')}</Link></>}</Modal></div>;
}
